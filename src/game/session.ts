/**
 * One game of word ladder: the start and end words, the rungs added so far, bones used,
 * and what happens when the player tries a word. Pure functions over plain data, so the
 * UI (and the tests) just call them and render the result.
 */

import type { Dictionary } from './dictionary.ts';
import { isOneLetterApart } from './neighbors.ts';

export type Ladder = {
  start: string;
  end: string;
  /** Words added after the start, in order. The last one is the end word once solved. */
  rungs: string[];
  /** Words tried that weren't in the list. Each one eats a bone. */
  bonesUsed: number;
  /** Rungs taken back with Undo, most recent last, so Redo can put them back. */
  undone: string[];
};

/** What happened when the player tried a word. */
export type MoveResult =
  | 'added'
  | 'solved'
  | 'incomplete'
  | 'same-word'
  | 'not-one-letter'
  | 'already-used'
  | 'blocked'
  | 'not-a-word';

export function newLadder(start: string, end: string): Ladder {
  return { start, end, rungs: [], bonesUsed: 0, undone: [] };
}

/** The word the next rung changes: the last rung, or the start word. */
export function currentWord(ladder: Ladder): string {
  return ladder.rungs.at(-1) ?? ladder.start;
}

export function isSolved(ladder: Ladder): boolean {
  return currentWord(ladder) === ladder.end;
}

/** True when every bone is gone. Without a limit (unlimited bones), never. */
export function isOutOfBones(ladder: Ladder, bones?: number): boolean {
  return bones !== undefined && ladder.bonesUsed >= bones;
}

/**
 * Checks a word without changing anything. Order matters: shape problems first (cost
 * nothing), then a blocked word (costs nothing), then not-a-word (eats a bone).
 */
export function checkWord(ladder: Ladder, word: string, dictionary: Dictionary): MoveResult {
  const previous = currentWord(ladder);
  if (word.length !== previous.length || word.includes(' ')) return 'incomplete';
  if (word === previous) return 'same-word';
  if (!isOneLetterApart(previous, word)) return 'not-one-letter';
  if (word === ladder.start || ladder.rungs.includes(word)) return 'already-used';
  if (dictionary.isBlocked(word)) return 'blocked';
  if (!dictionary.accepts(word) && word !== ladder.end) return 'not-a-word';
  return word === ladder.end ? 'solved' : 'added';
}

/** Tries a word. Returns the new ladder (unchanged unless the word was added or a bone eaten). */
export function tryWord(
  ladder: Ladder,
  word: string,
  dictionary: Dictionary,
): { ladder: Ladder; result: MoveResult } {
  if (isSolved(ladder)) return { ladder, result: 'solved' };
  const result = checkWord(ladder, word, dictionary);
  if (result === 'added' || result === 'solved') {
    return { ladder: { ...ladder, rungs: [...ladder.rungs, word], undone: [] }, result };
  }
  if (result === 'not-a-word') {
    return { ladder: { ...ladder, bonesUsed: ladder.bonesUsed + 1 }, result };
  }
  return { ladder, result };
}

/** Steps one rung back down. Bones stay eaten. */
export function undo(ladder: Ladder): Ladder {
  const last = ladder.rungs.at(-1);
  if (last === undefined) return ladder;
  return { ...ladder, rungs: ladder.rungs.slice(0, -1), undone: [...ladder.undone, last] };
}

/** Puts back the rung most recently taken away with Undo. */
export function redo(ladder: Ladder): Ladder {
  const word = ladder.undone.at(-1);
  if (word === undefined) return ladder;
  return { ...ladder, rungs: [...ladder.rungs, word], undone: ladder.undone.slice(0, -1) };
}

/** Same puzzle, fresh ladder and a full set of bones. */
export function restart(ladder: Ladder): Ladder {
  return newLadder(ladder.start, ladder.end);
}

/** Plain, kind words for each result, shown in a toast. */
export const RESULT_MESSAGES: Record<Exclude<MoveResult, 'added'>, string> = {
  solved: 'You did it! 🎉',
  incomplete: 'Fill in every letter',
  'same-word': 'Change one letter',
  'not-one-letter': 'Change just one letter',
  'already-used': "That word's already on the ladder",
  blocked: "Let's keep it friendly 🐾",
  'not-a-word': 'Not in our word list',
};
