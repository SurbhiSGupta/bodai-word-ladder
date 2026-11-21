export type BoneArrangement = 'slant' | 'scatter' | 'upright';

export type BoneCounterProps = {
  /** Bones used so far. */
  used: number;
  /** Bones per puzzle. Leave out for unlimited, which counts up instead. */
  total?: number;
  /** How the bones sit: all tilted the same way, tossed at different angles, or standing up. */
  arrangement?: BoneArrangement;
};

/** Tossed angles, fixed so the row looks the same every time. */
const SCATTER = [-28, 14, -8, 32, -20, 6, -34, 22, -2, 26];

function angleFor(arrangement: BoneArrangement, i: number) {
  if (arrangement === 'upright') return 90;
  if (arrangement === 'scatter') return SCATTER[i % SCATTER.length]!;
  return -30;
}

/** One bone: round knobs, a soft shaft and a little shine. Eaten bones are a faint shadow. */
export function Bone({ eaten = false, angle = -30 }: { eaten?: boolean; angle?: number }) {
  return (
    <svg
      viewBox="0 0 32 16"
      className="h-4 w-8 shrink-0 overflow-visible"
      style={{ transform: `rotate(${angle}deg)` }}
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
export function BoneCounter({ used, total, arrangement = 'slant' }: BoneCounterProps) {
  if (total === undefined) {
    return (
      <p className="inline-flex items-center gap-2 text-body-strong text-ink tabular-nums">
        <Bone angle={angleFor(arrangement, 0)} />
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
        'inline-flex flex-wrap items-center',
        arrangement === 'upright' ? '-space-x-3' : 'gap-0.5',
      ].join(' ')}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="grid size-9 place-items-center"
          style={arrangement === 'scatter' ? { translate: `0 ${(i % 3) - 1}px` } : undefined}
        >
          <Bone eaten={i >= left} angle={angleFor(arrangement, i)} />
        </span>
      ))}
    </div>
  );
}
