/**
 * Phase 5 proposal: what a shared result looks like when it lands in a friend's chat.
 * No words, ever, so it can't spoil the puzzle. The end card gets a Share button either way.
 */

import { EndCard } from '../components/EndCard.tsx';
import { shareLadder, shareLine, type ShareInput } from '../game/share.ts';

const GAME: ShareInput = {
  title: 'Daily',
  date: 'Nov 22',
  path: ['ruby', 'rubs', 'runs', 'guns', 'gunk'],
  end: 'gunk',
  par: 4,
  solved: true,
  bonesUsed: 1,
  bones: 10,
  hints: 0,
  url: 'wordladder.bodaijewels.com',
};

function Bubble({ text }: { text: string }) {
  return (
    <div className="max-w-[300px] self-end rounded-lg rounded-br-sm bg-surface px-4 py-3 text-body whitespace-pre-wrap text-ink shadow-card">
      {text}
    </div>
  );
}

const OPTIONS = [
  {
    name: 'Option 1 · A little ladder (chosen)',
    note: 'Like Wordle’s squares, read bottom to top: every word you climbed as colors against the end word, all green at the top.',
    text: shareLadder(GAME),
  },
  {
    name: 'Option 2 · Just the result',
    note: 'Three short lines: steps against par, bones left, hints if any. Quieter in a busy group chat.',
    text: shareLine(GAME),
  },
];

export function ShareCompare() {
  return (
    <div className="flex flex-wrap gap-4">
      <figure className="flex w-[340px] flex-col gap-2">
        <figcaption className="flex min-h-16 flex-col">
          <span className="text-heading">The end card</span>
          <span className="text-small text-muted">
            A Share button next to the main one. On a phone it opens the share sheet; on a computer
            it copies the text.
          </span>
        </figcaption>
        <EndCard
          outcome="solved"
          yourPath={GAME.path}
          bestPath={GAME.path}
          par={GAME.par}
          onWord={() => {}}
          onNext={() => {}}
          nextLabel="Back to home"
          onShare={() => {}}
        />
      </figure>
      {OPTIONS.map(({ name, note, text }) => (
        <figure key={name} className="flex w-[340px] flex-col gap-2">
          <figcaption className="flex min-h-16 flex-col">
            <span className="text-heading">{name}</span>
            <span className="text-small text-muted">{note}</span>
          </figcaption>
          <div className="flex flex-col rounded-lg border border-edge bg-bg p-4">
            <Bubble text={text} />
          </div>
        </figure>
      ))}
    </div>
  );
}
