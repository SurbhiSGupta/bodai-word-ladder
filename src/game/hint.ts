/**
 * Hints: the best next step from wherever the player is now (not from the start, so a
 * hint still helps after a detour), and clues that never give the answer away.
 * Pure functions only.
 */

import { shortestPath, type NeighborIndex } from './ladder.ts';

export type NextStep = {
  /** The next word on a shortest way up. */
  word: string;
  /** Which letter changes, counting from 0. */
  position: number;
  /** The new letter at that position. */
  letter: string;
  /** Steps still needed from here, including this one. */
  stepsLeft: number;
};

/**
 * The next step on a shortest ladder from `current` to `end`, through everyday words.
 * Null when there's no way up from here (a dead end), so the player can Undo.
 */
export function nextStep(current: string, end: string, index: NeighborIndex): NextStep | null {
  if (current === end) return null;
  const path = shortestPath(current, end, index);
  const word = path?.[1];
  if (!path || !word) return null;
  const position = Array.from(word).findIndex((letter, i) => letter !== current[i]);
  return { word, position, letter: word[position]!, stepsLeft: path.length - 1 };
}

const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];

/** "the 3rd letter" reads stiffly out loud; "the third letter" doesn't. */
export function ordinal(position: number): string {
  return ORDINALS[position] ?? `${position + 1}th`;
}

/**
 * A meaning turned into a crossword-style clue: the word itself (and its base form, and
 * any word starting with it) becomes a blank, so "cats: plural of cat" can't give CAT away.
 */
export function maskClue(text: string, hidden: readonly string[]): string {
  // WordNet notes like "(often followed by `of')" read oddly as a clue: drop a leading note,
  // and turn its `quote' marks into ordinary ones.
  let clue = text.replace(/^\([^)]*\)\s*/, '').replace(/`([^']*)'/g, '‘$1’');
  for (const word of hidden.filter(Boolean).sort((a, b) => b.length - a.length)) {
    clue = clue.replace(new RegExp(`\\b${word}\\w*`, 'gi'), '___');
  }
  return clue.charAt(0).toUpperCase() + clue.slice(1);
}
