/**
 * Word ladder logic: who is one step from whom, the shortest path between two words,
 * dead-end words, and picking a fair random puzzle.
 *
 * Words are treated as a graph: each word links to every word one letter away.
 * Pure functions only, shared by the app and the offline scripts in /scripts.
 */

import { hasDoubledLetter } from './neighbors.ts';
import { pickOne, type Random } from './random.ts';

/**
 * Groups words by pattern, so neighbors are found without comparing every pair.
 * COLD is filed under "_OLD", "C_LD", "CO_D" and "COL_".
 */
export type NeighborIndex = ReadonlyMap<string, readonly string[]>;

function patternsOf(word: string): string[] {
  const patterns: string[] = [];
  for (let i = 0; i < word.length; i++) {
    patterns.push(word.slice(0, i) + '_' + word.slice(i + 1));
  }
  return patterns;
}

export function buildNeighborIndex(words: Iterable<string>): NeighborIndex {
  const index = new Map<string, string[]>();
  for (const word of words) {
    for (const pattern of patternsOf(word)) {
      const bucket = index.get(pattern);
      if (bucket) bucket.push(word);
      else index.set(pattern, [word]);
    }
  }
  return index;
}

/** Every word in the index that is exactly one letter away from `word`. */
export function neighborsOf(word: string, index: NeighborIndex): string[] {
  const found: string[] = [];
  for (const pattern of patternsOf(word)) {
    for (const other of index.get(pattern) ?? []) {
      if (other !== word) found.push(other);
    }
  }
  return found;
}

/** True when no word in the index is one letter away, like an island. */
export function isDeadEnd(word: string, index: NeighborIndex): boolean {
  return neighborsOf(word, index).length === 0;
}

/**
 * Distance (in steps) from `start` to every word it can reach, by breadth-first search.
 * The start itself is at distance 0. Also keeps each word's previous step, to rebuild paths.
 */
function explore(start: string, index: NeighborIndex) {
  const distance = new Map<string, number>([[start, 0]]);
  const previous = new Map<string, string>();
  const queue = [start];

  for (let head = 0; head < queue.length; head++) {
    const word = queue[head]!;
    const next = distance.get(word)! + 1;
    for (const neighbor of neighborsOf(word, index)) {
      if (distance.has(neighbor)) continue;
      distance.set(neighbor, next);
      previous.set(neighbor, word);
      queue.push(neighbor);
    }
  }
  return { distance, previous };
}

/**
 * The shortest ladder from `start` to `end`, including both ends,
 * or null when there is no path at all.
 */
export function shortestPath(start: string, end: string, index: NeighborIndex): string[] | null {
  if (start.length !== end.length) return null;
  if (start === end) return [start];

  const { previous } = explore(start, index);
  if (!previous.has(end)) return null;

  const path = [end];
  let word = end;
  while (word !== start) {
    word = previous.get(word)!;
    path.push(word);
  }
  return path.reverse();
}

export type Puzzle = {
  start: string;
  end: string;
  /** Fewest steps needed. A step is one changed letter, so par 4 means 4 new words. */
  par: number;
  /** One shortest ladder, from start to end. */
  bestPath: string[];
};

export type PuzzleOptions = {
  /** Words allowed as the start or end (common, not a plural, and so on). */
  endpoints: readonly string[];
  /** The graph to climb through, usually the common words. */
  index: NeighborIndex;
  minPar: number;
  maxPar: number;
  /** Start and end words with a doubled letter (BOOK) are skipped unless this is true. */
  allowDoubledEnds?: boolean;
  /** How many start words to try before giving up. */
  attempts?: number;
};

/**
 * Picks a random puzzle whose par is between minPar and maxPar.
 * Returns null if none was found, which only happens with very tight options.
 */
export function randomPuzzle(random: Random, options: PuzzleOptions): Puzzle | null {
  const { index, minPar, maxPar, allowDoubledEnds = false, attempts = 200 } = options;
  const endpoints = allowDoubledEnds
    ? options.endpoints
    : options.endpoints.filter((word) => !hasDoubledLetter(word));
  const isEndpoint = new Set(endpoints);

  for (let attempt = 0; attempt < attempts; attempt++) {
    const start = pickOne(endpoints, random);
    if (!start) return null;

    const { distance, previous } = explore(start, index);
    const candidates = [...distance]
      .filter(([word, steps]) => steps >= minPar && steps <= maxPar && isEndpoint.has(word))
      .map(([word]) => word)
      .sort();
    const end = pickOne(candidates, random);
    if (!end) continue;

    const bestPath = [end];
    for (let word = end; word !== start;) {
      word = previous.get(word)!;
      bestPath.push(word);
    }
    bestPath.reverse();
    return { start, end, par: bestPath.length - 1, bestPath };
  }
  return null;
}
