/**
 * The Support pack, like Bodai Sudoku's: a code (or, later, the Android app's one-time
 * purchase) unlocks the outfits and extra colors. Everything else stays free for everyone.
 */

import { useSyncExternalStore } from 'react';
import { dateKey } from '../game/daily.ts';

export type Supporter = { via: 'code' | 'play'; until: string | null; since: string };

const KEY = 'bodai-ladder-supporter';
const listeners = new Set<() => void>();

function read(): Supporter | null {
  try {
    const info = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Supporter | null;
    // A code with an end date stops working after that day.
    if (!info || (info.until && info.until < dateKey(new Date()))) return null;
    return info;
  } catch {
    return null;
  }
}

let current = typeof localStorage === 'undefined' ? null : read();

export function unlockPack(via: Supporter['via'], until: string | null) {
  current = { via, until, since: dateKey(new Date()) };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // Private browsing: unlocked for this visit only.
  }
  listeners.forEach((listener) => listener());
}

export function getSupporter(): Supporter | null {
  return current;
}

export function useSupporter(): Supporter | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}
