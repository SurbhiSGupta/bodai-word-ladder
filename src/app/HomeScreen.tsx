/**
 * Home, laid out like Boduku's: her and Frisky, today's puzzle front and centre,
 * practice below it, and Calendar and Stats as tiles.
 */

import { useState } from 'react';
import { Buddies, type Face } from '../components/Buddies.tsx';
import { Button } from '../components/Button.tsx';
import { LengthPicker } from '../components/LengthPicker.tsx';
import { Wordmark } from '../components/Wordmark.tsx';
import type { DailyResults } from '../game/daily.ts';
import { currentStreak } from '../game/daily.ts';
import type { Puzzle } from '../game/ladder.ts';
import { LENGTHS, type WordLength } from './wordData.ts';

type Props = {
  today: string;
  todayPuzzle: Puzzle | undefined;
  results: DailyResults;
  todayInProgress: boolean;
  practiceLength: WordLength;
  onPracticeLength: (length: WordLength) => void;
  onPlayToday: () => void;
  onPractice: () => void;
  onCalendar: () => void;
  onStats: () => void;
  onSettings: () => void;
  onHelp: () => void;
  onTour: () => void;
  /** Shows the "take the tour" banner until it's taken or dismissed. */
  showTourBanner: boolean;
  onDismissTour: () => void;
  showPar: boolean;
};

function longDate(key: string) {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 20V11M12 20V5M18 20v-6" />
    </svg>
  );
}

/** Little things she says when tapped. Game banter only; her own story is hers to tell. */
const LINES: { face: Face; text: string }[] = [
  { face: 'cute', text: 'One letter at a time. That’s the whole trick.' },
  { face: 'joy', text: 'Frisky’s been hiding bones again.' },
  { face: 'curious', text: 'Stuck? The 💡 knows a way up from anywhere.' },
  { face: 'happy', text: 'Frisky thinks every word is BONE.' },
  { face: 'kiss', text: 'Under par? You’re showing off now.' },
];

function HelpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.3M12 17h.01" />
    </svg>
  );
}

export function HomeScreen(props: Props) {
  const [taps, setTaps] = useState(0);
  const line = taps > 0 ? LINES[(taps - 1) % LINES.length]! : null;
  const { today, todayPuzzle, results, todayInProgress } = props;
  const todayResult = results[today];
  const streak = currentStreak(results, today);

  const status = todayResult
    ? todayResult.solved
      ? `Solved in ${todayResult.steps} ${todayResult.steps === 1 ? 'step' : 'steps'} ✓`
      : 'Frisky ran out of bones'
    : todayInProgress
      ? 'In progress'
      : todayPuzzle
        ? `4 letters${props.showPar ? ` · par ${todayPuzzle.par}` : ''}`
        : '';

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-4 pt-4 pb-6">
      <header className="flex items-center justify-between gap-3">
        <h1>
          <Wordmark size="title">Word Ladder</Wordmark>
        </h1>
        <button
          type="button"
          onClick={props.onSettings}
          aria-label="Settings"
          className="grid size-11 place-items-center rounded-pill bg-surface shadow-card focus-visible:outline-2 focus-visible:outline-ink"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
          </svg>
        </button>
      </header>

      <div className="relative flex flex-col items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => setTaps((t) => t + 1)}
          aria-label="Say hi to her and Frisky"
          className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <Buddies
            face={line?.face ?? (todayResult?.solved ? 'joy' : 'happy')}
            height={150}
            hop={taps}
          />
        </button>
        <p className="min-h-6 text-center text-small text-muted" aria-live="polite">
          {line ? line.text : taps === 0 ? 'Psst… tap me!' : ''}
        </p>
      </div>

      {props.showTourBanner && (
        <div className="flex items-center gap-2 rounded-md bg-surface py-2 pr-2 pl-4 shadow-card">
          <p className="flex-1 text-small font-semibold">New here? Take the one-minute tour.</p>
          <button
            type="button"
            onClick={props.onTour}
            className="rounded-pill bg-tile px-3 py-1.5 text-small font-semibold focus-visible:outline-2 focus-visible:outline-ink"
          >
            Show me
          </button>
          <button
            type="button"
            onClick={props.onDismissTour}
            aria-label="No thanks, hide the tour"
            className="grid size-9 place-items-center rounded-pill text-muted hover:bg-tile focus-visible:outline-2 focus-visible:outline-ink"
          >
            ✕
          </button>
        </div>
      )}

      <section
        aria-label="Today's puzzle"
        className="flex flex-col gap-3 rounded-lg bg-ink p-5 text-bg shadow-raised dark:bg-surface dark:text-ink"
      >
        <span className="text-label text-accent">☀ Today's puzzle</span>
        <div className="flex flex-col">
          <span className="text-title">{longDate(today)}</span>
          <span className="text-small opacity-80">{status}</span>
        </div>
        {todayPuzzle && (
          <p
            className="text-heading tracking-[0.2em] uppercase"
            aria-label={`${todayPuzzle.start} to ${todayPuzzle.end}`}
          >
            {todayPuzzle.start} → {todayPuzzle.end}
          </p>
        )}
        <Button size="lg" onClick={props.onPlayToday} disabled={!todayPuzzle}>
          {todayResult ? 'See your ladder' : todayInProgress ? 'Continue' : 'Play'}
        </Button>
      </section>

      <p className="text-center text-small text-muted">
        {streak > 0
          ? `🦴 ${streak}-day streak. Come back tomorrow to keep it going.`
          : 'Solve today’s puzzle to start a streak.'}
      </p>

      <section aria-labelledby="practice-h" className="flex flex-col gap-2">
        <h2 id="practice-h" className="text-label text-muted">
          Practice
        </h2>
        <div className="flex items-center gap-2">
          <LengthPicker
            value={props.practiceLength}
            lengths={LENGTHS}
            onChange={(length) => props.onPracticeLength(length as WordLength)}
          />
          <Button variant="quiet" className="flex-1" onClick={props.onPractice}>
            Play {props.practiceLength} letters
          </Button>
        </div>
      </section>

      <nav aria-label="More" className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={props.onCalendar}
          className="flex flex-col items-center gap-1 rounded-md bg-surface py-3 text-small font-semibold shadow-card focus-visible:outline-2 focus-visible:outline-ink"
        >
          <CalendarIcon />
          Calendar
        </button>
        <button
          type="button"
          onClick={props.onStats}
          className="flex flex-col items-center gap-1 rounded-md bg-surface py-3 text-small font-semibold shadow-card focus-visible:outline-2 focus-visible:outline-ink"
        >
          <StatsIcon />
          Stats
        </button>
        <button
          type="button"
          onClick={props.onHelp}
          className="flex flex-col items-center gap-1 rounded-md bg-surface py-3 text-small font-semibold shadow-card focus-visible:outline-2 focus-visible:outline-ink"
        >
          <HelpIcon />
          Help
        </button>
      </nav>
    </div>
  );
}
