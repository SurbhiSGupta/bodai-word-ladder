import type { LetterHint } from '../game/hints.ts';

export type LetterTileProps = {
  letter: string;
  /** Green for right letter and place, yellow for right letter elsewhere. */
  hint?: LetterHint;
  /** The letter the player is about to change. */
  selected?: boolean;
  size?: 'md' | 'lg';
};

const HINT_STYLES: Record<LetterHint, string> = {
  match: 'bg-match text-match-ink',
  near: 'bg-near text-near-ink',
  none: 'bg-tile text-tile-ink',
};

const SIZE_STYLES = {
  md: 'size-11 text-xl rounded-sm',
  lg: 'size-14 text-2xl rounded-md',
};

/** One letter in a rung. Purely visual: the Rung reads the whole word to screen readers. */
export function LetterTile({
  letter,
  hint = 'none',
  selected = false,
  size = 'lg',
}: LetterTileProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        'inline-flex items-center justify-center font-extrabold uppercase select-none',
        SIZE_STYLES[size],
        selected ? 'bg-accent text-accent-ink ring-2 ring-ink' : HINT_STYLES[hint],
      ].join(' ')}
    >
      {letter}
    </span>
  );
}
