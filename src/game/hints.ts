/**
 * Letter colors for a rung, compared with the end word:
 * - match: right letter, right place (green)
 * - near: the end word has this letter, but in another place (yellow)
 * - none: the end word doesn't need this letter here
 *
 * Counts repeats like Wordle does: if the end word has one O, only one O is marked.
 */

export type LetterHint = 'match' | 'near' | 'none';

export function letterHints(word: string, endWord: string): LetterHint[] {
  const hints: LetterHint[] = Array.from(word, () => 'none');
  const unmatched = new Map<string, number>();

  for (let i = 0; i < word.length; i++) {
    if (word[i] === endWord[i]) {
      hints[i] = 'match';
    } else if (endWord[i]) {
      unmatched.set(endWord[i]!, (unmatched.get(endWord[i]!) ?? 0) + 1);
    }
  }

  for (let i = 0; i < word.length; i++) {
    const letter = word[i]!;
    const left = unmatched.get(letter) ?? 0;
    if (hints[i] !== 'match' && left > 0) {
      hints[i] = 'near';
      unmatched.set(letter, left - 1);
    }
  }
  return hints;
}
