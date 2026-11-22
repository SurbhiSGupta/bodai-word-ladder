/**
 * Help: the rules in plain words, grouped like Boduku's, with the tour one tap away.
 */

import type { ReactNode } from 'react';
import { Button } from '../components/Button.tsx';
import { ScreenHeader } from './ScreenHeader.tsx';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-label text-muted">{title}</h2>
      <div className="flex flex-col gap-2 rounded-lg bg-surface p-4 text-body shadow-card">
        {children}
      </div>
    </section>
  );
}

const SHORTCUTS: [string, string][] = [
  ['A to Z', 'Type the word'],
  ['Enter', 'Add it to the ladder'],
  ['Backspace', 'Remove a letter'],
  ['⌘ Z / Ctrl Z', 'Undo'],
  ['⌘ ⇧ Z / Ctrl ⇧ Z', 'Redo'],
  ['?', 'Hint'],
  ['Escape', 'Close a sheet'],
];

export function HelpScreen({ onBack, onTour }: { onBack: () => void; onTour: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-4 pt-3 pb-10">
      <ScreenHeader title="Help" onBack={onBack} />

      <Button size="lg" onClick={onTour}>
        ▶ How to play: one-minute tour
      </Button>

      <Section title="The rules">
        <p>Climb from the top word to the bottom word, changing one letter at a time.</p>
        <p>Every step has to be a real word, and you can’t use a word twice.</p>
        <p>
          <strong>Par</strong> is the fewest steps it can be done in. Matching it is lovely; beating
          it is rare.
        </p>
      </Section>

      <Section title="Green and yellow">
        <p>After you press Enter, each letter is compared with the end word.</p>
        <p>
          <span className="rounded-sm bg-match px-1.5 font-bold text-match-ink">Green</span> means
          right letter, right place.{' '}
          <span className="rounded-sm bg-near px-1.5 font-bold text-near-ink">Yellow</span> means
          the end word has that letter, just somewhere else.
        </p>
      </Section>

      <Section title="Frisky’s bones">
        <p>A word that isn’t in our list eats one bone. When they’re gone, the ladder ends.</p>
        <p>
          A word we don’t use (rude or grown-up) just gets a gentle no, and costs nothing. You can
          change the number of bones, or hide them, in Settings.
        </p>
      </Section>

      <Section title="Stuck?">
        <p>💡 shows a hint from wherever you are: which letter to change, or a clue.</p>
        <p>🔍 checks the word you’ve typed and tells you what it means.</p>
        <p>Undo steps back down; Redo puts it back.</p>
      </Section>

      <Section title="Today’s puzzle">
        <p>A new puzzle every day, the same one for everyone.</p>
        <p>
          Solve it on the day to keep your streak going. Missed one? Play it from the calendar any
          time; it counts for your stats, just not your streak.
        </p>
      </Section>

      <Section title="Keyboard shortcuts">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          {SHORTCUTS.map(([keys, action]) => (
            <div key={keys} className="contents">
              <dt className="font-semibold tabular-nums">{keys}</dt>
              <dd className="text-muted">{action}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Make it yours">
        <p>
          Settings has quick picks (Easy-ish, Classic, Brain Melt), a clock for Ninja days, word
          colors, family-friendly words, sound, vibration and focus mode.
        </p>
      </Section>
    </div>
  );
}
