export type ToastProps = {
  message: string;
  /** gentle is for "Let's keep it friendly"; problem is for "Not in our word list". */
  tone?: 'info' | 'gentle' | 'problem';
};

const TONE_STYLES = {
  info: 'bg-toast text-toast-ink',
  gentle: 'bg-highlight text-highlight-ink',
  problem: 'bg-bad text-bad-ink',
};

/** A short message near the ladder. Screen readers hear it as soon as it appears. */
export function Toast({ message, tone = 'info' }: ToastProps) {
  return (
    <div
      role="status"
      className={[
        'inline-flex max-w-xs items-center rounded-pill px-4 py-2 text-sm font-semibold shadow-sm',
        TONE_STYLES[tone],
      ].join(' ')}
    >
      {message}
    </div>
  );
}
