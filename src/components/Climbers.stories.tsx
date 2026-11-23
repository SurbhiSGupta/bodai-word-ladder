import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button.tsx';
import { Climber, FriskyWaiting } from './Climbers.tsx';
import { Rung } from './Rung.tsx';

const WORDS = ['fore', 'core', 'cord'];

/** A tiny game ladder: add words and she climbs; miss and Frisky gets a bone. */
function ClimbDemo() {
  const [steps, setSteps] = useState(0);
  const [bones, setBones] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const shown = WORDS.slice(0, steps);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <Button
          disabled={steps === WORDS.length}
          onClick={() => {
            setDirection('up');
            setSteps(steps + 1);
          }}
        >
          Add a word
        </Button>
        <Button
          variant="quiet"
          disabled={steps === 0}
          onClick={() => {
            setDirection('down');
            setSteps(steps - 1);
          }}
        >
          Undo
        </Button>
        <Button variant="quiet" onClick={() => setBones(bones + 1)}>
          Miss
        </Button>
      </div>
      <div className="flex flex-col items-center gap-1 px-16">
        <Rung word="cold" role="end" size="md" />
        <div className="relative">
          <Rung word="    " role="current" size="md" selectedIndex={0} />
          <Climber step={steps} direction={direction} />
        </div>
        {shown.map((word) => <Rung key={word} word={word} endWord="cold" size="md" />).reverse()}
        <div className="relative">
          <Rung word="fire" role="start" size="md" />
          <FriskyWaiting bonesEaten={bones} />
        </div>
      </div>
    </div>
  );
}

const meta = { title: 'Brand/Climbers' } satisfies Meta;
export default meta;

/** She climbs one rung per word and steps back down on Undo. Frisky waits by the start word. */
export const OnTheLadder: StoryObj = { render: () => <ClimbDemo /> };
