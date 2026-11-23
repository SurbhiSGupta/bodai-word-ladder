import type { Puzzle } from '../game/ladder.ts';
import { Buddies } from './Buddies.tsx';
import { Button } from './Button.tsx';

const LETTERS: Record<number, string> = { 6: 'Six', 7: 'Seven' };

function Words({ puzzle }: { puzzle: Puzzle }) {
  return (
    <p
      className="text-body-strong tracking-[0.15em] uppercase"
      aria-label={`${puzzle.start} to ${puzzle.end}`}
    >
      {puzzle.start} → {puzzle.end}
    </p>
  );
}

export type ChallengeCardProps = {
  puzzle: Puzzle;
  /** How it went, once played: "Conquered in 9 steps ✓". Leave out before then. */
  status?: string;
  /** "I accept", "Continue" or "See your ladder". */
  actionLabel: string;
  onPlay: () => void;
  /** Hides par, following the Show par setting. */
  showPar?: boolean;
};

/** The Challenge of the day on Home: a long 6 or 7-letter ladder, always there for later. */
export function ChallengeCard({
  puzzle,
  status,
  actionLabel,
  onPlay,
  showPar = true,
}: ChallengeCardProps) {
  return (
    <section
      aria-label="Challenge of the day"
      className="flex items-center gap-3 rounded-lg bg-surface p-4 shadow-card"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-label text-muted">🔥 Challenge of the day</span>
        <Words puzzle={puzzle} />
        <span className="text-small text-muted">
          {status ?? `${puzzle.start.length} letters${showPar ? ` · par ${puzzle.par}` : ''}`}
        </span>
      </div>
      <Button variant="accent" onClick={onPlay}>
        {actionLabel}
      </Button>
    </section>
  );
}

export type ChallengeInviteProps = {
  puzzle: Puzzle;
  onAccept: () => void;
  onDecline: () => void;
  showPar?: boolean;
};

/**
 * The invitation that slides up once today's puzzle is solved, like Boduku's Wild card.
 * Goes inside a Sheet titled "Do you accept the challenge?".
 */
export function ChallengeInvite({
  puzzle,
  onAccept,
  onDecline,
  showPar = true,
}: ChallengeInviteProps) {
  const length = puzzle.start.length;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-3">
        <span className="shrink-0">
          <Buddies face="curious" height={84} />
        </span>
        <p className="pb-1 text-body text-muted">
          {LETTERS[length] ?? length} letters{showPar ? `, par ${puzzle.par}` : ''}. Long words
          hardly ever connect, so a ladder like this is rare.
        </p>
      </div>
      <Words puzzle={puzzle} />
      <div className="flex gap-2">
        <Button variant="quiet" className="flex-1" onClick={onDecline}>
          Not today
        </Button>
        <Button variant="accent" className="flex-1" onClick={onAccept}>
          I accept!
        </Button>
      </div>
    </div>
  );
}
