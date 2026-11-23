/**
 * Writes src/data/daily.json: one 4-letter puzzle per day, the same for everyone.
 *
 * Run with: npm run daily (after npm run words)
 *
 * Days already in the file are never changed, so a word-list update can't rewrite
 * a puzzle someone has played. New days are added up to a year ahead.
 *
 * Fridays are Opposites day: the next unused pair from wordlists/opposites.txt, in file
 * order. That is the one exception to "never changed": a plain Friday that's still in the
 * future (so nobody can have played it) becomes an Opposites day.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildNeighborIndex, randomPuzzle, shortestPath, type Puzzle } from '../src/game/ladder.ts';
import { seedFromText, seededRandom } from '../src/game/random.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/daily.json');
const FIRST_DAY = '2026-11-21';
const DAYS_AHEAD = 365;
/** No start or end word repeats within this many days. */
const FRESH_FOR = 60;

type DailyFile = Record<string, Puzzle>;

const words: { common: string[]; endpoints: string[] } = JSON.parse(
  readFileSync(join(ROOT, 'src/data/words-4.json'), 'utf8'),
);
const index = buildNeighborIndex(words.common);
const daily: DailyFile = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};

/** Dates as YYYY-MM-DD, counted in UTC so the list is the same on every machine. */
function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const today = new Date().toISOString().slice(0, 10);
const last = addDays(today > FIRST_DAY ? today : FIRST_DAY, DAYS_AHEAD);
let added = 0;

for (let date = FIRST_DAY; date <= last; date = addDays(date, 1)) {
  if (daily[date]) continue;
  const recent = new Set<string>();
  for (let back = 1; back <= FRESH_FOR; back++) {
    const earlier = daily[addDays(date, -back)];
    if (earlier) recent.add(earlier.start).add(earlier.end);
  }
  const endpoints = words.endpoints.filter((word) => !recent.has(word));
  const puzzle = randomPuzzle(seededRandom(seedFromText(`bodai-daily-${date}`)), {
    endpoints,
    index,
    minPar: 4,
    maxPar: 5,
  });
  if (!puzzle) throw new Error(`No daily puzzle for ${date}`);
  daily[date] = puzzle;
  added++;
}

// ---------- Opposites day ----------

const OPPOSITE_PAR = { min: 3, max: 7 };
const common = new Set(words.common);
const usedPairs = new Set(
  Object.values(daily)
    .filter((p) => p.theme === 'opposites')
    .map((p) => `${p.start}>${p.end}`),
);
const opposites: Puzzle[] = [];
for (const line of readFileSync(join(ROOT, 'wordlists/opposites.txt'), 'utf8').split('\n')) {
  const pair = line.trim().toLowerCase();
  if (!pair || pair.startsWith('#') || usedPairs.has(pair)) continue;
  const [start = '', end = ''] = pair.split('>');
  const path = common.has(start) && common.has(end) ? shortestPath(start, end, index) : null;
  const par = path ? path.length - 1 : 0;
  if (!path || par < OPPOSITE_PAR.min || par > OPPOSITE_PAR.max) {
    console.warn(
      `Skipping opposites ${pair}: ${path ? `par ${par}` : 'no path through common words'}.`,
    );
    continue;
  }
  opposites.push({ start, end, par, bestPath: path, theme: 'opposites' });
}

let themed = 0;
for (let date = addDays(today, 1); date <= last; date = addDays(date, 1)) {
  const friday = new Date(`${date}T00:00:00Z`).getUTCDay() === 5;
  if (!friday || daily[date]?.theme) continue;
  const next = opposites.shift();
  if (!next) {
    console.warn(`Opposites list used up at ${date}. Add pairs to wordlists/opposites.txt.`);
    break;
  }
  daily[date] = next;
  themed++;
}

const sorted = Object.fromEntries(Object.entries(daily).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify(sorted));
console.log(
  `Daily puzzles: ${Object.keys(sorted).length} in total, ${added} added, up to ${last}. ` +
    `${themed} Fridays became Opposites day; ${opposites.length} pairs left.`,
);
