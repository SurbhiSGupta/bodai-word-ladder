/**
 * Writes src/data/daily.json: one 4-letter puzzle per day, the same for everyone.
 *
 * Run with: npm run daily (after npm run words)
 *
 * Days already in the file are never changed, so a word-list update can't rewrite
 * a puzzle someone has played. New days are added up to a year ahead.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildNeighborIndex, randomPuzzle, type Puzzle } from '../src/game/ladder.ts';
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

const sorted = Object.fromEntries(Object.entries(daily).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify(sorted));
console.log(
  `Daily puzzles: ${Object.keys(sorted).length} in total, ${added} added, up to ${last}.`,
);
