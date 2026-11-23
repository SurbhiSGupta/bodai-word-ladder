import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import tokens from '../../tokens/tokens.json';
import { playTone } from '../feedback/tones.ts';
import { FEEDBACK, type FeedbackEvent } from '../styles/feedback.ts';

/** Shared frame for the foundation pages. */
function Page({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-title">{title}</h1>
        <p className="text-body text-muted">{intro}</p>
      </header>
      {children}
    </div>
  );
}

const meta = { title: 'Foundations' } satisfies Meta;
export default meta;
type Story = StoryObj;

const colorNames = [
  ...Object.keys(tokens.theme.light),
  ...Object.keys(tokens.palettes.bodai.light),
];

export const Colors: Story = {
  render: () => (
    <Page
      title="Colors"
      intro="Every color, read straight from tokens/tokens.json. Switch Theme and Palette in the toolbar above. Use them as Tailwind classes: bg-surface, text-ink, bg-accent."
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {colorNames.map((name) => (
          <div key={name} className="flex items-center gap-3">
            <span
              className="size-11 shrink-0 rounded-sm border border-edge"
              style={{ background: `var(--${name})` }}
            />
            <span className="min-w-0">
              <span className="block text-small font-semibold">{name}</span>
              <code className="block text-small text-muted">var(--{name})</code>
            </span>
          </div>
        ))}
      </div>
    </Page>
  ),
};

const typeStyles = Object.entries(tokens.type.styles) as [
  string,
  { size: number; line: number; weight: number; use: string },
][];

export const Typography: Story = {
  render: () => (
    <Page
      title="Typography"
      intro="Outfit everywhere, like Boduku. Use the text-* class for each style; never set a size by hand."
    >
      <div className="flex flex-col divide-y divide-edge">
        {typeStyles.map(([name, t]) => (
          <div key={name} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]">
            <div className="flex flex-col">
              <code className="text-small font-semibold">text-{name}</code>
              <span className="text-small text-muted tabular-nums">
                {t.size}/{t.line} · {t.weight}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className={`text-${name}`}>Fire to cold, one letter at a time</span>
              <span className="text-small text-muted">{t.use}</span>
            </div>
          </div>
        ))}
      </div>
    </Page>
  ),
};

const space = Object.entries(tokens.space).filter(([k]) => !k.startsWith('$')) as [
  string,
  number,
][];

