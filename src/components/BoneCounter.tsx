export type BoneCounterProps = {
  /** Bones used so far. */
  used: number;
  /** Bones per puzzle. Leave out for unlimited, which counts up instead. */
  total?: number;
  /** Small fits ten bones in one row on a phone header. */
  size?: 'sm' | 'md';
};

/** One bone, slanted: round knobs, a soft shaft and a little shine. Eaten bones are a faint shadow. */
export function Bone({ eaten = false, size = 'md' }: { eaten?: boolean; size?: 'sm' | 'md' }) {
  return (
    <svg
      viewBox="0 0 32 16"
      className={[
        'shrink-0 -rotate-30 overflow-visible',
        size === 'sm' ? 'h-2.5 w-5' : 'h-4 w-8',
      ].join(' ')}
      aria-hidden="true"
    >
      <g fill="currentColor" className={eaten ? 'text-muted opacity-20' : 'text-ink'}>
        <circle cx="5.5" cy="5" r="4" />
        <circle cx="5.5" cy="11" r="4" />
        <circle cx="26.5" cy="5" r="4" />
        <circle cx="26.5" cy="11" r="4" />
        <rect x="5" y="5" width="22" height="6" rx="3" />
      </g>
      {!eaten && (
        <path
          d="M8.5 6.6h15"
          stroke="var(--surface)"
          strokeOpacity="0.45"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/** Frisky's bones: one is eaten for each word that isn't in the list. */
export function BoneCounter({ used, total, size = 'md' }: BoneCounterProps) {
  if (total === undefined) {
    return (
      <p className="inline-flex items-center gap-2 text-body-strong text-ink tabular-nums">
        <Bone />
        <span>
          {used} {used === 1 ? 'bone' : 'bones'} used
        </span>
      </p>
    );
  }

  const left = Math.max(total - used, 0);
  return (
    <div
      role="img"
      aria-label={`${left} of ${total} bones left`}
      className={[
        'inline-flex items-center',
        size === 'sm' ? 'flex-nowrap' : 'flex-wrap gap-0.5',
      ].join(' ')}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={['grid place-items-center', size === 'sm' ? 'size-5' : 'size-9'].join(' ')}
        >
          <Bone eaten={i >= left} size={size} />
        </span>
      ))}
    </div>
  );
}
