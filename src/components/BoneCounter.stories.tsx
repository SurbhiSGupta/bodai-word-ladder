import type { Meta, StoryObj } from '@storybook/react-vite';
import { BoneCounter } from './BoneCounter.tsx';

const meta = {
  title: 'Game/BoneCounter',
  component: BoneCounter,
  args: { used: 3, total: 10, arrangement: 'slant' },
} satisfies Meta<typeof BoneCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Slanted: Story = {};
export const Scattered: Story = { args: { arrangement: 'scatter' } };
export const Upright: Story = { args: { arrangement: 'upright' } };
export const FiveBones: Story = { args: { used: 1, total: 5 } };
export const AllGone: Story = { args: { used: 10, total: 10 } };
export const CountUp: Story = {
  name: 'Unlimited (counts up)',
  args: { used: 4, total: undefined },
};

/** All three side by side, to choose from. */
export const Compare: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['slant', 'scatter', 'upright'] as const).map((arrangement) => (
        <div key={arrangement} className="flex flex-col gap-1">
          <span className="text-label text-muted">{arrangement}</span>
          <BoneCounter {...args} arrangement={arrangement} />
        </div>
      ))}
    </div>
  ),
};