export const SpacingAndLayout: Story = {
  name: 'Spacing and layout',
  render: () => (
    <Page
      title="Spacing and layout"
      intro="A 4px rhythm. Tailwind's numbers match: p-1 is xs (4px), p-2 is sm, p-3 is md, p-4 is lg, p-6 is xl, p-8 is 2xl, p-12 is 3xl."
    >
      <div className="flex flex-col gap-2">
        {space
          .filter(([name]) => name !== 'column')
          .map(([name, px]) => (
            <div key={name} className="flex items-center gap-4">
              <code className="w-28 text-small">--space-{name}</code>
              <span className="h-4 rounded-sm bg-accent" style={{ width: px }} />
              <span className="text-small text-muted tabular-nums">{px}px</span>
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-surface p-4 shadow-card">
        <h2 className="text-heading">Layout rules</h2>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-body">
          <li>One centered column, at most 448px wide (--space-column), like Boduku.</li>
          <li>16px side gutters on every screen (--space-gutter), plus the phone's safe areas.</li>
          <li>
            On the ladder, the start word is pinned to the top and the end word to the bottom. Only
            the rungs in between scroll.
          </li>
          <li>
            The keyboard sits at the bottom, inside the thumb zone. Nothing important goes under it.
          </li>
          <li>Every tap target is at least 44px.</li>
        </ul>
      </div>
    </Page>
  ),
};

const corners = Object.entries(tokens.shape).filter(([k]) => !k.startsWith('$')) as [
  string,
  number,
][];
const shadows = Object.entries(tokens.elevation).filter(([k]) => !k.startsWith('$'));
const motion = Object.entries(tokens.motion).filter(([k]) => !k.startsWith('$'));

function CornersShadowsMotionPage() {
  const [played, setPlayed] = useState(0);
  return (
    <Page
      title="Corners, shadows and motion"
      intro="Soft and friendly, never sharp. Movement is quick and a little bouncy, and it stops when the player asks for reduced motion."
    >
      <section className="flex flex-wrap gap-4">
        {corners.map(([name, px]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <span className="size-16 bg-highlight" style={{ borderRadius: `${px}px` }} />
            <code className="text-small">{name}</code>
          </div>
        ))}
      </section>
      <section className="flex flex-wrap gap-6">
        {shadows.map(([name]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <span
              className="size-20 rounded-lg bg-surface"
              style={{ boxShadow: `var(--${name})` }}
            />
            <code className="text-small">{name}</code>
          </div>
        ))}
      </section>
      <section className="flex flex-col gap-2">
        <button
          type="button"
          className="self-start rounded-md bg-match px-4 py-2 text-body-strong text-match-ink"
          onClick={() => setPlayed((n) => n + 1)}
        >
          Replay motion
        </button>
        {motion
          .filter(([name]) => name.startsWith('duration-'))
          .map(([name, ms]) => (
            <div key={`${name}-${played}`} className="flex items-center gap-4">
              <code className="w-40 text-small">{name}</code>
              <span className="relative h-4 flex-1 rounded-pill bg-tile">
                <span
                  className="absolute top-0 left-0 size-4 rounded-pill bg-ink motion-safe:animate-[slide_var(--d)_var(--ease-standard)_forwards]"
                  style={{ ['--d' as string]: `${ms}ms` }}
                />
              </span>
              <span className="w-14 text-small text-muted tabular-nums">{ms}ms</span>
            </div>
          ))}
        <style>{'@keyframes slide { to { left: calc(100% - 1rem); } }'}</style>
        <ul className="list-disc pl-5 text-small text-muted">
          {motion
            .filter(([name]) => name.startsWith('ease-'))
            .map(([name, value]) => (
              <li key={name}>
                <code>{name}</code>: {value}
              </li>
            ))}
        </ul>
      </section>
    </Page>
  );
}

export const CornersShadowsMotion: Story = {
  name: 'Corners, shadows and motion',
  render: () => <CornersShadowsMotionPage />,
};

const events = Object.entries(FEEDBACK) as [FeedbackEvent, (typeof FEEDBACK)[FeedbackEvent]][];

export const SoundAndHaptics: Story = {
  name: 'Sound and haptics',
  render: () => (
    <Page
      title="Sound and haptics"
      intro="Every moment in the game has one sound and one buzz, or deliberately none. Tap Play to hear the tones. Haptics only run in the phone app, and both follow the player's Sound and Vibration settings."
    >
      <div className="flex flex-col divide-y divide-edge">
        {events.map(([name, f]) => {
          const sound = f.sound;
          const isTone = sound !== null && 'tone' in sound;
          return (
            <div
              key={name}
              className="grid gap-2 py-3 sm:grid-cols-[170px_1fr_auto] sm:items-center"
            >
              <code className="text-small font-semibold">{name}</code>
              <div className="flex min-w-0 flex-col">
                <span className="text-small">
                  Sound:{' '}
                  {sound === null
                    ? 'none'
                    : isTone
                      ? `${sound.tone.join(' → ')} Hz`
                      : `recording (${sound.samples.join(', then ')})`}{' '}
                  · Haptic: {f.haptic ? tokens.feedback.haptics[f.haptic] : 'none'}
                </span>
                <span className="text-small text-muted">{f.note}</span>
              </div>
              <button
                type="button"
                disabled={!isTone}
                onClick={() => playTone(name)}
                className="h-9 rounded-md border border-edge bg-surface px-3 text-small font-semibold disabled:opacity-40"
              >
                {isTone ? 'Play ▶' : 'Later'}
              </button>
            </div>
          );
        })}
      </div>
    </Page>
  ),
};
