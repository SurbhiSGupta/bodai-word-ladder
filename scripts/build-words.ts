/**
 * Builds the game's word lists, meanings and blocklist into src/data,
 * plus a human-readable report and the review list in /wordlists.
 *
 * Run with: npm run words
 *
 * Sources (all installed as dev dependencies, so nothing is fetched at runtime):
 * - SCOWL word lists, via `wordlist-english`. Each word has a commonness tier (10 = very common, 70 = rare).
 * - WordNet 3.1, via `wordnet-db`, for meanings.
 * - LDNOOBW, via `naughty-words`, for blocked words.
 * Hand-edited inputs live in /wordlists (never.txt, mild.txt, keep.txt, drop.txt, no-puzzle.txt).
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildNeighborIndex, isDeadEnd, randomPuzzle, shortestPath } from '../src/game/ladder.ts';
import { seededRandom } from '../src/game/random.ts';

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data');
const LISTS = join(ROOT, 'wordlists');

const LENGTHS = [3, 4, 5, 6, 7];
const TIERS = [10, 20, 35, 40, 50, 55, 60, 70];
/** Words at or below this tier are "common": used for puzzles, hints and suggestions. */
const COMMON_TIER = 35;
/** Words at or below this tier are accepted when typed. */
const ACCEPTED_TIER = 70;

/** Par ranges used for the sample puzzles in the report. */
const SAMPLE_PAR: Record<number, [number, number]> = {
  3: [3, 4],
  4: [3, 6],
  5: [3, 7],
  6: [3, 8],
  7: [3, 8],
};

// ---------- Inputs ----------

const isPlainWord = (word: string) => /^[a-z]+$/.test(word);

/**
 * Each word with the lowest (most common) SCOWL tier it appears in, for every length.
 * US and shared spellings only.
 */
function loadTiers(): Map<string, number> {
  const tierOf = new Map<string, number>();
  for (const tier of TIERS) {
    for (const dialect of ['english', 'american']) {
      const words: string[] = require(`wordlist-english/${dialect}-words-${tier}.json`);
      for (const word of words) {
        if (isPlainWord(word) && !tierOf.has(word)) tierOf.set(word, tier);
      }
    }
  }
  return tierOf;
}

/** Reads a hand-edited list: one word per line, # starts a note. */
function readList(name: string): Set<string> {
  const text = readFileSync(join(LISTS, name), 'utf8');
  return new Set(
    text
      .split('\n')
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line && !line.startsWith('#')),
  );
}

// ---------- Meanings (WordNet) ----------

type Meaning = { pos: 'noun' | 'verb' | 'adj' | 'adv'; text: string; base?: string };

const POS = { noun: 'noun', verb: 'verb', adj: 'adj', adv: 'adv' } as const;

function loadWordNet() {
  const dict = join(dirname(require.resolve('wordnet-db/package.json')), 'dict');
  const senses = new Map<string, { pos: Meaning['pos']; offset: string; tagged: number }[]>();
  const glosses = new Map<string, string>();

  for (const pos of Object.values(POS)) {
    for (const line of readFileSync(join(dict, `index.${pos}`), 'utf8').split('\n')) {
      if (!line || line.startsWith(' ')) continue;
      const parts = line.trim().split(' ');
      const lemma = parts[0]!;
      if (!isPlainWord(lemma)) continue;
      const synsetCount = Number(parts[2]);
      const pointerCount = Number(parts[3]);
      const tagged = Number(parts[5 + pointerCount]);
      const offset = parts[parts.length - synsetCount]!; // first (most frequent) sense
      const list = senses.get(lemma) ?? [];
      list.push({ pos, offset, tagged });
      senses.set(lemma, list);
    }
    for (const line of readFileSync(join(dict, `data.${pos}`), 'utf8').split('\n')) {
      if (!line || line.startsWith(' ')) continue;
      const gloss = line.split(' | ')[1] ?? '';
      const definition = gloss.split('; "')[0]!.replace(/;\s*$/, '').trim();
      glosses.set(`${pos}:${line.slice(0, 8)}`, definition);
    }
  }

  /** Simple English endings, so CATS finds CAT and STOPPED finds STOP. */
  function baseForms(word: string): string[] {
    const forms: string[] = [];
    if (word.endsWith('ies')) forms.push(word.slice(0, -3) + 'y');
    if (word.endsWith('s') && !word.endsWith('ss')) forms.push(word.slice(0, -1)); // ANTES -> ANTE
    if (word.endsWith('es')) forms.push(word.slice(0, -2)); // BOXES -> BOX
    if (word.endsWith('ed')) forms.push(word.slice(0, -2), word.slice(0, -1));
    if (word.endsWith('ing')) forms.push(word.slice(0, -3), word.slice(0, -3) + 'e');
    for (const form of [...forms]) {
      if (/(.)\1$/.test(form)) forms.push(form.slice(0, -1)); // STOPP -> STOP
    }
    return forms.filter((form) => form.length >= 2);
  }

  return function meaningsOf(word: string): Meaning[] {
    for (const lemma of [word, ...baseForms(word)]) {
      const found = senses.get(lemma);
      if (!found) continue;
      return [...found]
        .sort((a, b) => b.tagged - a.tagged)
        .slice(0, 2)
        .map(({ pos, offset }) => {
          const meaning: Meaning = { pos, text: glosses.get(`${pos}:${offset}`) ?? '' };
          if (lemma !== word) meaning.base = lemma;
          return meaning;
        })
        .filter((meaning) => meaning.text);
    }
    return [];
  };
}

