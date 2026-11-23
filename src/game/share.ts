/**
 * What gets shared after a game: how it went, never the words. A friend who hasn't played
 * yet can read it without the puzzle being spoiled.
 */

import { letterHints, type LetterHint } from './hints.ts';

export type ShareInput = {
  /** "Daily", "Opposites day", "Challenge" or "Practice". */
  title: string;
  /** "Nov 22", or left out for practice. */
  date?: string;
  /** Every word climbed, start first. The end word is last when solved. */
  path: string[];
  end: string;
  par: number;
  solved: boolean;
  bonesUsed: number;
  /** Bones per puzzle, or left out for unlimited. */
  bones?: number;
  hints: number;
  url: string;
};

const SQUARES: Record<LetterHint, string> = { match: '🟩', near: '🟨', none: '⬜' };

function verdict({ path, par, solved }: ShareInput): string {
  const steps = path.length - 1;
  if (!solved) return `Didn’t make it this time (par ${par})`;
  if (steps < par) return `Under par! ${steps} steps (par ${par}) 🐶`;
  if (steps === par) return `On par: ${steps} steps`;
  return `Solved in ${steps} steps (par ${par})`;
}

function extras({ bonesUsed, bones, hints }: ShareInput): string {
  const parts = [
    bones === undefined ? `🦴 ${bonesUsed} used` : `🦴 ${bones - bonesUsed}/${bones} left`,
  ];
  if (hints > 0) parts.push(`💡 ${hints}`);
  return parts.join(' · ');
}

function heading(input: ShareInput): string {
  return `Bodai Word Ladder · ${input.title}${input.date ? ` · ${input.date}` : ''}`;
}

/** A little colored ladder, read bottom to top like the game: start at the bottom. */
export function shareLadder(input: ShareInput): string {
  const rows = input.path.map((word) =>
    letterHints(word, input.end)
      .map((h) => SQUARES[h])
      .join(''),
  );
  return [heading(input), verdict(input), extras(input), '', ...rows.reverse(), '', input.url].join(
    '\n',
  );
}

/** Just the result, in two lines. */
export function shareLine(input: ShareInput): string {
  return [heading(input), `${verdict(input)} · ${extras(input)}`, input.url].join('\n');
}
