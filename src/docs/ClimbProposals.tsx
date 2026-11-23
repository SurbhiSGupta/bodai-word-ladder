/**
 * Phase 5 proposal: her climbing the ladder while Frisky waits at the bottom. Three mock
 * game screens play the same ladder, driven by one set of buttons, so the motion can be
 * compared side by side before anything changes in the game.
 */

import { useState, type ReactNode } from 'react';
import { Bone, BoneCounter } from '../components/BoneCounter.tsx';
import { Buddies } from '../components/Buddies.tsx';
import { Button } from '../components/Button.tsx';
import { Rung } from '../components/Rung.tsx';

const START = 'fire';
const END = 'cold';
const PATH = ['fore', 'core', 'cord', 'cold'];
const PAR = PATH.length;
/** A md rung is 60px tall, plus the 4px gap between rungs. */
const ROW = 64;
const HER = 64;

type Play = { steps: number; bones: number };

/** A bone that drops into Frisky's mouth, replayed each time one is lost. */
function Chomp({ bones }: { bones: number }) {
  if (bones === 0) return null;
  return (
    <span
      key={bones}
      className="pointer-events-none absolute -top-3 left-6 animate-[chomp_0.7s_ease-in_forwards]"
    >
      <Bone size="sm" />
    </span>
  );
}

function FriskyWaiting({ play }: { play: Play }) {
  return (
    <div className="relative">
      <Buddies show="frisky" height={34} hop={play.bones} />
      <Chomp bones={play.bones} />
    </div>
  );
}

function Frame({ play, children }: { play: Play; children: ReactNode }) {
  return (
    <div className="flex h-[600px] w-[340px] flex-col gap-2 overflow-hidden rounded-lg border border-edge bg-bg px-3 py-3">
      <div className="flex items-center justify-between px-1 text-small text-muted">
        <span>Par {PAR}</span>
        <BoneCounter used={play.bones} total={10} size="sm" />
      </div>
      {children}
    </div>
  );
}

function stepsOf(play: Play) {
  const words = PATH.slice(0, play.steps);
  const solved = words.at(-1) === END;
  return { words: words.filter((w) => w !== END), solved };
}

/** Today: no climb. The ladder reads top to bottom, start to end. */
function Before({ play }: { play: Play }) {
  const { words, solved } = stepsOf(play);
  return (
    <Frame play={play}>
      <div className="flex flex-1 flex-col items-center gap-1">
        <Rung word={START} role="start" size="md" />
        <div className="flex flex-1 flex-col items-center gap-1">
          {words.map((w) => (
            <Rung key={w} word={w} endWord={END} size="md" />
          ))}
          {!solved && <Rung word="    " role="current" size="md" selectedIndex={0} />}
        </div>
        <Rung word={END} role="end" size="md" />
      </div>
    </Frame>
  );
}

/** Option 1: the words stay as they are; a slim ladder on the left shows how far up she is. */
function SideRail({ play }: { play: Play }) {
  const { words, solved } = stepsOf(play);
  const rungs = PAR;
  const RAIL_H = 420;
  const gap = RAIL_H / rungs;
  // Each word is one rung up; before the first word she waits on the ground with Frisky.
  const rung = solved ? rungs - 1 : play.steps - 1;
  const feet = rung < 0 ? 24 + RAIL_H : 24 + (rungs - 1 - rung) * gap + gap / 2;
  return (
    <Frame play={play}>
      <div className="flex flex-1 gap-1">
        <div className="relative w-14 shrink-0">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-label text-muted uppercase">
            {END}
          </span>
          <svg
            className="absolute top-6 left-1/2 -translate-x-1/2"
            width="30"
            height={RAIL_H}
            aria-hidden="true"
          >
            <g stroke="var(--edge)" strokeWidth="3" strokeLinecap="round">
              <path d={`M4 0V${RAIL_H}M26 0V${RAIL_H}`} />
              {Array.from({ length: rungs }, (_, i) => (
                <path key={i} d={`M4 ${i * gap + gap / 2}H26`} />
              ))}
            </g>
          </svg>
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-[top] duration-500 ease-out"
            style={{ top: feet - HER + 4 }}
          >
            <Buddies show="her" height={HER} face={solved ? 'joy' : 'default'} />
          </div>
          <div className="absolute -left-2" style={{ top: RAIL_H - 4 }}>
            <FriskyWaiting play={play} />
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1">
          <Rung word={START} role="start" size="md" />
          <div className="flex flex-1 flex-col items-center gap-1">
            {words.map((w) => (
              <Rung key={w} word={w} endWord={END} size="md" />
            ))}
            {!solved && <Rung word="    " role="current" size="md" selectedIndex={0} />}
          </div>
          <Rung word={END} role="end" size="md" />
        </div>
      </div>
    </Frame>
  );
}

