import { describe, expect, it } from 'vitest';
import { makeDictionary } from './dictionary.ts';
import {
  checkWord,
  currentWord,
  isOutOfBones,
  newLadder,
  redo,
  restart,
  tryWord,
  undo,
} from './session.ts';

const dictionary = makeDictionary(
  { common: ['fire', 'fore', 'core', 'cord', 'cold', 'hire'], rare: ['fere'] },
  { never: ['dork'], mild: ['damn'] },
);

describe('tryWord', () => {
  it('adds a real word one letter away', () => {
    const { ladder, result } = tryWord(newLadder('fire', 'cold'), 'fore', dictionary);
    expect(result).toBe('added');
    expect(currentWord(ladder)).toBe('fore');
  });

  it('accepts rare words when typed', () => {
    expect(tryWord(newLadder('fire', 'cold'), 'fere', dictionary).result).toBe('added');
  });

  it('eats a bone for a word that is not in the list', () => {
    const { ladder, result } = tryWord(newLadder('fire', 'cold'), 'fize', dictionary);
    expect(result).toBe('not-a-word');
    expect(ladder.bonesUsed).toBe(1);
    expect(ladder.rungs).toEqual([]);
  });

  it('refuses a blocked word kindly, without eating a bone', () => {
    const start = newLadder('cork', 'cold');
    const { ladder, result } = tryWord(start, 'dork', dictionary);
    expect(result).toBe('blocked');
    expect(ladder.bonesUsed).toBe(0);
  });

  it('asks for exactly one changed letter, without eating a bone', () => {
    const { ladder, result } = tryWord(newLadder('fire', 'cold'), 'core', dictionary);
    expect(result).toBe('not-one-letter');
    expect(ladder.bonesUsed).toBe(0);
  });

  it('says when the word is unchanged or unfinished', () => {
    const ladder = newLadder('fire', 'cold');
    expect(checkWord(ladder, 'fire', dictionary)).toBe('same-word');
    expect(checkWord(ladder, 'fi', dictionary)).toBe('incomplete');
  });

  it('does not allow going back to a word already on the ladder', () => {
    const { ladder } = tryWord(newLadder('fire', 'cold'), 'hire', dictionary);
    expect(checkWord(ladder, 'fire', dictionary)).toBe('already-used');
  });

  it('solves FIRE to COLD', () => {
    let ladder = newLadder('fire', 'cold');
    for (const word of ['fore', 'core', 'cord']) ladder = tryWord(ladder, word, dictionary).ladder;
    const { result } = tryWord(ladder, 'cold', dictionary);
    expect(result).toBe('solved');
  });
});

describe('undo', () => {
  it('steps back one rung and keeps bones eaten', () => {
    let ladder = newLadder('fire', 'cold');
    ladder = tryWord(ladder, 'fize', dictionary).ladder;
    ladder = tryWord(ladder, 'fore', dictionary).ladder;
    ladder = undo(ladder);
    expect(currentWord(ladder)).toBe('fire');
    expect(ladder.bonesUsed).toBe(1);
  });
});

describe('redo', () => {
  it('puts back what undo took away, in order', () => {
    let ladder = newLadder('fire', 'cold');
    for (const word of ['fore', 'core']) ladder = tryWord(ladder, word, dictionary).ladder;
    ladder = undo(undo(ladder));
    expect(currentWord(ladder)).toBe('fire');
    ladder = redo(ladder);
    expect(currentWord(ladder)).toBe('fore');
    ladder = redo(ladder);
    expect(currentWord(ladder)).toBe('core');
    expect(redo(ladder)).toBe(ladder);
  });

  it('forgets undone rungs once a new word is added', () => {
    let ladder = tryWord(newLadder('fire', 'cold'), 'fore', dictionary).ladder;
    ladder = undo(ladder);
    ladder = tryWord(ladder, 'hire', dictionary).ladder;
    expect(ladder.undone).toEqual([]);
  });
});

describe('bones', () => {
  it('runs out at the limit, and never when unlimited', () => {
    let ladder = newLadder('fire', 'cold');
    for (let i = 0; i < 3; i++) ladder = tryWord(ladder, 'fize', dictionary).ladder;
    expect(isOutOfBones(ladder, 3)).toBe(true);
    expect(isOutOfBones(ladder, 5)).toBe(false);
    expect(isOutOfBones(ladder)).toBe(false);
  });

  it('restart gives the same puzzle with every bone back', () => {
    let ladder = tryWord(newLadder('fire', 'cold'), 'fize', dictionary).ladder;
    ladder = restart(ladder);
    expect(ladder).toEqual(newLadder('fire', 'cold'));
  });
});

describe('makeDictionary', () => {
  it('blocks mild words only while family-friendly is on', () => {
    const lists = { common: ['damn', 'dame'], rare: [] };
    const blocklist = { never: [], mild: ['damn'] };
    expect(makeDictionary(lists, blocklist).isBlocked('damn')).toBe(true);
    expect(makeDictionary(lists, blocklist, { familyFriendly: false }).accepts('damn')).toBe(true);
  });
});
