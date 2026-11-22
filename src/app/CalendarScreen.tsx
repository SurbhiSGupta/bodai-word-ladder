/**
 * Every daily so far, one month at a time. Missed a day? Play it from here: it counts for
 * stats, and only a puzzle solved on its own day counts for the streak, like Boduku.
 */

import { useState } from 'react';
import type { DailyResults } from '../game/daily.ts';
import { shiftDate } from '../game/daily.ts';
import { ScreenHeader } from './ScreenHeader.tsx';
import { isInProgress } from './dailyStore.ts';

type Props = {
  today: string;
  /** The first day with a daily puzzle. */
  firstDay: string;
  results: DailyResults;
  onPlay: (date: string) => void;
  onBack: () => void;
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarScreen({ today, firstDay, results, onPlay, onBack }: Props) {
  const [month, setMonth] = useState(today.slice(0, 7));
  const [y, m] = month.split('-').map(Number) as [number, number];
  const first = new Date(y, m - 1, 1);
  const daysInMonth = new Date(y, m, 0).getDate();
  const title = first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const prevMonth = shiftDate(`${month}-01`, -1).slice(0, 7);
  const nextMonth = shiftDate(`${month}-${String(daysInMonth).padStart(2, '0')}`, 1).slice(0, 7);

  const cells: (string | null)[] = Array.from({ length: first.getDay() }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${month}-${String(d).padStart(2, '0')}`);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-4 pt-3 pb-6">
      <ScreenHeader title="Daily puzzles" onBack={onBack} />

      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={prevMonth < firstDay.slice(0, 7)}
          onClick={() => setMonth(prevMonth)}
          className="grid size-11 place-items-center rounded-pill text-heading disabled:opacity-30"
        >
          ‹
        </button>
        <h2 className="text-heading" aria-live="polite">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Next month"
          disabled={nextMonth > today.slice(0, 7)}
          onClick={() => setMonth(nextMonth)}
          className="grid size-11 place-items-center rounded-pill text-heading disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center" role="grid" aria-label={title}>
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="text-label text-muted" aria-hidden="true">
            {d}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />;
          const day = Number(date.slice(8));
          const playable = date >= firstDay && date <= today;
          const result = results[date];
          const started = !result && playable && isInProgress(date);
          const state = result ? (result.solved ? 'solved' : 'lost') : started ? 'started' : 'open';
          const label = `${date}: ${
            state === 'solved'
              ? 'solved'
              : state === 'lost'
                ? 'out of bones'
                : state === 'started'
                  ? 'in progress'
                  : playable
                    ? 'not played'
                    : 'not available'
          }`;
          return (
            <button
              key={date}
              type="button"
              disabled={!playable}
              aria-label={label}
              onClick={() => onPlay(date)}
              className={[
                'relative grid aspect-square place-items-center rounded-md text-body-strong tabular-nums',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
                state === 'solved'
                  ? 'bg-match text-match-ink'
                  : state === 'lost'
                    ? 'bg-bad text-bad-ink'
                    : playable
                      ? 'bg-surface text-ink shadow-card'
                      : 'text-muted opacity-40',
                date === today ? 'ring-2 ring-ink' : '',
              ].join(' ')}
            >
              {day}
              {state === 'started' && (
                <span
                  className="absolute bottom-1 size-1.5 rounded-pill bg-ink"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-small text-muted">
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-match" aria-hidden="true" /> Solved
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-bad" aria-hidden="true" /> Out of bones
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-pill bg-ink" aria-hidden="true" /> In progress
        </li>
      </ul>
    </div>
  );
}
