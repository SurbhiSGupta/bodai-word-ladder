import { useContext, type ReactNode } from 'react';
import { OutfitContext, type FriskyOutfit, type HerOutfit } from './outfits.ts';

export type { FriskyOutfit, HerOutfit } from './outfits.ts';

/**
 * Her and Frisky, drawn exactly as in Bodai Sudoku: one pen, round ends, no fills on her,
 * Frisky in neon fur. Static poses for now; the animated rig comes with the game screens.
 * Rules live in Storybook under Brand/Characters.
 */

export type Face = 'default' | 'happy' | 'cute' | 'curious' | 'joy' | 'kiss' | 'sad';

const PEN = {
  fill: 'none',
  stroke: 'var(--ink)',
  strokeWidth: 2.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const brow = { strokeWidth: 1.8 };
const dot = { fill: 'var(--ink)', stroke: 'none' };
const blush = { fill: 'var(--blush)', stroke: 'none', opacity: 0.75 };

function Eyes({ y = 35.4, shift = 0 }: { y?: number; shift?: number }) {
  return (
    <>
      <circle style={dot} cx={50.3 + shift} cy={y} r="1.5" />
      <circle style={dot} cx={69.7 + shift} cy={y} r="1.5" />
    </>
  );
}

function SmilingEyes() {
  return (
    <>
      <path style={{ strokeWidth: 1.7 }} d="M47.2 35.9q3.1-2.6 6.2 0" />
      <path style={{ strokeWidth: 1.7 }} d="M66.6 35.9q3.1-2.6 6.2 0" />
    </>
  );
}

function Brows({ left = 28.7, right = 28.7 }) {
  return (
    <>
      <path style={brow} d={`M44.6 ${left}q5.6-2.6 12.1-.7`} />
      <path style={brow} d={`M75.4 ${right}q-5.6-2.6-12.1-.7`} />
    </>
  );
}

function Blush() {
  return (
    <>
      <circle style={blush} cx="45.5" cy="43" r="3" />
      <circle style={blush} cx="74.5" cy="43" r="3" />
    </>
  );
}

const OPEN_SMILE = 'M48.5 45h23q-2.5 9.5-11.5 9.5t-11.5-9.5z';

const FACES: Record<Face, ReactNode> = {
  default: (
    <>
      <Brows />
      <Eyes />
      <path d="M50.5 46q9.5 6.5 19 0" />
    </>
  ),
  happy: (
    <>
      <Brows left={28.2} right={28.2} />
      <Eyes />
      <path style={{ strokeWidth: 2.2 }} d={OPEN_SMILE} />
    </>
  ),
  cute: (
    <>
      <Brows />
      <Eyes />
      <path d="M50.5 46q9.5 6.5 19 0" />
      <Blush />
    </>
  ),
  curious: (
    <>
      <Brows right={27.1} />
      <Eyes shift={0.8} />
      <path d="M51.5 46.2q9 6.2 17.5-.4" />
    </>
  ),
  joy: (
    <>
      <Brows left={27.9} right={27.9} />
      <SmilingEyes />
      <path style={{ strokeWidth: 2.2 }} d={OPEN_SMILE} />
      <Blush />
    </>
  ),
  kiss: (
    <>
      <Brows />
      <SmilingEyes />
      <path d="M57.5 45.5q3-2 3.5.8q-.5 2.2-2.6 2q2.4.4 2 2.6q-1 2-3.4.4" />
      <Blush />
    </>
  ),
  sad: (
    <>
      <path style={brow} d="M44.6 29.8q5.6-1.2 12.1-2.6" />
      <path style={brow} d="M75.4 29.8q-5.6-1.2-12.1-2.6" />
      <Eyes y={36} />
      <path d="M52 50q8-5 16 0" />
    </>
  ),
};

/**
 * Support pack outfits, drawn exactly as in Bodai Sudoku: the same pen, filled in their
 * own wear-* colors. The cape goes behind her; everything else sits on top.
 */
const WEAR = (color: string, strokeWidth = 2) => ({ fill: `var(--wear-${color})`, strokeWidth });

const CAPE = (
  <path
    style={WEAR('cape')}
    d="M58 62.5q-14 24-25.5 49.5l12.5-4l15-42zM62 62.5q14 24 25.5 49.5l-12.5-4l-15-42z"
  />
);

const HER_OUTFITS: Record<HerOutfit, ReactNode> = {
  none: null,
  cape: null,
  party: (
    <>
      <path style={WEAR('party')} d="M49 13.5l13.5-27l10.5 28q-12-4-24-1z" />
      <path
        style={{ stroke: '#ffffff', strokeWidth: 2.4 }}
        d="M53 6.5q7-1.6 13.5.5M57.5-3q3.5-.8 7 .3"
      />
      <circle style={WEAR('pom', 1.6)} cx="62.5" cy="-14.5" r="3.6" />
    </>
  ),
  crown: (
    <path
      style={WEAR('crown')}
      d="M45 16l-1.5-14l8.5 7l8-10.5l8 10.5l8.5-7l-1.5 14q-15-4.5-30 0z"
    />
  ),
  beret: (
    <>
      <path style={WEAR('beret')} d="M37.5 19q-2-15 21-16.5q26-1 23.5 14.5q-22-8-44.5 2z" />
      <path d="M59 2.6q.6-3.4 2.6-4.6" />
    </>
  ),
  shades: (
    <>
      <path
        style={{ fill: 'var(--wear-shades)', stroke: 'none' }}
        d="M43.6 31h13.2q1 0 1 1v3.4q0 4-4 4h-6.4q-3.6 0-4.1-3.6l-.6-3.8q-.1-1 .9-1zM76.4 31h-13.2q-1 0-1 1v3.4q0 4 4 4h6.4q3.6 0 4.1-3.6l.6-3.8q.1-1-.9-1z"
      />
      <path style={{ stroke: '#ffffff', strokeWidth: 1.2 }} d="M46.5 33.5l3-2M65.5 33.5l3-2" />
    </>
  ),
  scarf: (
    <>
      <path style={WEAR('scarf', 1.8)} d="M50.5 58.5q9.5 5.5 19 0v5.5q-9.5 5.5-19 0z" />
      <path style={WEAR('scarf', 1.8)} d="M63 65l3.5 15.5l5-1.5l-3.5-15" />
    </>
  ),
};

const FRISKY_OUTFITS: Record<FriskyOutfit, ReactNode> = {
  none: null,
  bandana: (
    <path
      style={{ fill: 'var(--collar)', strokeWidth: 1.6 }}
      d="M35.5 111.5q6.5 5.5 13.5 1.5l-6 12.5z"
    />
  ),
  bow: (
    <>
      <path style={WEAR('scarf', 1.4)} d="M42 116l-7-4.6v9.2zM42 116l7-4.6v9.2z" />
      <circle style={WEAR('scarf', 1.4)} cx="42" cy="116" r="1.8" />
    </>
  ),
};

function Her({ face, outfit = 'none' }: { face: Face; outfit?: HerOutfit }) {
  return (
    <g style={PEN}>
      {outfit === 'cape' && CAPE}
      <path d="M60 14c13-1 23 9 22 22c0 13-10 22-23 21c-12 0-21-10-20-22c1-12 9-21 21-21" />
      <g style={{ stroke: 'var(--glasses)', strokeWidth: 1.7 }}>
        <path d="M43.6 31h13.2q1 0 1 1v3.4q0 4-4 4h-6.4q-3.6 0-4.1-3.6l-.6-3.8q-.1-1 .9-1z" />
        <path d="M76.4 31h-13.2q-1 0-1 1v3.4q0 4 4 4h6.4q3.6 0 4.1-3.6l.6-3.8q.1-1-.9-1z" />
        <path d="M57.8 33.4q2.2-1.3 4.4 0" />
        <path d="M42.8 32.4l-4.3-1.2M77.2 32.4l4.3-1.2" />
      </g>
      {FACES[face]}
      {/* Hair */}
      <path d="M37 38c-3-18 8-28 23-28s26 10 23 28" />
      <path d="M60 11c-8 2-15 7-19 17" />
      <path d="M60 11c8 2 15 7 19 17" />
      <path d="M37 38c-3 7 1 11-2 17s2 9-3 15" />
      <path d="M83 38c3 7-1 11 2 17s-2 9 3 15" />
      <path style={{ strokeWidth: 1.6 }} d="M40 46c-2 5 1 8-1 13" />
      <path style={{ strokeWidth: 1.6 }} d="M80 46c2 5-1 8 1 13" />
      {/* Neck, dress, arms, legs */}
      <path d="M60 57V66M60 66L45 108H75Z" />
      <path d="M60 74Q50 84 43 94" />
      <path d="M60 74Q70 84 77 94" />
      <path d="M53 108Q51.5 125 50 142" />
      <path d="M67 108Q68.5 125 70 142" />
      {HER_OUTFITS[outfit]}
    </g>
  );
}

function Frisky({ hop = 0, outfit = 'none' }: { hop?: number; outfit?: FriskyOutfit }) {
  return (
    <g
      key={hop}
      style={PEN}
      className={hop ? 'animate-hop [transform-box:fill-box] [transform-origin:bottom]' : undefined}
    >
      <path d="M11 117c-7-3-10-10-7-17" />
      <path d="M16 125v16M23 125v16M31 125v16M38 125v16" />
      <ellipse style={{ fill: 'var(--fur)' }} cx="26" cy="119" rx="17" ry="9" />
      <circle style={{ fill: 'var(--fur)' }} cx="44" cy="108" r="9" />
      <ellipse style={{ fill: 'var(--fur)' }} cx="51.5" cy="112" rx="5.5" ry="3.8" />
      <path
        style={{ fill: 'var(--fur-shade)' }}
        d="M37.5 102c-6 0-8.5 7-5.5 12c3.5-1 6-5.5 5.5-12z"
      />
      <circle style={dot} cx="56.5" cy="110.6" r="1.7" />
      <circle style={dot} cx="46" cy="106" r="1.4" />
      <path style={{ fill: 'var(--tongue)', strokeWidth: 1.4 }} d="M50.5 115.5q1.2 4.5 3.2 0" />
      <path style={{ stroke: 'var(--collar)', strokeWidth: 2.4 }} d="M37 113.5q3 2.5 7 1.5" />
      {FRISKY_OUTFITS[outfit]}
    </g>
  );
}

export type BuddiesProps = {
  face?: Face;
  /** Show her, Frisky, or both (Frisky sits at her feet, on the left). */
  show?: 'both' | 'her' | 'frisky';
  /** Height in px. Width follows. */
  height?: number;
  /** Spoken description. Leave empty when the picture is decoration. */
  label?: string;
  /** Change this number to make Frisky do a little hop. */
  hop?: number;
  /** What she's wearing. Left out, it follows OutfitContext (the player's choice). */
  outfit?: HerOutfit;
  friskyOutfit?: FriskyOutfit;
};

const VIEW_BOXES = { both: '-6 4 100 142', her: '28 4 64 142', frisky: '-6 96 66 50' };

export function Buddies({
  face = 'default',
  show = 'both',
  height = 160,
  label,
  hop = 0,
  outfit,
  friskyOutfit,
}: BuddiesProps) {
  const worn = useContext(OutfitContext);
  const [, , w, h] = VIEW_BOXES[show].split(' ').map(Number);
  return (
    <svg
      viewBox={VIEW_BOXES[show]}
      height={height}
      width={(height * w!) / h!}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      // Hats can reach just past the frame; let them, rather than clipping a pom-pom.
      overflow="visible"
    >
      {show !== 'her' && <Frisky hop={hop} outfit={friskyOutfit ?? worn.frisky} />}
      {show !== 'frisky' && <Her face={face} outfit={outfit ?? worn.her} />}
    </svg>
  );
}
