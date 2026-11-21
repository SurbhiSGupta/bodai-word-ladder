import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { BoneCounter } from '../components/BoneCounter.tsx';
import { Key } from '../components/Key.tsx';
import { Rung } from '../components/Rung.tsx';
import { Wordmark } from '../components/Wordmark.tsx';

/**
 * Side-by-side color proposals, kept as a record of what was compared and chosen. Each column overrides a few light-mode tokens,
 * so the same components can be compared before anything changes for real.
 */
const LIGHT_OPTIONS: { name: string; note: string; tokens: Record<string, string> }[] = [
  {
    name: 'Before',
    note: 'Boduku’s cream and pale grey tiles',
    tokens: { '--bg': '#f6f4ec', '--tile': '#e2e8e6', '--edge': '#10303b24' },
  },
  {
    name: 'Option 1 · Warmer (chosen)',
    note: 'Warmer cream, tiles one step deeper. Picked on Nov 21, 2026.',
    tokens: { '--bg': '#f1ecdf', '--tile': '#d9e0dd', '--edge': '#10303b2e' },
  },
  {
    name: 'Option 2 · Deeper',
    note: 'Warmer cream still, tiles two steps deeper',
    tokens: { '--bg': '#ece5d5', '--tile': '#cfd8d4', '--edge': '#10303b33' },
  },
];

function Sample() {
  return (
    <div className="flex flex-col items-center gap-2 bg-bg px-4 py-5">
      <div className="flex w-full items-center justify-between">
        <Wordmark size="heading">Word Ladder</Wordmark>
        <BoneCounter used={8} total={10} size="sm" />
      </div>
      <Rung word="lost" role="start" size="md" />
      {['lest', 'vest', 'vent', 'vend'].map((word) => (
        <Rung key={word} word={word} endWord="veto" size="md" />
      ))}
      <Rung word="    " role="current" size="md" selectedIndex={0} />
      <div className="flex w-full gap-1 pt-2">
        {Array.from('asdfghjkl').map((letter) => (
          <Key key={letter} label={letter} />
        ))}
      </div>
    </div>
  );
}

function LightModeCompare() {
  return (
    <div data-theme="light" className="flex flex-wrap gap-4">
      {LIGHT_OPTIONS.map(({ name, note, tokens }) => (
        <figure key={name} className="flex w-[360px] flex-col gap-2">
          <figcaption className="flex flex-col">
            <span className="text-heading">{name}</span>
            <span className="text-small text-muted">{note}</span>
          </figcaption>
          <div
            className="overflow-hidden rounded-lg border border-edge"
            style={tokens as CSSProperties}
          >
            <Sample />
          </div>
        </figure>
      ))}
    </div>
  );
}

const meta = { title: 'Proposals' } satisfies Meta;
export default meta;

export const LightMode: StoryObj = {
  name: 'Light mode: warmer and deeper',
  render: () => <LightModeCompare />,
  globals: { theme: 'light' },
};
