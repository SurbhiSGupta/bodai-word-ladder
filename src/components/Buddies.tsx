import type { ReactNode } from 'react';

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

function Her({ face }: { face: Face }) {
  return (
    <g style={PEN}>
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
    </g>
  );
}

function Frisky() {
  return (
    <g style={PEN}>
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
};

const VIEW_BOXES = { both: '-6 4 100 142', her: '28 4 64 142', frisky: '-6 96 66 50' };

export function Buddies({ face = 'default', show = 'both', height = 160, label }: BuddiesProps) {
  const [, , w, h] = VIEW_BOXES[show].split(' ').map(Number);
  return (
    <svg
      viewBox={VIEW_BOXES[show]}
      height={height}
      width={(height * w!) / h!}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {show !== 'her' && <Frisky />}
      {show !== 'frisky' && <Her face={face} />}
    </svg>
  );
}
