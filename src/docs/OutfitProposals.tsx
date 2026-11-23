/**
 * Phase 5 proposal: outfits for her and Frisky, free for everyone, with a gentle Support
 * Bodai note. Every option is drawn in the same pen; pick the ones to keep.
 */

import type { ReactNode } from 'react';
import { Buddies, type FriskyOutfit, type HerOutfit } from '../components/Buddies.tsx';

const HERS: { id: HerOutfit; name: string }[] = [
  { id: 'none', name: 'As she is' },
  { id: 'beanie', name: 'Beanie' },
  { id: 'sun-hat', name: 'Sun hat' },
  { id: 'scarf', name: 'Scarf' },
  { id: 'bow', name: 'Hair bow' },
];

const FRISKYS: { id: FriskyOutfit; name: string }[] = [
  { id: 'none', name: 'Just his collar' },
  { id: 'bandana', name: 'Bandana' },
  { id: 'bow-tie', name: 'Bow tie' },
  { id: 'party-hat', name: 'Party hat' },
];

function Option({
  name,
  selected,
  children,
}: {
  name: string;
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <figure
      className={[
        'flex flex-col items-center gap-2 rounded-lg bg-surface px-3 pt-4 pb-3 shadow-card',
        selected ? 'ring-2 ring-ink' : '',
      ].join(' ')}
    >
      {children}
      <figcaption className="text-small font-semibold">{name}</figcaption>
    </figure>
  );
}

export function OutfitCompare() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h2 className="text-heading">Her</h2>
        <p className="text-small text-muted">Lines only, like the rest of her.</p>
        <div className="flex flex-wrap gap-3">
          {HERS.map(({ id, name }) => (
            <Option key={id} name={name}>
              <Buddies outfit={id} height={150} face="happy" />
            </Option>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-heading">Frisky</h2>
        <p className="text-small text-muted">
          In his collar red, so he stays neon in every palette.
        </p>
        <div className="flex flex-wrap gap-3">
          {FRISKYS.map(({ id, name }) => (
            <Option key={id} name={name}>
              <Buddies show="frisky" friskyOutfit={id} height={80} />
            </Option>
          ))}
        </div>
      </section>

      <section className="flex w-[360px] flex-col gap-3 rounded-lg bg-surface p-4 shadow-card">
        <h2 className="text-label text-muted">In Settings → Look</h2>
        <div className="flex items-end gap-3">
          <Buddies outfit="sun-hat" friskyOutfit="bandana" height={110} face="joy" />
          <div className="flex flex-col gap-1 pb-1">
            <span className="text-body-strong">Outfits</span>
            <span className="text-small text-muted">Her: Sun hat · Frisky: Bandana</span>
          </div>
        </div>
        <p className="rounded-md bg-highlight-faint px-3 py-2 text-small">
          Outfits are free for everyone. If they made you smile, you can 💛 Support Bodai.
        </p>
      </section>
    </div>
  );
}
