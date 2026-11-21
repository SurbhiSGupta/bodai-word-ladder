/**
 * Loads the word lists and meanings for one word length, only when that length is played,
 * so the game starts small. Everything here is built by `npm run words`.
 */

import blocked from '../data/blocked.json';
import { makeDictionary, type Dictionary } from '../game/dictionary.ts';
import {
  buildNeighborIndex,
  randomPuzzle,
  type NeighborIndex,
  type Puzzle,
} from '../game/ladder.ts';
import { seededRandom } from '../game/random.ts';

export const LENGTHS = [3, 4, 5] as const;
export type WordLength = (typeof LENGTHS)[number];

/** How long a fair practice ladder is, by word length. */
const PAR_RANGE: Record<WordLength, [number, number]> = { 3: [3, 4], 4: [3, 5], 5: [3, 6] };

type WordFile = { common: string[]; rare: string[]; endpoints: string[] };
export type Meaning = { pos: string; text: string; base?: string };

const WORD_FILES: Record<WordLength, () => Promise<{ default: WordFile }>> = {
  3: () => import('../data/words-3.json'),
  4: () => import('../data/words-4.json'),
  5: () => import('../data/words-5.json'),
};

const MEANING_FILES: Record<WordLength, () => Promise<{ default: Record<string, Meaning[]> }>> = {
  3: () => import('../data/meanings-3.json'),
  4: () => import('../data/meanings-4.json'),
  5: () => import('../data/meanings-5.json'),
};

export type WordData = {
  length: WordLength;
  dictionary: Dictionary;
  index: NeighborIndex;
  endpoints: string[];
};

const cache = new Map<WordLength, Promise<WordData>>();

export function loadWords(length: WordLength): Promise<WordData> {
  let loading = cache.get(length);
  if (!loading) {
    loading = WORD_FILES[length]().then(({ default: words }) => ({
      length,
      dictionary: makeDictionary(words, blocked),
      index: buildNeighborIndex(words.common),
      endpoints: words.endpoints,
    }));
    cache.set(length, loading);
  }
  return loading;
}

export async function loadMeanings(length: WordLength): Promise<Record<string, Meaning[]>> {
  return (await MEANING_FILES[length]()).default;
}

/** A fresh random practice puzzle. */
export function practicePuzzle(data: WordData, seed = Date.now()): Puzzle {
  const [minPar, maxPar] = PAR_RANGE[data.length];
  const puzzle = randomPuzzle(seededRandom(seed), {
    endpoints: data.endpoints,
    index: data.index,
    minPar,
    maxPar,
  });
  if (!puzzle) throw new Error(`No ${data.length}-letter puzzle found`);
  return puzzle;
}
