import { letterHints } from '../game/hints.ts';
import { LetterTile } from './LetterTile.tsx';

export type RungProps = {
  word: string;
  /** The end word. When given, letters are colored green or yellow against it. */
  endWord?: string;
  /** Show yellow for right-letter-wrong-place. Green always shows. */
  showNear?: boolean;
  /** start and end are pinned and highlighted; current is the rung being typed. */
  role?: 'start' | 'step' | 'current' | 'end';
  /** Index of the letter being changed, if any. */
  selectedIndex?: number;
  /** Shakes the rung, for a word that isn't in the list. */
  invalid?: boolean;
  size?: 'md' | 'lg';
  /** Makes each letter a button, for choosing which letter to change. */
  onLetterClick?: (index: number) => void;
};

const ROLE_LABEL = {
  start: 'Start word',
  step: 'Step',
  current: 'Your next word',
  end: 'End word',
};

/** One word on the ladder, drawn as letter tiles. */
export function Rung({
  word,
  endWord,
  showNear = true,
  role = 'step',
  selectedIndex,
  invalid = false,
  size = 'lg',
  onLetterClick,
}: RungProps) {
  const hints = endWord ? letterHints(word, endWord) : [];
  const pinned = role === 'start' || role === 'end';

  return (
    <div
      role="group"
      aria-label={`${ROLE_LABEL[role]}: ${word.toUpperCase().replaceAll(' ', '_')}`}
      className={[
        'inline-flex gap-1.5 rounded-lg p-2',
        pinned ? 'bg-highlight' : 'bg-transparent',
        role === 'current' ? 'outline-2 outline-dashed outline-edge' : '',
        invalid ? 'animate-shake' : '',
      ].join(' ')}
    >
      {Array.from(word).map((letter, i) => {
        const hint = hints[i] ?? 'none';
        const tile = (
          <LetterTile
            key={i}
            letter={letter.trim()}
            hint={!showNear && hint === 'near' ? 'none' : hint}
            selected={i === selectedIndex}
            size={size}
          />
        );
        if (!onLetterClick) return tile;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Change letter ${i + 1}, ${letter.toUpperCase()}`}
            aria-pressed={i === selectedIndex}
            onClick={() => onLetterClick(i)}
            className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {tile}
          </button>
        );
      })}
    </div>
  );
}
