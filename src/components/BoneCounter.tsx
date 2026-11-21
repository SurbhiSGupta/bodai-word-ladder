export type BoneCounterProps = {
  /** Bones used so far. */
  used: number;
  /** Bones per puzzle. Leave out for unlimited, which counts up instead. */
  total?: number;
};

function Bone({ eaten }: { eaten: boolean }) {
  return (
    <svg
      viewBox="0 0 24 12"
      className={['h-3 w-6', eaten ? 'text-muted opacity-30' : 'text-ink'].join(' ')}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <rect x="4" y="4" width="16" height="4" rx="2" />
        <circle cx="4" cy="3.6" r="2.8" />
        <circle cx="4" cy="8.4" r="2.8" />
        <circle cx="20" cy="3.6" r="2.8" />
        <circle cx="20" cy="8.4" r="2.8" />
      </g>
    </svg>
  );
}

/** Frisky's bones: one is eaten for each word that isn't in the list. */
export function BoneCounter({ used, total }: BoneCounterProps) {
  if (total === undefined) {
    return (
      <p className="inline-flex items-center gap-2 font-bold text-ink tabular-nums">
        <Bone eaten={false} />
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
      className="inline-flex flex-wrap items-center gap-1"
    >
      {Array.from({ length: total }, (_, i) => (
        <Bone key={i} eaten={i >= left} />
      ))}
    </div>
  );
}
