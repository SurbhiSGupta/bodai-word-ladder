import { describe, expect, it } from 'vitest';
import {
  bestStreak,
  currentStreak,
  dailyStats,
  dateKey,
  shiftDate,
  type DailyResults,
} from './daily.ts';

const win = (steps = 4, par = 4) => ({ solved: true, steps, par, bonesUsed: 0 });
const loss = { solved: false, steps: 0, par: 4, bonesUsed: 10 };

describe('dates', () => {
  it('uses the local calendar date', () => {
    expect(dateKey(new Date(2026, 10, 22, 23, 59))).toBe('2026-11-22');
  });

  it('shifts across months and years', () => {
    expect(shiftDate('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDate('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('streaks', () => {
  const results: DailyResults = {
    '2026-11-18': win(),
    '2026-11-19': win(),
    '2026-11-20': loss,
    '2026-11-21': win(),
    '2026-11-22': win(),
  };

  it('counts back from today', () => {
    expect(currentStreak(results, '2026-11-22')).toBe(2);
  });

  it('still stands when today is not played yet', () => {
    expect(currentStreak(results, '2026-11-23')).toBe(2);
  });

  it('breaks once a whole day is missed', () => {
    expect(currentStreak(results, '2026-11-24')).toBe(0);
  });

  it('does not count days solved late from the calendar', () => {
    expect(
      currentStreak({ ...results, '2026-11-20': { ...win(), late: true } }, '2026-11-22'),
    ).toBe(2);
  });

  it('remembers the best run', () => {
    expect(bestStreak({ ...results, '2026-11-23': win(), '2026-11-24': win() })).toBe(4);
  });
});

describe('dailyStats', () => {
  it('sorts solves by how they did against par', () => {
    const stats = dailyStats(
      { a: win(3, 4), b: win(4, 4), c: win(5, 4), d: win(7, 4), e: loss },
      '2026-11-22',
    );
    expect(stats).toMatchObject({ played: 5, solved: 4, onPar: 2 });
    expect(stats.vsPar).toEqual({ under: 1, at: 1, over1: 1, over2: 1 });
  });
});
