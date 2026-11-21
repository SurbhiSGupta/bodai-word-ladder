export type LengthPickerProps = {
  value: number;
  lengths: readonly number[];
  onChange: (length: number) => void;
};

/** 3, 4 or 5-letter words. */
export function LengthPicker({ value, lengths, onChange }: LengthPickerProps) {
  return (
    <div
      role="group"
      aria-label="Word length"
      className="flex rounded-pill bg-tile p-0.5 text-small"
    >
      {lengths.map((length) => (
        <button
          key={length}
          type="button"
          aria-pressed={value === length}
          aria-label={`${length}-letter words`}
          onClick={() => onChange(length)}
          className={[
            'rounded-pill px-3 py-1 font-semibold tabular-nums',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
            value === length ? 'bg-ink text-bg' : 'text-tile-ink',
          ].join(' ')}
        >
          {length}
        </button>
      ))}
    </div>
  );
}