// ---------- Rules ----------

/**
 * True for plurals and past/-ing forms whose base word is also a word (CATS, FIRED, BAKING).
 * `known` holds words of every length, since the base word is always shorter.
 */
function isInflection(word: string, known: ReadonlySet<string>): boolean {
  if (word.endsWith('s') && !word.endsWith('ss')) {
    if (known.has(word.slice(0, -1))) return true;
    if (word.endsWith('es') && known.has(word.slice(0, -2))) return true;
    if (word.endsWith('ies') && known.has(word.slice(0, -3) + 'y')) return true;
  }
  if (word.endsWith('ed') && (known.has(word.slice(0, -2)) || known.has(word.slice(0, -1)))) {
    return true;
  }
  if (
    word.endsWith('ing') &&
    (known.has(word.slice(0, -3)) || known.has(word.slice(0, -3) + 'e'))
  ) {
    return true;
  }
  return false;
}

// ---------- Build ----------

const allTiers = loadTiers();
const knownWords: ReadonlySet<string> = new Set(allTiers.keys());
const tierOf = new Map([...allTiers].filter(([word]) => LENGTHS.includes(word.length)));
const mild = readList('mild.txt');
const keep = readList('keep.txt');
const drop = readList('drop.txt');
const noPuzzle = readList('no-puzzle.txt');
const naughty: string[] = [...require('naughty-words/en.json'), ...readList('never.txt')];
const never = new Set(
  naughty
    .map((word) => word.toLowerCase())
    .filter((word) => isPlainWord(word) && LENGTHS.includes(word.length) && !mild.has(word)),
);
// Plurals and past forms of a blocked word are blocked too (DICK → DICKS, SEX → SEXED).
const blockedBases = new Set([...never].filter((word) => !mild.has(word)));
for (const word of tierOf.keys()) {
  // Only real endings: ASSETS is not ASS + "ets".
  const bases: string[] = [];
  if (word.endsWith('s')) bases.push(word.slice(0, -1));
  if (word.endsWith('es') || word.endsWith('ed')) bases.push(word.slice(0, -2));
  if (word.endsWith('ed')) bases.push(word.slice(0, -1));
  if (word.endsWith('ing')) bases.push(word.slice(0, -3));
  // SPICES, JAPED and BUTTES are forms of SPICE, JAPE and BUTTE, not of a blocked word.
  const siblings: string[] = [];
  if (word.endsWith('es') || word.endsWith('ed')) siblings.push(word.slice(0, -1));
  if (word.endsWith('ing')) siblings.push(word.slice(0, -3) + 'e');
  const innocentBase = siblings.some((base) => allTiers.has(base) && !blockedBases.has(base));
  if (!never.has(word) && !innocentBase && bases.some((base) => blockedBases.has(base))) {
    never.add(word);
  }
}
const meaningsOf = loadWordNet();

mkdirSync(OUT, { recursive: true });
const report: string[] = [
  '# Word list report',
  '',
  'Made by `npm run words`. Do not edit by hand.',
  '',
  `Common = SCOWL tier ${COMMON_TIER} or lower, plus keep.txt, minus drop.txt and blocked words.`,
  `Accepted = everything up to tier ${ACCEPTED_TIER}, minus "never" words.`,
  'Endpoints = common words that can start or end a puzzle (no plurals or -ed/-ing forms).',
  '',
  '| Letters | Common | Also accepted | Endpoints | Dead ends (common) | Dead ends (accepted) | Pairs with a path | With meanings |',
  '|---|---|---|---|---|---|---|---|',
];
const samples: string[] = [];
const reviewOdd: { word: string; length: number }[] = [];
const reviewMissing: { word: string; length: number; meaning: string }[] = [];

