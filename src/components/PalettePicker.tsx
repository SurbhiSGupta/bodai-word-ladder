import { PALETTES, PALETTE_SWATCHES, type Palette } from '../styles/palettes.ts';

export type PalettePickerProps = { value: Palette; onChange: (palette: Palette) => void };

const title = (name: string) => name[0]!.toUpperCase() + name.slice(1);

/** The color families, as swatches: Boduku's five plus Coral, Sky and Sand. */
export function PalettePicker({ value, onChange }: PalettePickerProps) {
  return (
    <div role="radiogroup" aria-label="Colors" className="flex flex-wrap gap-3">
      {PALETTES.map((palette) => {
        const selected = value === palette;
        return (
          <button
            key={palette}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(palette)}
            className="flex flex-col items-center gap-1 rounded-md p-1 focus-visible:outline-2 focus-visible:outline-ink"
          >
            <span
              className={[
                'grid size-11 place-items-center rounded-pill border-2',
                selected ? 'border-ink' : 'border-transparent',
              ].join(' ')}
            >
              <span
                className="size-8 rounded-pill"
                style={{ background: PALETTE_SWATCHES[palette] }}
              />
            </span>
            <span className={['text-small', selected ? 'font-semibold' : 'text-muted'].join(' ')}>
              {title(palette)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
