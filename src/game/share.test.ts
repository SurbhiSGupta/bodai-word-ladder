import { describe, expect, it } from 'vitest';
import { shareLadder, shareLine, type ShareInput } from './share.ts';

const game: ShareInput = {
  title: 'Daily',
  date: 'Nov 22',
  path: ['fire', 'fore', 'core', 'cord', 'cold'],
  end: 'cold',
  par: 4,
  solved: true,
  bonesUsed: 1,
  bones: 10,
  hints: 0,
  url: 'wordladder.bodaijewels.com',
};

describe('share', () => {
  it('never gives away a word', () => {
    for (const text of [shareLadder(game), shareLine(game)]) {
      for (const word of game.path) expect(text.toLowerCase()).not.toContain(word);
    }
  });

  it('draws the ladder bottom to top, ending all green', () => {
    expect(shareLadder(game).split('\n')).toEqual([
      'Bodai Word Ladder · Daily · Nov 22',
      'On par: 4 steps',
      '🦴 9/10 left',
      '',
      '🟩🟩🟩🟩',
      '🟩🟩⬜🟩',
      '🟩🟩⬜⬜',
      '⬜🟩⬜⬜',
      '⬜⬜⬜⬜',
      '',
      'wordladder.bodaijewels.com',
    ]);
  });

  it('says it kindly when the bones ran out, and mentions hints', () => {
    expect(shareLine({ ...game, solved: false, path: ['fire'], hints: 2 })).toContain(
      'Didn’t make it this time (par 4) · 🦴 9/10 left · 💡 2',
    );
  });

  it('counts bones up when there is no limit', () => {
    expect(shareLine({ ...game, bones: undefined, bonesUsed: 3 })).toContain('🦴 3 used');
  });
});
