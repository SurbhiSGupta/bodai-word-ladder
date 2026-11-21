/**
 * Which words the game accepts, and which it gently refuses.
 * Built from the generated lists in src/data. Pure: no fetching, no storage.
 */

export type WordLists = {
  /** Everyday words: puzzles, hints and suggestions. */
  common: readonly string[];
  /** Real but less common words: accepted when typed, never suggested. */
  rare: readonly string[];
};

export type Blocklist = {
  /** Always refused. */
  never: readonly string[];
  /** Refused while Family-friendly is on. */
  mild: readonly string[];
};

export type Dictionary = {
  /** A real word the player may use. */
  accepts: (word: string) => boolean;
  /** A word we refuse kindly ("Let's keep it friendly"). */
  isBlocked: (word: string) => boolean;
  isCommon: (word: string) => boolean;
};

export function makeDictionary(
  lists: WordLists,
  blocklist: Blocklist,
  { familyFriendly = true } = {},
): Dictionary {
  const common = new Set(lists.common);
  const blocked = new Set([...blocklist.never, ...(familyFriendly ? blocklist.mild : [])]);
  const accepted = new Set([...lists.common, ...lists.rare]);
  if (!familyFriendly) for (const word of blocklist.mild) accepted.add(word);

  return {
    accepts: (word) => accepted.has(word) && !blocked.has(word),
    isBlocked: (word) => blocked.has(word),
    isCommon: (word) => common.has(word),
  };
}
