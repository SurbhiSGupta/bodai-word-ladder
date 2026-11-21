export type WordChipProps = {
  word: string;
  /** Opens the word's meaning. */
  onClick: (word: string) => void;
  /** Highlights the chip, e.g. a word that's also on the best path. */
  emphasis?: boolean;
};

/** A small tappable word, for the win card: tap to see what it means. */
export function WordChip({ word, onClick, emphasis = false }: WordChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(word)}
      aria-label={`${word.toUpperCase()}, see meaning`}
      className={[
        'rounded-sm px-2 py-1 text-small font-bold tracking-widest uppercase',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        emphasis ? 'bg-match text-match-ink' : 'bg-tile text-tile-ink hover:brightness-95',
      ].join(' ')}
    >
      {word}
    </button>
  );
}
