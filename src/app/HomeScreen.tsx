/**
 * Home, laid out like Boduku's: her and Frisky, today's puzzle front and centre,
 * practice below it, and Calendar and Stats as tiles.
 */

import { Buddies } from '../components/Buddies.tsx';
import { Button } from '../components/Button.tsx';
import { LengthPicker } from '../components/LengthPicker.tsx';
import { ThemeSwitch } from '../components/ThemeSwitch.tsx';
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

export function HomeScreen(props: Props) {
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
        ? `4 letters · par ${todayPuzzle.par}`
        : '';

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-4 pt-4 pb-6">
      <header className="flex items-center justify-between gap-3">
        <h1>
          <Wordmark size="title">Word Ladder</Wordmark>
        </h1>
        <ThemeSwitch />
      </header>

      <div className="flex justify-center pt-2">
        <Buddies face={todayResult?.solved ? 'joy' : 'happy'} height={150} />
      </div>

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

      <nav aria-label="More" className="grid grid-cols-2 gap-2">
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
      </nav>
    </div>
  );
}
