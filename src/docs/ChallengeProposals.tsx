/**
 * Phase 5 proposal: how the Challenge of the day shows up. Each column is the middle of
 * Home, so the challenge can be judged next to today's puzzle before anything changes.
 */

import { Buddies } from '../components/Buddies.tsx';
import { Button } from '../components/Button.tsx';
import type { ReactNode } from 'react';

const TODAY = { start: 'lamp', end: 'wire', par: 4 };
const CHALLENGE = { start: 'blacken', end: 'skillet', par: 8 };

function TodayCard() {
  return (
    <section className="flex flex-col gap-3 rounded-lg bg-ink p-5 text-bg shadow-raised dark:bg-surface dark:text-ink">
      <span className="text-label text-accent">☀ Today's puzzle</span>
      <div className="flex flex-col">
        <span className="text-title">Sunday, Nov 22</span>
        <span className="text-small opacity-80">4 letters · par {TODAY.par}</span>
      </div>
      <p className="text-heading tracking-[0.2em] uppercase">
        {TODAY.start} → {TODAY.end}
      </p>
      <Button size="lg">Play</Button>
    </section>
  );
}

function Words() {
  return (
    <p className="text-body-strong tracking-[0.15em] uppercase">
      {CHALLENGE.start} → {CHALLENGE.end}
    </p>
  );
}

/** Option 1: a second card on Home, always there, right under today's puzzle. */
function HomeCard() {
  return (
    <section className="flex items-center gap-3 rounded-lg bg-surface p-4 shadow-card">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-label text-muted">🔥 Challenge of the day</span>
        <Words />
        <span className="text-small text-muted">
          {CHALLENGE.start.length} letters · par {CHALLENGE.par}
        </span>
      </div>
      <Button variant="accent">I accept</Button>
    </section>
  );
}

/** Option 2: like Boduku's Wild card. An invitation pops up once today's puzzle is solved. */
function Invitation() {
  return (
    <div className="flex flex-col gap-3 rounded-t-lg bg-surface px-5 pt-4 pb-5 shadow-raised">
      <div className="flex items-end gap-3">
        <Buddies face="curious" height={84} />
        <div className="flex flex-col gap-1 pb-1">
          <span className="text-label text-muted">🔥 Challenge of the day</span>
          <h3 className="text-heading">Do you accept the challenge?</h3>
        </div>
      </div>
      <p className="text-body text-muted">
        Seven letters, par {CHALLENGE.par}. Long words hardly ever connect, so a ladder like this is
        rare.
      </p>
      <Words />
      <div className="flex gap-2">
        <Button variant="quiet" className="flex-1">
          Not today
        </Button>
        <Button variant="accent" className="flex-1">
          I accept!
        </Button>
      </div>
    </div>
  );
}

function Column({ name, note, children }: { name: string; note: string; children: ReactNode }) {
  return (
    <figure className="flex w-[360px] flex-col gap-2">
      <figcaption className="flex min-h-16 flex-col">
        <span className="text-heading">{name}</span>
        <span className="text-small text-muted">{note}</span>
      </figcaption>
      <div className="flex flex-col gap-3 rounded-lg border border-edge bg-bg p-4">{children}</div>
    </figure>
  );
}

export function ChallengeCompare() {
  return (
    <div className="flex flex-wrap gap-4">
      <Column name="Before" note="Today's puzzle only.">
        <TodayCard />
      </Column>
      <Column
        name="Option 1 · A card on Home"
        note="Always there under today's puzzle. Easy to find, a bit less of a surprise."
      >
        <TodayCard />
        <HomeCard />
      </Column>
      <Column
        name="Option 2 · An invitation"
        note="Like Boduku's Wild card: it slides up after you solve today's puzzle. Not today just closes it, and the card on Home stays for later."
      >
        <TodayCard />
        <HomeCard />
        <Invitation />
      </Column>
    </div>
  );
}
