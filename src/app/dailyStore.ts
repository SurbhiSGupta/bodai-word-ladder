/**
 * Daily puzzles and the player's results, kept in the browser.
 * A day's first finish is the one that counts toward streaks and stats.
 */

import type { DailyResults, DayResult } from '../game/daily.ts';
import type { Puzzle } from '../game/ladder.ts';

const RESULTS_KEY = 'bodai-ladder-daily-results';

export function loadResults(): DailyResults {
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '{}') as DailyResults;
  } catch {
    return {};
  }
}

export function recordDaily(date: string, result: DayResult) {
  const results = loadResults();
  if (results[date]) return;
  try {
    localStorage.setItem(RESULTS_KEY, JSON.stringify({ ...results, [date]: result }));
  } catch {
    // Not remembered in private browsing; the game still plays.
  }
}

/** True when a daily has been started but not finished. */
export function isInProgress(date: string): boolean {
  try {
    const saved = JSON.parse(localStorage.getItem(`bodai-ladder-daily-${date}`) ?? 'null') as {
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
