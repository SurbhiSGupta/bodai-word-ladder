/** Boduku's two links at the foot of Settings and Help: Support Bodai and Report a bug. */

import { reportBug } from './reportBug.ts';

const LINK =
  'flex-1 rounded-md bg-surface px-3 py-3 text-body-strong shadow-card focus-visible:outline-2 focus-visible:outline-ink';

export function MoreLinks({ onSupport }: { onSupport: () => void }) {
  return (
    <nav aria-label="More from Bodai" className="flex gap-2">
      <button type="button" className={LINK} onClick={onSupport}>
        💛 Support Bodai
      </button>
      <button type="button" className={LINK} onClick={() => reportBug()}>
        🐞 Report a bug
      </button>
    </nav>
  );
}
