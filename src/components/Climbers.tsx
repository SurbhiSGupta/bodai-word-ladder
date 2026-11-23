import { Bone } from './BoneCounter.tsx';
import { Buddies, type Face } from './Buddies.tsx';

/**
 * Her and Frisky on the game screen. She stands beside the rung you're on and climbs one
 * rung per word; Frisky waits by the start word and gets a bone for every miss.
 * Both are decoration: the ladder itself says everything a screen reader needs.
 */

export type ClimberProps = {
  face?: Face;
  /** Change this number to replay the climb, one rung up or down. */
  step: number;
  direction?: 'up' | 'down';
  /** Small, for 6 and 7-letter ladders where the rungs are wider. */
  small?: boolean;
};

/** Her, standing beside a rung. Place inside a `relative` box that holds the rung. */
export function Climber({ face = 'default', step, direction = 'up', small = false }: ClimberProps) {
  return (
    <span
      key={step}
      className={[
        'pointer-events-none absolute right-full bottom-1 mr-1',
        step > 0 ? (direction === 'up' ? 'animate-climb-up' : 'animate-climb-down') : '',
      ].join(' ')}
    >
      <Buddies show="her" face={face} height={small ? 44 : 56} />
    </span>
  );
}

/** Frisky, sitting beside the start word. A new number of bones drops one in his mouth. */
export function FriskyWaiting({
  bonesEaten,
  small = false,
}: {
  bonesEaten: number;
  small?: boolean;
}) {
  return (
    <span className="pointer-events-none absolute bottom-1 left-full ml-1">
      <Buddies show="frisky" height={small ? 26 : 34} hop={bonesEaten} />
      {bonesEaten > 0 && (
        // Hidden at rest, so with motion off no bone is left hanging in the air.
        <span key={bonesEaten} className="absolute -top-3 left-6 opacity-0 animate-chomp">
          <Bone size="sm" />
        </span>
      )}
    </span>
  );
}
