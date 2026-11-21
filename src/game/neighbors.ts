/**
 * The one rule of a classic word ladder: each step changes exactly one letter,
 * and the word keeps its length.
 *
 * Pure functions only. No React and no browser APIs, so this is easy to test.
 */

/** True when `a` and `b` are the same length and differ in exactly one position. */
export function isOneLetterApart(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let differences = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) differences++;
    if (differences > 1) return false;
  }
  return differences === 1;
}

/** True when the word has the same letter twice in a row, like BOOK or BEEF. */
export function hasDoubledLetter(word: string): boolean {
  for (let i = 1; i < word.length; i++) {
    if (word[i] === word[i - 1]) return true;
  }
  return false;
}
