/**
 * Phase 6 proposal: the app icon, in the same family as Boduku's (navy square, tiles,
 * one neon square). Each option is shown at home-screen, tab and favicon sizes.
 */

const NAVY = '#10303b';
const SLATE = '#24485a';
const NEON = '#eeff41';
const WHITE = '#ffffff';

/** Three rungs of three tiles; one changed tile per rung, climbing up and to the right. */
const CLIMB = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${NAVY}"/>
<g fill="${SLATE}"><rect x="12.5" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="4" width="7" height="7" rx="1.6"/>
<rect x="4" y="12.5" width="7" height="7" rx="1.6"/><rect x="21" y="12.5" width="7" height="7" rx="1.6"/>
<rect x="12.5" y="21" width="7" height="7" rx="1.6"/><rect x="21" y="21" width="7" height="7" rx="1.6"/></g>
<rect x="4" y="21" width="7" height="7" rx="1.6" fill="${WHITE}"/><rect x="12.5" y="12.5" width="7" height="7" rx="1.6" fill="${WHITE}"/>
<rect x="21" y="4" width="7" height="7" rx="1.6" fill="${NEON}"/></svg>`;

/** A ladder drawn in the game's pen, top rung neon. */
const LADDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${NAVY}"/>
<g stroke="${WHITE}" stroke-width="2.6" stroke-linecap="round"><path d="M10 5v22M22 5v22M10 21h12M10 14.5h12"/></g>
<path d="M10 8h12" stroke="${NEON}" stroke-width="3.4" stroke-linecap="round"/></svg>`;

/** Rungs of tiles, wide then narrower like the game: white start, neon end on top. */
const RUNGS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${NAVY}"/>
<g fill="${NEON}"><rect x="5" y="5" width="4.6" height="5" rx="1.2"/><rect x="11" y="5" width="4.6" height="5" rx="1.2"/><rect x="16.4" y="5" width="4.6" height="5" rx="1.2"/><rect x="22.4" y="5" width="4.6" height="5" rx="1.2"/></g>
<g fill="${SLATE}"><rect x="5" y="13.5" width="4.6" height="5" rx="1.2"/><rect x="16.4" y="13.5" width="4.6" height="5" rx="1.2"/><rect x="22.4" y="13.5" width="4.6" height="5" rx="1.2"/></g>
<rect x="11" y="13.5" width="4.6" height="5" rx="1.2" fill="${NEON}"/>
<g fill="${WHITE}"><rect x="5" y="22" width="4.6" height="5" rx="1.2"/><rect x="11" y="22" width="4.6" height="5" rx="1.2"/><rect x="16.4" y="22" width="4.6" height="5" rx="1.2"/><rect x="22.4" y="22" width="4.6" height="5" rx="1.2"/></g></svg>`;

const BODUKU = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${NAVY}"/>
<g fill="${WHITE}"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="21" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="21" width="7" height="7" rx="1.6"/><rect x="21" y="21" width="7" height="7" rx="1.6"/></g>
<g fill="${SLATE}"><rect x="12.5" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="12.5" width="7" height="7" rx="1.6"/><rect x="21" y="12.5" width="7" height="7" rx="1.6"/><rect x="12.5" y="21" width="7" height="7" rx="1.6"/></g>
<rect x="12.5" y="12.5" width="7" height="7" rx="1.6" fill="${NEON}"/></svg>`;

const OPTIONS = [
  {
    name: 'Option 1 · The climb',
    note: 'Boduku’s tiles, but one square lights up per rung, climbing to the neon one at the top right. Closest to Boduku.',
    svg: CLIMB,
  },
  {
    name: 'Option 2 · A ladder (chosen)',
    note: 'Says “ladder” at a glance, in the game’s pen. Least like Boduku.',
    svg: LADDER,
  },
  {
    name: 'Option 3 · Rungs of tiles',
    note: 'Three words as tiles: white start, one changed letter, neon end on top. Busier at tab size.',
    svg: RUNGS,
  },
];

const src = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

function Sizes({ svg, label }: { svg: string; label: string }) {
  return (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-1">
        <img src={src(svg)} width={96} height={96} alt="" className="rounded-[22%]" />
        <span className="text-small">{label}</span>
      </div>
      <img src={src(svg)} width={32} height={32} alt="" />
      <img src={src(svg)} width={16} height={16} alt="" />
    </div>
  );
}

export function IconCompare() {
  return (
    <div className="flex flex-col gap-6">
      <figure className="flex flex-col gap-2">
        <figcaption className="text-small text-muted">For reference: Boduku’s icon</figcaption>
        <Sizes svg={BODUKU} label="Bodai Sudoku" />
      </figure>
      <div className="flex flex-wrap gap-8">
        {OPTIONS.map(({ name, note, svg }) => (
          <figure key={name} className="flex w-[260px] flex-col gap-3">
            <figcaption className="flex min-h-20 flex-col">
              <span className="text-heading">{name}</span>
              <span className="text-small text-muted">{note}</span>
            </figcaption>
            <Sizes svg={svg} label="Word Ladder" />
          </figure>
        ))}
      </div>
    </div>
  );
}

/** A phone home screen, so each icon is seen where it will live: next to Boduku's. */
function Phone({ wallpaper, icon, label }: { wallpaper: string; icon: string; label: string }) {
  const app = (svg: string, name: string) => (
    <div className="flex flex-col items-center gap-1">
      <img src={src(svg)} width={60} height={60} alt="" className="rounded-[22%] shadow-card" />
      <span className="text-[11px] text-white drop-shadow">{name}</span>
    </div>
  );
  return (
    <div
      className="grid w-[260px] grid-cols-3 gap-y-5 rounded-[36px] px-6 pt-14 pb-10"
      style={{ background: wallpaper }}
      aria-label={label}
    >
      {app(BODUKU, 'Bodai Sudoku')}
      {app(icon, 'Word Ladder')}
    </div>
  );
}

const WALLPAPERS = {
  light: 'linear-gradient(160deg, #f4c7b8, #c9b6ff)',
  dark: 'linear-gradient(160deg, #1b2a4a, #0a1e25)',
};

export function IconHomeScreens() {
  return (
    <div className="flex flex-wrap gap-8">
      {[
        { name: 'Option 1 · The climb', svg: CLIMB },
        { name: 'Option 2 · A ladder (chosen)', svg: LADDER },
      ].map(({ name, svg }) => (
        <figure key={name} className="flex flex-col gap-3">
          <figcaption className="text-heading">{name}</figcaption>
          <div className="flex gap-4">
            <Phone wallpaper={WALLPAPERS.light} icon={svg} label={`${name}, light wallpaper`} />
            <Phone wallpaper={WALLPAPERS.dark} icon={svg} label={`${name}, dark wallpaper`} />
          </div>
          <Sizes svg={svg} label="Word Ladder" />
        </figure>
      ))}
    </div>
  );
}
