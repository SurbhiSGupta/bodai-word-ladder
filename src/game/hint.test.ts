import { describe, expect, it } from 'vitest';
import { maskClue, nextStep, ordinal } from './hint.ts';
import { buildNeighborIndex } from './ladder.ts';

const index = buildNeighborIndex(['fire', 'fore', 'core', 'cord', 'cold', 'hire', 'echo']);

describe('nextStep', () => {
  it('points at the next word on a shortest way up', () => {
    expect(nextStep('fire', 'cold', index)).toEqual({
      word: 'fore',
      position: 1,
      letter: 'o',
      stepsLeft: 4,
    });
  });

  it('works from wherever the player is, even after a detour', () => {
    expect(nextStep('hire', 'cold', index)?.word).toBe('fire');
  });

  it('works from a word that is not in the everyday list', () => {
    expect(nextStep('cork', 'cold', index)?.word).toBe('cord');
  });

  it('says so when there is no way up from here', () => {
    expect(nextStep('echo', 'cold', index)).toBeNull();
    expect(nextStep('cold', 'cold', index)).toBeNull();
  });
});

describe('ordinal', () => {
  it('reads naturally', () => {
    expect(ordinal(0)).toBe('first');
    expect(ordinal(2)).toBe('third');
  });
});

describe('maskClue', () => {
  it('blanks out the word and its forms', () => {
    expect(maskClue('feline mammal; cats purr', ['cat'])).toBe('Feline mammal; ___ purr');
  });

  it('blanks out the base form too', () => {
    expect(maskClue('the cat is a cats friend', ['cats', 'cat'])).toBe('The ___ is a ___ friend');
  });

  it('drops a leading grammar note and tidies its quotes', () => {
    expect(maskClue("(often followed by `of') a large number or amount", ['slew'])).toBe(
      'A large number or amount',
    );
    expect(maskClue("say `hello' warmly", ['greet'])).toBe('Say ‘hello’ warmly');
  });

  it('leaves other words alone', () => {
    expect(maskClue('a written work', ['book'])).toBe('A written work');
  });
});
