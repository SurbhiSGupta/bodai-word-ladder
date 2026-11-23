/**
 * Phase 5 proposal: new color themes next to the five Boduku already has. Each column
 * overrides the palette tokens, so the real components show each one. Pick any, or none.
 */

import type { CSSProperties } from 'react';
import { BoneCounter } from '../components/BoneCounter.tsx';
import { Button } from '../components/Button.tsx';
import { Rung } from '../components/Rung.tsx';
import { Wordmark } from '../components/Wordmark.tsx';

type Shades = {
  accent: string;
  highlight: string;
  'highlight-strong': string;
  'highlight-ink': string;
  'highlight-faint': string;
};

const NEW_THEMES: { name: string; note: string; light: Shades; dark: Shades }[] = [
  {
    name: 'Coral',
    note: 'Warm and peachy. Nothing else in the set is orange-pink.',
    light: {
      accent: '#ff8f70',
      highlight: '#ffddd4',
      'highlight-strong': '#ffc7b8',
      'highlight-ink': '#10303b',
      'highlight-faint': '#fff0ec',
    },
    dark: {
      accent: '#ff8f70',
      highlight: '#4a2018',
      'highlight-strong': '#5c2a1f',
      'highlight-ink': '#ffd6ca',
      'highlight-faint': '#4f2a22',
    },
  },
  {
    name: 'Sky',
    note: 'A soft daytime blue, calmer than Ocean’s teal.',
    light: {
      accent: '#8ec5ff',
      highlight: '#ddeeff',
      'highlight-strong': '#c6e2ff',
      'highlight-ink': '#10303b',
      'highlight-faint': '#f0f7ff',
    },
    dark: {
      accent: '#8ec5ff',
      highlight: '#16304d',
      'highlight-strong': '#1d3d61',
      'highlight-ink': '#d2e7ff',
      'highlight-faint': '#213a55',
    },
  },
  {
    name: 'Sand',
    note: 'Quiet and warm, for anyone who finds the brights too loud.',
    light: {
      accent: '#e9c98f',
      highlight: '#f8efdd',
      'highlight-strong': '#f4e4c7',
      'highlight-ink': '#10303b',
      'highlight-faint': '#fcf8f0',
    },
    dark: {
      accent: '#e9c98f',
      highlight: '#42351a',
      'highlight-strong': '#534322',
      'highlight-ink': '#f5e4c2',
      'highlight-faint': '#483c25',
    },
  },
];

function Sample() {
  return (
    <div className="flex flex-col items-center gap-2 bg-bg px-4 py-5">
      <div className="flex w-full items-center justify-between">
        <Wordmark size="heading">Word Ladder</Wordmark>
        <BoneCounter used={2} total={10} size="sm" />
      </div>
      <Rung word="cold" role="end" size="md" />
      <Rung word="co  " role="current" size="md" selectedIndex={2} />
      <Rung word="core" endWord="cold" size="md" />
      <Rung word="fire" role="start" size="md" />
      <Button variant="accent" className="w-full">
        I accept!
      </Button>
    </div>
  );
}

/** Flip Storybook's theme in the toolbar to see the dark versions. */
export function ThemeCompare({ mode }: { mode: 'light' | 'dark' }) {
  return (
    <div className="flex flex-wrap gap-4">
      {NEW_THEMES.map((theme) => (
        <figure key={theme.name} className="flex w-[300px] flex-col gap-2">
          <figcaption className="flex min-h-12 flex-col">
            <span className="flex items-center gap-2 text-heading">
              <span className="size-5 rounded-pill" style={{ background: theme.light.accent }} />
              {theme.name}
            </span>
            <span className="text-small text-muted">{theme.note}</span>
          </figcaption>
          <div
            className="overflow-hidden rounded-lg border border-edge"
            style={
              Object.fromEntries(
                Object.entries(theme[mode]).map(([k, v]) => [`--${k}`, v]),
              ) as CSSProperties
            }
          >
            <Sample />
          </div>
        </figure>
      ))}
    </div>
  );
}
