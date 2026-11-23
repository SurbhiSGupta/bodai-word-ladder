/**
 * The one-minute tour: five short cards, each with a tiny real ladder, offered on Home
 * the first time (like Boduku's) and any time from Help.
 */

import { useState, type ReactNode } from 'react';
import { BoneCounter } from '../components/BoneCounter.tsx';
import { Button } from '../components/Button.tsx';
import { Rung } from '../components/Rung.tsx';
import { Sheet } from '../components/Sheet.tsx';
import { Toast } from '../components/Toast.tsx';

type Card = { title: string; body: string; demo: ReactNode };

const CARDS: Card[] = [
  {
    title: 'Climb from one word to another',
    body: 'Start at the bottom and climb to the word on top. Change one letter at a time, and every step has to be a real word.',
    demo: (
      <div className="flex flex-col items-center gap-1">
        <Rung word="cold" role="end" size="md" />
        <Rung word="cord" endWord="cold" size="md" />
        <Rung word="core" endWord="cold" size="md" />
        <Rung word="fore" endWord="cold" size="md" />
        <Rung word="fire" role="start" size="md" />
      </div>
    ),
  },
  {
    title: 'Type the whole word',
    body: 'Then press Enter. The glowing square shows where your next letter goes.',
    demo: (
      <div className="flex flex-col items-center gap-1">
        <Rung word="fo  " role="current" size="md" selectedIndex={2} />
        <Rung word="fire" role="start" size="md" />
      </div>
    ),
  },
  {
    title: 'Green and yellow, after Enter',
    body: 'Green: right letter, right place. Yellow: the end word has it, somewhere else.',
    demo: (
      <div className="flex flex-col items-center gap-1">
        <Rung word="cold" role="end" size="md" />
        <Rung word="dolt" endWord="cold" size="md" />
      </div>
    ),
  },
  {
    title: 'Mind the bones',
    body: 'A word that isn’t in our list eats one of Frisky’s bones. Rude words just get a gentle no, and cost nothing.',
    demo: (
      <div className="flex flex-col items-center gap-3">
        <BoneCounter used={1} total={10} />
        <Toast message="Not in our word list" tone="problem" />
      </div>
    ),
  },
  {
    title: 'Stuck?',
    body: '💡 shows a hint from wherever you are. 🔍 checks a word before you use it. Undo steps back down.',
    demo: (
      <div className="flex gap-2">
        <span className="grid size-12 place-items-center rounded-md bg-surface text-heading shadow-card">
          💡
        </span>
        <span className="grid size-12 place-items-center rounded-md bg-surface text-heading shadow-card">
          🔍
        </span>
        <span className="grid h-12 place-items-center rounded-md bg-surface px-4 text-body-strong shadow-card">
          Undo
        </span>
      </div>
    ),
  },
];

export function Tour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const card = CARDS[step]!;
  const last = step === CARDS.length - 1;

  function close() {
    setStep(0);
    onClose();
  }

  return (
    <Sheet open={open} onClose={close} title="How to play">
      <div className="flex flex-col gap-4">
        <div className="grid min-h-56 place-items-center rounded-lg bg-bg p-4" aria-hidden="true">
          {card.demo}
        </div>
        <div className="flex flex-col gap-1" aria-live="polite">
          <span className="text-label text-muted">
            {step + 1} of {CARDS.length}
          </span>
          <h3 className="text-heading">{card.title}</h3>
          <p className="text-body text-muted">{card.body}</p>
        </div>
        <div className="flex items-center gap-2">
          {step > 0 ? (
            <Button variant="quiet" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <Button variant="quiet" onClick={close}>
              Skip
            </Button>
          )}
          <Button className="ml-auto" onClick={() => (last ? close() : setStep(step + 1))}>
            {last ? 'Let’s play' : 'Next'}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
