export type SegmentedOption<T extends string | number> = {
  value: T;
  label: string;
  /** Read aloud instead of the label, e.g. "4-letter words" for "4". */
  spokenLabel?: string;
};

export type SegmentedProps<T extends string | number> = {
  /** Names the group for screen readers. */
  label: string;
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
};

/** A pill of choices with one selected, like Boduku's Auto · Light · Dark. */
export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-pill bg-tile p-0.5 text-small"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          aria-label={option.spokenLabel}
          onClick={() => onChange(option.value)}
          className={[
            'min-h-8 rounded-pill px-3 py-1 font-semibold tabular-nums',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
            value === option.value ? 'bg-ink text-bg' : 'text-tile-ink',
          ].join(' ')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
