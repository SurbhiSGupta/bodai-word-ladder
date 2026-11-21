import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rung } from './Rung.tsx';

const meta = {
  title: 'Ladder/Rung',
  component: Rung,
  args: { word: 'cord', endWord: 'cold', role: 'step', showNear: true, size: 'lg' },
} satisfies Meta<typeof Rung>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step: Story = {};

export const StartWord: Story = { args: { word: 'fire', role: 'start', endWord: undefined } };

export const EndWord: Story = { args: { word: 'cold', role: 'end', endWord: undefined } };

export const Typing: Story = { args: { word: 'core', role: 'current', selectedIndex: 3 } };

export const NotAWord: Story = {
  name: 'Not a word (shakes)',
  args: { word: 'corx', role: 'current', invalid: true },
};

export const WithoutYellow: Story = {
  name: 'Green only (yellow off)',
  args: { word: 'dolt', showNear: false },
};

/** FIRE to COLD: the reel that started it all. */
export const WholeLadder: Story = {
  render: () => (
    <ol aria-label="Ladder from FIRE to COLD" className="flex flex-col items-start gap-1">
      <li>
        <Rung word="fire" role="start" />
      </li>
      {['fore', 'core', 'cord'].map((word) => (
        <li key={word}>
          <Rung word={word} endWord="cold" />
        </li>
      ))}
      <li>
        <Rung word="cold" role="end" />
      </li>
    </ol>
  ),
};
