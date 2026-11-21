import { describe, expect, it } from 'vitest';
import { isOneLetterApart } from './neighbors.ts';
import {
  buildNeighborIndex,
  isDeadEnd,
  neighborsOf,
  randomPuzzle,
  shortestPath,
} from './ladder.ts';
import { seededRandom } from './random.ts';

// A tiny dictionary so every answer can be checked by hand.
const WORDS = ['fire', 'fore', 'core', 'cord', 'cold', 'card', 'cart', 'book', 'boot', 'echo'];
const index = buildNeighborIndex(WORDS);

describe('neighborsOf', () => {
  it('finds every word one letter away', () => {
    expect(neighborsOf('cord', index).sort()).toEqual(['card', 'cold', 'core']);
  });

  it('never lists the word itself', () => {
    expect(neighborsOf('fire', index)).not.toContain('fire');
  });
});

describe('isDeadEnd', () => {
  it('spots a word with no neighbors', () => {
    expect(isDeadEnd('echo', index)).toBe(true);
  });

  it('is false for a connected word', () => {
    expect(isDeadEnd('cold', index)).toBe(false);
  });
});

describe('shortestPath', () => {
  it('finds FIRE to COLD in four steps', () => {
    expect(shortestPath('fire', 'cold', index)).toEqual(['fire', 'fore', 'core', 'cord', 'cold']);
  });

  it('returns null when there is no path', () => {
    expect(shortestPath('fire', 'book', index)).toBeNull();
  });

  it('returns null for words of different lengths', () => {
    expect(shortestPath('fire', 'fires', index)).toBeNull();
  });
});

describe('randomPuzzle', () => {
  const options = { endpoints: WORDS, index, minPar: 3, maxPar: 4 };

  it('gives a puzzle within the par range, with a valid best path', () => {
    const puzzle = randomPuzzle(seededRandom(1), options);
    expect(puzzle).not.toBeNull();
    const { start, end, par, bestPath } = puzzle!;
    expect(par).toBeGreaterThanOrEqual(3);
    expect(par).toBeLessThanOrEqual(4);
    expect(bestPath[0]).toBe(start);
    expect(bestPath.at(-1)).toBe(end);
    bestPath.slice(1).forEach((word, i) => expect(isOneLetterApart(bestPath[i]!, word)).toBe(true));
  });

  it('gives the same puzzle for the same seed', () => {
    expect(randomPuzzle(seededRandom(7), options)).toEqual(randomPuzzle(seededRandom(7), options));
  });

  it('skips doubled-letter start and end words by default', () => {
    for (let seed = 0; seed < 20; seed++) {
      const puzzle = randomPuzzle(seededRandom(seed), { ...options, minPar: 1, maxPar: 4 });
      expect(puzzle?.start).not.toBe('book');
      expect(puzzle?.end).not.toBe('book');
    }
  });
});
