/**
 * Writes src/data/challenge.json: one Challenge of the day per date, 6 letters most days
 * and 7 letters on Sundays, plus wordlists/challenge-pool.md to read through and veto.
 *
 * Run with: npm run challenge (after npm run words)
 *
 * A challenge pair has to earn its place: both words very common, not a plural or an
 * -ing/-ed/-er form, most letters different from each other, and a fair but long climb.
 * Seven-letter words barely connect, so there are only a handful of 7-letter pairs; once
 * they're used up, Sundays fall back to 6 letters.
 *
 * To veto a pair or a word, add it to wordlists/challenge-drop.txt (as "start>end" or a
 * single word). Days already in the file are never changed.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildNeighborIndex, neighborsOf, shortestPath, type Puzzle } from '../src/game/ladder.ts';
import { seedFromText, seededRandom } from '../src/game/random.ts';

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/challenge.json');
const POOL_REPORT = join(ROOT, 'wordlists/challenge-pool.md');
const FIRST_DAY = '2026-11-22';
const DAYS_AHEAD = 180;
/** No start or end word repeats within this many days. */
const FRESH_FOR = 14;

/** What makes a fair challenge, by length. Tier is SCOWL commonness (10 = very common). */
const RULES = {
  6: { maxTier: 20, minDifferent: 4, minPar: 5, maxPar: 9 },
  7: { maxTier: 35, minDifferent: 4, minPar: 5, maxPar: 9 },
} as const;
type ChallengeLength = keyof typeof RULES;

const INFLECTED = /(ing|ed|er|est|ies|s)$/;

function readList(name: string): Set<string> {
  const path = join(ROOT, 'wordlists', name);
  if (!existsSync(path)) return new Set();
  return new Set(
    readFileSync(path, 'utf8')
      .split('\n')
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line && !line.startsWith('#')),
  );
}

function tiers(maxTier: number): Set<string> {
  const words = new Set<string>();
  for (const tier of [10, 20, 35].filter((t) => t <= maxTier)) {
    for (const dialect of ['english', 'american']) {
      for (const word of require(`wordlist-english/${dialect}-words-${tier}.json`) as string[]) {
        words.add(word);
      }
    }
  }
  return words;
}

const drop = readList('challenge-drop.txt');
const noPuzzle = readList('no-puzzle.txt');

/** Every pair that passes the rules for one length, in a stable order. */
function pool(length: ChallengeLength): Puzzle[] {
  const rules = RULES[length];
  const words: { common: string[]; endpoints: string[] } = JSON.parse(
    readFileSync(join(ROOT, `src/data/words-${length}.json`), 'utf8'),
  );
  const index = buildNeighborIndex(words.common);
  const common = tiers(rules.maxTier);
  const ends = words.endpoints.filter(
    (word) =>
      common.has(word) &&
      !INFLECTED.test(word) &&
      !drop.has(word) &&
      !noPuzzle.has(word) &&
      neighborsOf(word, index).length > 0,
  );
  const isEnd = new Set(ends);
  const puzzles: Puzzle[] = [];
  for (const start of ends) {
    // Distances out to maxPar, then keep the ends that land in range.
    const distance = new Map([[start, 0]]);
    const queue = [start];
    while (queue.length) {
      const word = queue.shift()!;
      const d = distance.get(word)!;
      if (d === rules.maxPar) continue;
      for (const next of neighborsOf(word, index)) {
        if (!distance.has(next)) {
          distance.set(next, d + 1);
          queue.push(next);
        }
      }
    }
    for (const [end, par] of distance) {
      if (!isEnd.has(end) || end <= start || par < rules.minPar) continue;
      const different = [...start].filter((letter, i) => letter !== end[i]).length;
      if (different < rules.minDifferent || drop.has(`${start}>${end}`)) continue;
      puzzles.push({ start, end, par, bestPath: shortestPath(start, end, index)! });
    }
  }
  return puzzles;
}

const pools = { 6: pool(6), 7: pool(7) };

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const challenges: Record<string, Puzzle> = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, 'utf8'))
  : {};
const used = new Set(Object.values(challenges).map((p) => `${p.start}>${p.end}`));
const today = new Date().toISOString().slice(0, 10);
const last = addDays(today > FIRST_DAY ? today : FIRST_DAY, DAYS_AHEAD);
let added = 0;

for (let date = FIRST_DAY; date <= last; date = addDays(date, 1)) {
  if (challenges[date]) continue;
  const recent = new Set<string>();
  for (let back = 1; back <= FRESH_FOR; back++) {
    const earlier = challenges[addDays(date, -back)];
    if (earlier) recent.add(earlier.start).add(earlier.end);
  }
  const fresh = (p: Puzzle) =>
    !used.has(`${p.start}>${p.end}`) && !recent.has(p.start) && !recent.has(p.end);
  const sunday = new Date(`${date}T00:00:00Z`).getUTCDay() === 0;
  const choices = (sunday ? pools[7].filter(fresh) : []).concat();
  const options = choices.length ? choices : pools[6].filter(fresh);
  if (!options.length) {
    console.warn(`Ran out of challenge pairs at ${date}. Loosen RULES or add words.`);
    break;
  }
  const random = seededRandom(seedFromText(`bodai-challenge-${date}`));
  const pick = options[Math.floor(random() * options.length)]!;
  // Half the time, climb the other way round.
  const puzzle =
    random() < 0.5
      ? pick
      : { ...pick, start: pick.end, end: pick.start, bestPath: [...pick.bestPath].reverse() };
  challenges[date] = puzzle;
  used.add(`${pick.start}>${pick.end}`);
  added++;
}

const sorted = Object.fromEntries(
  Object.entries(challenges).sort(([a], [b]) => a.localeCompare(b)),
);
writeFileSync(OUT, JSON.stringify(sorted));

const lines = [
  '# Challenge pool',
  '',
  'Made by `npm run challenge`. Do not edit by hand: veto a pair or a word in',
  '`challenge-drop.txt` and run it again. Days already scheduled never change.',
  '',
];
for (const length of [6, 7] as const) {
  const rules = RULES[length];
  lines.push(
    `## ${length} letters: ${pools[length].length} pairs`,
    '',
    `SCOWL tier ${rules.maxTier} or lower, at least ${rules.minDifferent} letters different, par ${rules.minPar} to ${rules.maxPar}.`,
    '',
  );
  for (const p of pools[length]) {
    lines.push(
      `- ${p.start.toUpperCase()} → ${p.end.toUpperCase()} (par ${p.par}): ${p.bestPath.join(' ')}`,
    );
  }
  lines.push('');
}
lines.push('## Scheduled', '');
for (const [date, p] of Object.entries(sorted)) {
  lines.push(
    `- ${date}: ${p.start.toUpperCase()} → ${p.end.toUpperCase()} (${p.start.length} letters, par ${p.par})`,
  );
}
writeFileSync(POOL_REPORT, lines.join('\n') + '\n');

console.log(
  `Challenges: ${Object.keys(sorted).length} in total, ${added} added, up to ${last}. ` +
    `Pool: ${pools[6].length} six-letter, ${pools[7].length} seven-letter pairs.`,
);
