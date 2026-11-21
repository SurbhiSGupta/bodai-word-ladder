import type { Meta, StoryObj } from '@storybook/react-vite';
import { LetterTile } from './LetterTile.tsx';

const meta = {
  title: 'Ladder/LetterTile',
  component: LetterTile,
  args: { letter: 'c', hint: 'none', selected: false, size: 'lg' },
} satisfies Meta<typeof LetterTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Match: Story = { args: { hint: 'match' } };
export const Near: Story = { args: { hint: 'near' } };
export const Selected: Story = { args: { selected: true } };

export const AllStates: Story = {
  render: () => (
    <div className="flex gap-2">
      <LetterTile letter="b" />
      <LetterTile letter="o" hint="match" />
      <LetterTile letter="l" hint="near" />
      <LetterTile letter="d" selected />
    </div>
  ),
};