/** Option 2: the ladder flips, end on top, and she stands on the rung you're typing. */
function Flipped({ play }: { play: Play }) {
  const { words, solved } = stepsOf(play);
  // Rows counted up from the start word: 0 is the start, then each step, then the current rung.
  const herRow = solved ? null : words.length + 1;
  return (
    <Frame play={play}>
      <div className="flex flex-1 flex-col items-center gap-1">
        <Rung word={END} role="end" size="md" />
        <div className="relative flex w-full flex-1 flex-col-reverse items-center gap-1">
          <Rung word={START} role="start" size="md" />
          {words.map((w) => (
            <Rung key={w} word={w} endWord={END} size="md" />
          ))}
          {!solved && <Rung word="    " role="current" size="md" selectedIndex={0} />}
          <div
            className="absolute left-0 transition-[bottom] duration-500 ease-out"
            style={{ bottom: herRow === null ? 'calc(100% - 4px)' : herRow * ROW + 4 }}
          >
            <Buddies show="her" height={HER} face={solved ? 'joy' : 'default'} />
          </div>
          <div className="absolute right-0 bottom-1">
            <FriskyWaiting play={play} />
          </div>
        </div>
      </div>
    </Frame>
  );
}

const OPTIONS = [
  { name: 'Before', note: 'No climb. Start on top, end at the bottom.', View: Before },
  {
    name: 'Option 1 · Side rail',
    note: 'Words stay where they are. A slim ladder on the left fills up one rung per word, Frisky at its foot.',
    View: SideRail,
  },
  {
    name: 'Option 2 · Flip the ladder (chosen)',
    note: 'End word on top, like a real ladder. She stands on the rung you’re typing, Frisky by the start word. Picked on Nov 22, 2026.',
    View: Flipped,
  },
];

export function ClimbCompare() {
  const [play, setPlay] = useState<Play>({ steps: 0, bones: 0 });
  const solved = play.steps >= PATH.length;
  return (
    <div className="flex flex-col gap-4">
      <style>{`@keyframes chomp {
        from { transform: translate(0, -18px) rotate(-30deg); opacity: 1; }
        80% { opacity: 1; }
        to { transform: translate(14px, 18px) scale(0.2); opacity: 0; }
      }`}</style>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setPlay((p) => ({ ...p, steps: p.steps + 1 }))} disabled={solved}>
          Add a word
        </Button>
        <Button variant="quiet" onClick={() => setPlay((p) => ({ ...p, bones: p.bones + 1 }))}>
          Lose a bone
        </Button>
        <Button variant="quiet" onClick={() => setPlay({ steps: 0, bones: 0 })}>
          Start over
        </Button>
      </div>
      <div className="flex flex-wrap gap-4">
        {OPTIONS.map(({ name, note, View }) => (
          <figure key={name} className="flex w-[340px] flex-col gap-2">
            <figcaption className="flex min-h-16 flex-col">
              <span className="text-heading">{name}</span>
              <span className="text-small text-muted">{note}</span>
            </figcaption>
            <View play={play} />
          </figure>
        ))}
      </div>
    </div>
  );
}