for (const length of LENGTHS) {
  const all = [...tierOf].filter(([word]) => word.length === length);
  const accepted = new Set(all.filter(([word]) => !never.has(word)).map(([word]) => word));
  for (const word of keep) if (word.length === length) accepted.add(word);

  const common = [...accepted]
    .filter((word) => (tierOf.get(word)! <= COMMON_TIER || keep.has(word)) && !drop.has(word))
    .filter((word) => !mild.has(word))
    .sort();
  const commonSet = new Set(common);
  const rare = [...accepted].filter((word) => !commonSet.has(word)).sort();
  const commonIndex = buildNeighborIndex(common);
  const acceptedIndex = buildNeighborIndex(accepted);
  const endpoints = common.filter(
    (word) =>
      !isInflection(word, knownWords) && !noPuzzle.has(word) && !isDeadEnd(word, commonIndex),
  );

  const deadCommon = common.filter((word) => isDeadEnd(word, commonIndex));
  const deadAccepted = [...accepted].filter((word) => isDeadEnd(word, acceptedIndex)).sort();

  // How often do two random endpoints connect? Sampled, since checking every pair is slow.
  const random = seededRandom(length);
  let connected = 0;
  const SAMPLE_PAIRS = 300;
  for (let i = 0; i < SAMPLE_PAIRS; i++) {
    const a = endpoints[Math.floor(random() * endpoints.length)]!;
    const b = endpoints[Math.floor(random() * endpoints.length)]!;
    if (shortestPath(a, b, commonIndex)) connected++;
  }

  const meanings: Record<string, Meaning[]> = {};
  for (const word of [...accepted].sort()) {
    const found = meaningsOf(word);
    if (found.length) meanings[word] = found;
  }

  writeFileSync(join(OUT, `words-${length}.json`), JSON.stringify({ common, rare, endpoints }));
  writeFileSync(join(OUT, `meanings-${length}.json`), JSON.stringify(meanings));

  report.push(
    `| ${length} | ${common.length} | ${rare.length} | ${endpoints.length} | ${deadCommon.length} | ${deadAccepted.length} | ${Math.round((connected / SAMPLE_PAIRS) * 100)}% | ${Math.round((Object.keys(meanings).length / accepted.size) * 100)}% |`,
  );

  const [minPar, maxPar] = SAMPLE_PAR[length]!;
  samples.push(``, `### ${length} letters (par ${minPar} to ${maxPar})`, '');
  for (let seed = 1; seed <= 6; seed++) {
    const puzzle = randomPuzzle(seededRandom(seed * 100 + length), {
      endpoints,
      index: commonIndex,
      minPar,
      maxPar,
    });
    samples.push(
      puzzle
        ? `- **${puzzle.start.toUpperCase()} → ${puzzle.end.toUpperCase()}**, par ${puzzle.par}: ${puzzle.bestPath.join(' → ')}`
        : '- (no puzzle found)',
    );
  }
  samples.push('', `Dead ends among common words: ${deadCommon.slice(0, 30).join(', ') || 'none'}`);

  // Review lists: only for the lengths used in everyday play.
  if (length <= 5) {
    for (const word of common)
      if (!meanings[word] && !keep.has(word)) reviewOdd.push({ word, length });
    for (const word of rare) {
      if (
        tierOf.get(word) === 40 &&
        !mild.has(word) &&
        meanings[word] &&
        !isDeadEnd(word, commonIndex)
      ) {
        reviewMissing.push({ word, length, meaning: meanings[word]![0]!.text });
      }
    }
  }
}

writeFileSync(
  join(OUT, 'blocked.json'),
  JSON.stringify({ never: [...never].sort(), mild: [...mild].sort() }),
);
writeFileSync(
  join(LISTS, 'report.md'),
  [...report, '', '## Sample puzzles', ...samples, ''].join('\n'),
);
writeFileSync(
  join(LISTS, 'review.json'),
  JSON.stringify({ maybeOdd: reviewOdd, maybeMissing: reviewMissing }, null, 1),
);

console.log(report.slice(9).join('\n'));
console.log(
  `\nReview: ${reviewOdd.length} maybe-odd common words, ${reviewMissing.length} maybe-missing words.`,
);
