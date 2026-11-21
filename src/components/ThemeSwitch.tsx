import { useEffect, useState } from 'react';

export type ThemeChoice = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'bodai-ladder-theme';
const CHOICES: { value: ThemeChoice; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

function savedChoice(): ThemeChoice {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'auto';
  } catch {
    return 'auto';
  }
}

/** Applies a theme the way the tokens expect: data-theme on <html>, or nothing for Auto. */
export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === 'auto') delete root.dataset.theme;
  else root.dataset.theme = choice;
}

/** Auto, Light or Dark, like Boduku's Settings. Remembered on this device. */
export function ThemeSwitch() {
  const [choice, setChoice] = useState<ThemeChoice>(savedChoice);

  useEffect(() => {
    applyTheme(choice);
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Private browsing: the choice just isn't remembered.
    }
  }, [choice]);

  return (
    <div role="group" aria-label="Theme" className="flex rounded-pill bg-tile p-0.5 text-small">
      {CHOICES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={choice === value}
          onClick={() => setChoice(value)}
          className={[
            'rounded-pill px-3 py-1 font-semibold',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
            choice === value ? 'bg-ink text-bg' : 'text-tile-ink',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
