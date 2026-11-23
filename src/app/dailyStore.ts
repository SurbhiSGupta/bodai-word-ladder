/**
 * Daily puzzles, the Challenge of the day, and the player's results, kept in the browser.
 * A day's first finish is the one that counts toward streaks and stats. Challenge results
 * are kept apart, so a hard 7-letter day never breaks a daily streak.
 */

import type { DailyResults, DayResult } from '../game/daily.ts';
import type { Puzzle } from '../game/ladder.ts';

export type DayKind = 'daily' | 'challenge';

const resultsKey = (kind: DayKind) => `bodai-ladder-${kind}-results`;

export function loadResults(kind: DayKind = 'daily'): DailyResults {
  try {
    return JSON.parse(localStorage.getItem(resultsKey(kind)) ?? '{}') as DailyResults;
  } catch {
    return {};
  }
}

export function recordDaily(date: string, result: DayResult, kind: DayKind = 'daily') {
  const results = loadResults(kind);
  if (results[date]) return;
  try {
    localStorage.setItem(resultsKey(kind), JSON.stringify({ ...results, [date]: result }));
  } catch {
    // Not remembered in private browsing; the game still plays.
  }
}

/** True when a day's puzzle has been started but not finished. */
export function isInProgress(date: string, kind: DayKind = 'daily'): boolean {
  try {
    const saved = JSON.parse(localStorage.getItem(`bodai-ladder-${kind}-${date}`) ?? 'null') as {
      ladder?: { rungs?: string[]; bonesUsed?: number };
    } | null;
    return Boolean(saved?.ladder && (saved.ladder.rungs?.length || saved.ladder.bonesUsed));
  } catch {
    return false;
  }
}

let dailyFile: Promise<Record<string, Puzzle>> | null = null;

/** Every daily puzzle, by date. Loaded once, on first use. */
export function loadDailies(): Promise<Record<string, Puzzle>> {
  dailyFile ??= import('../data/daily.json').then((m) => m.default as Record<string, Puzzle>);
  return dailyFile;
}

let challengeFile: Promise<Record<string, Puzzle>> | null = null;

/** Every Challenge of the day, by date. Loaded once, on first use. */
export function loadChallenges(): Promise<Record<string, Puzzle>> {
  challengeFile ??= import('../data/challenge.json').then(
    (m) => m.default as Record<string, Puzzle>,
  );
  return challengeFile;
}
