/**
 * The daily puzzle's bookkeeping: what "today" is, streaks and stats.
 * A day follows the player's own calendar date, like Boduku. Pure functions only.
 */

export type DayResult = {
  solved: boolean;
  /** Rungs climbed, start word not counted. */
  steps: number;
  par: number;
  bonesUsed: number;
  /** Played from the calendar after its day. Counts for stats, not for streaks. */
  late?: boolean;
};

/** Every daily the player finished (solved or out of bones), by date. */
export type DailyResults = Record<string, DayResult>;

/** The player's local date as YYYY-MM-DD. */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** The date `days` before (negative) or after (positive) a YYYY-MM-DD date. */
export function shiftDate(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return dateKey(new Date(y, m - 1, d + days));
}

/**
 * Days in a row with a solved daily, counting back from today. If today isn't solved yet,
 * the streak still stands from yesterday: it only breaks once a whole day is missed.
 */
const onTime = (result: DayResult | undefined) => Boolean(result?.solved && !result.late);

export function currentStreak(results: DailyResults, today: string): number {
  let day = onTime(results[today]) ? today : shiftDate(today, -1);
  let streak = 0;
  while (onTime(results[day])) {
    streak++;
    day = shiftDate(day, -1);
  }
  return streak;
}

export function bestStreak(results: DailyResults): number {
  let best = 0;
  for (const day of Object.keys(results)) {
    if (!onTime(results[day]) || onTime(results[shiftDate(day, -1)])) continue;
    let run = 0;
    for (let d = day; onTime(results[d]); d = shiftDate(d, 1)) run++;
    best = Math.max(best, run);
  }
  return best;
}

export type DailyStats = {
  played: number;
  solved: number;
  /** Solved in par steps or fewer. */
  onPar: number;
  current: number;
  best: number;
  /** How many solves landed at par - 1 or less, par, par + 1, par + 2 and up. */
  vsPar: { under: number; at: number; over1: number; over2: number };
};

export function dailyStats(results: DailyResults, today: string): DailyStats {
  const days = Object.values(results);
  const solved = days.filter((r) => r.solved);
  const vsPar = { under: 0, at: 0, over1: 0, over2: 0 };
  for (const r of solved) {
    const diff = r.steps - r.par;
    if (diff < 0) vsPar.under++;
    else if (diff === 0) vsPar.at++;
    else if (diff === 1) vsPar.over1++;
    else vsPar.over2++;
  }
  return {
    played: days.length,
    solved: solved.length,
    onPar: vsPar.under + vsPar.at,
    current: currentStreak(results, today),
    best: bestStreak(results),
    vsPar,
  };
}
