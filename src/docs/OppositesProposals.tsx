/**
 * Phase 5 proposal: how Today's card says it's Opposites day (every Friday).
 * Each column is the card as it would look on Home.
 */

import { Button } from '../components/Button.tsx';

const PUZZLE = { start: 'fire', end: 'cold', par: 4 };

function Card({
  label,
  arrow,
  note,
  flipped = false,
}: {
  label: string;
  arrow: string;
  note?: string;
  flipped?: boolean;
}) {
  return (
    <section
      className={[
        'flex flex-col gap-3 rounded-lg p-5 shadow-raised',
        flipped
          ? 'border-2 border-ink bg-surface text-ink dark:border-0 dark:bg-ink dark:text-bg'
          : 'bg-ink text-bg dark:bg-surface dark:text-ink',
      ].join(' ')}
    >
      <span className={['text-label', flipped ? 'text-ink dark:text-bg' : 'text-accent'].join(' ')}>
        {label}
      </span>
      <div className="flex flex-col">
        <span className="text-title">Friday, Nov 27</span>
        <span className="text-small opacity-80">4 letters · par {PUZZLE.par}</span>
      </div>
      <p className="text-heading tracking-[0.2em] uppercase">
        {PUZZLE.start} {arrow} {PUZZLE.end}
      </p>
      {note && <p className="text-small opacity-80">{note}</p>}
      <Button size="lg">Play</Button>
    </section>
  );
}

const OPTIONS = [
  {
    name: 'Before',
    note: 'A plain daily, nothing says it’s special.',
    card: <Card label="☀ Today's puzzle" arrow="→" />,
  },
  {
    name: 'Option 1 · Quiet',
    note: 'Same card. The label and the arrow change, plus one line saying what’s going on.',
    card: (
      <Card label="⇄ Opposites day" arrow="⇄" note="Every Friday, the two words are opposites." />
    ),
  },
  {
    name: 'Option 2 · The card flips too (chosen)',
    note: 'A little joke: on Opposites day the card itself turns the opposite of its usual color.',
    card: (
      <Card
        label="⇄ Opposites day"
        arrow="⇄"
        note="Every Friday, the two words are opposites."
        flipped
      />
    ),
  },
];

/** Switch Storybook's theme in the toolbar to see the dark versions. */
export function OppositesCompare() {
  return (
    <div className="flex flex-wrap gap-4">
      {OPTIONS.map(({ name, note, card }) => (
        <figure key={name} className="flex w-[340px] flex-col gap-2">
          <figcaption className="flex min-h-16 flex-col">
            <span className="text-heading">{name}</span>
            <span className="text-small text-muted">{note}</span>
          </figcaption>
          {card}
        </figure>
      ))}
    </div>
  );
}
