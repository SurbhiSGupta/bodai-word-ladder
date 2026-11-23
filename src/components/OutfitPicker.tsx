import type { ReactNode } from 'react';
import { Buddies } from './Buddies.tsx';
import {
  FRISKY_OUTFIT_NAMES,
  HER_OUTFIT_NAMES,
  type FriskyOutfit,
  type HerOutfit,
} from './outfits.ts';

export type OutfitPickerProps = {
  her: HerOutfit;
  frisky: FriskyOutfit;
  onHer: (outfit: HerOutfit) => void;
  onFrisky: (outfit: FriskyOutfit) => void;
};

function Choice({
  name,
  selected,
  onClick,
  children,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      onClick={onClick}
      className={[
        'flex w-full min-w-0 flex-col items-center gap-1 rounded-md border-2 px-0.5 pt-2 pb-1 focus-visible:outline-2 focus-visible:outline-ink',
        selected ? 'border-ink' : 'border-transparent',
      ].join(' ')}
    >
      {children}
      <span
        className={[
          'text-center text-small leading-tight',
          selected ? 'font-semibold' : 'text-muted',
        ].join(' ')}
      >
        {name}
      </span>
    </button>
  );
}

/** Outfits for her and Frisky, each shown on them. Free for everyone. */
export function OutfitPicker({ her, frisky, onHer, onFrisky }: OutfitPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label="Her outfit" className="grid grid-cols-5 gap-1">
        {(Object.keys(HER_OUTFIT_NAMES) as HerOutfit[]).map((id) => (
          <Choice
            key={id}
            name={HER_OUTFIT_NAMES[id]}
            selected={her === id}
            onClick={() => onHer(id)}
          >
            <Buddies show="her" outfit={id} height={64} />
          </Choice>
        ))}
      </div>
      <div role="radiogroup" aria-label="Frisky's outfit" className="grid grid-cols-4 gap-1">
        {(Object.keys(FRISKY_OUTFIT_NAMES) as FriskyOutfit[]).map((id) => (
          <Choice
            key={id}
            name={FRISKY_OUTFIT_NAMES[id]}
            selected={frisky === id}
            onClick={() => onFrisky(id)}
          >
            <Buddies show="frisky" friskyOutfit={id} height={40} />
          </Choice>
        ))}
      </div>
    </div>
  );
}
