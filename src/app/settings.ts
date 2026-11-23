/**
 * The player's settings, saved in the browser. A tiny store (not React state) so that
 * non-React code, like the sound player, can read it too. Components use useSettings().
 */

import type { FriskyOutfit, HerOutfit } from '../components/Buddies.tsx';
import { useSyncExternalStore } from 'react';
import { DEFAULT_PALETTE, PALETTES, type Palette } from '../styles/palettes.ts';

export type Settings = {
  /** Bones per puzzle, or 'unlimited' (then the counter counts up). */
  bones: 10 | 5 | 'unlimited';
  /** Zen: no clock. Ninja: a countdown or a cap on moves. */
  pace: 'zen' | 'ninja';
  ninja: 'timer' | 'moves';
  /** Seconds on the Ninja clock. */
  ninjaSeconds: 60 | 120 | 180;
  showPar: boolean;
  familyFriendly: boolean;
  /** Allow start and end words with a doubled letter, like BOOK (practice only). */
  doubledEnds: boolean;
  theme: 'auto' | 'light' | 'dark';
  palette: Palette;
  sound: boolean;
  vibration: boolean;
  /** Hides everything but the ladder, bones and keyboard while playing. */
  focus: boolean;
  /** Motion on or off: shakes, slides and the sheet rising. Colors and sounds stay. */
  animations: boolean;
  /** Show the bones while playing. Off still counts them, just quietly. */
  showBones: boolean;
  /** Submit the word as soon as its last letter is typed, no Enter needed. */
  autoEnter: boolean;
  /** Hints show which letter to change, or a crossword-style clue for the next word. */
  hintStyle: 'letter' | 'clue';
  /** Outfits: free for everyone. */
  herOutfit: HerOutfit;
  friskyOutfit: FriskyOutfit;
};

export const DEFAULTS: Settings = {
  bones: 10,
  pace: 'zen',
  ninja: 'timer',
  ninjaSeconds: 120,
  showPar: true,
  familyFriendly: true,
  doubledEnds: false,
  theme: 'auto',
  palette: DEFAULT_PALETTE,
  sound: true,
  vibration: true,
  focus: false,
  animations: true,
  showBones: true,
  autoEnter: false,
  hintStyle: 'letter',
  herOutfit: 'none',
  friskyOutfit: 'none',
};

/** One tap to a whole feel. Only game rules change; look and sound stay as they are. */
export const PRESETS = {
  'easy-ish': {
    label: 'Easy-ish',
    description: 'Unlimited bones, no clock, par shown.',
    settings: { bones: 'unlimited', pace: 'zen', showPar: true },
  },
  classic: {
    label: 'Classic',
    description: '10 bones, no clock, par shown.',
    settings: { bones: 10, pace: 'zen', showPar: true },
  },
  'brain-melt': {
    label: 'Brain Melt',
    description: '5 bones, a 2-minute clock, par hidden.',
    settings: { bones: 5, pace: 'ninja', ninja: 'timer', ninjaSeconds: 120, showPar: false },
  },
} as const satisfies Record<
  string,
  { label: string; description: string; settings: Partial<Settings> }
>;

export type PresetName = keyof typeof PRESETS;

/** The preset the current settings match exactly, if any. */
export function activePreset(settings: Settings): PresetName | null {
  for (const [name, preset] of Object.entries(PRESETS) as [
    PresetName,
    (typeof PRESETS)[PresetName],
  ][]) {
    const matches = Object.entries(preset.settings).every(
      ([key, value]) => settings[key as keyof Settings] === value,
    );
    if (matches) return name;
  }
  return null;
}

const KEY = 'bodai-ladder-settings';
const listeners = new Set<() => void>();

function read(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Settings>;
    // Older saved themes live under their own key; respect them once.
    const oldTheme = localStorage.getItem('bodai-ladder-theme');
    const merged = {
      ...DEFAULTS,
      ...(oldTheme && !saved.theme ? { theme: oldTheme } : {}),
      ...saved,
    };
    if (!(PALETTES as readonly string[]).includes(merged.palette)) merged.palette = DEFAULT_PALETTE;
    return merged as Settings;
  } catch {
    return DEFAULTS;
  }
}

let current: Settings = typeof localStorage === 'undefined' ? DEFAULTS : read();

export function getSettings(): Settings {
  return current;
}

export function updateSettings(patch: Partial<Settings>) {
  current = { ...current, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // Private browsing: settings last until the page closes.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, getSettings, getSettings);
}

/** Bones as a number for the game rules: undefined means unlimited. */
export function bonesLimit(settings: Settings): number | undefined {
  return settings.bones === 'unlimited' ? undefined : settings.bones;
}
