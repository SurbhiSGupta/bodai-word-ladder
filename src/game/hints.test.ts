import { describe, expect, it } from 'vitest';
import { letterHints } from './hints.ts';

describe('letterHints', () => {
  it('marks letters already in the right place', () => {
    expect(letterHints('cord', 'cold')).toEqual(['match', 'match', 'none', 'match']);
  });

  it('marks letters the end word needs somewhere else', () => {
    expect(letterHints('fore', 'cold')).toEqual(['none', 'match', 'none', 'none']);
    expect(letterHints('dolt', 'cold')).toEqual(['near', 'match', 'match', 'none']);
  });

  it('only marks as many repeats as the end word has', () => {
    expect(letterHints('book', 'cold')).toEqual(['none', 'match', 'none', 'none']);
    expect(letterHints('oboe', 'cold')).toEqual(['near', 'none', 'none', 'none']);
  });

  it('marks everything when the word is the end word', () => {
    expect(letterHints('cold', 'cold')).toEqual(['match', 'match', 'match', 'match']);
  });
});
