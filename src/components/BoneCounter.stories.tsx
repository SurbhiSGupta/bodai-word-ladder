import type { Meta, StoryObj } from '@storybook/react-vite';
import { BoneCounter } from './BoneCounter.tsx';

const meta = {
  title: 'Game/BoneCounter',
  component: BoneCounter,
  args: { used: 3, total: 10 },
} satisfies Meta<typeof BoneCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TenBones: Story = {};
export const FiveBones: Story = { args: { used: 1, total: 5 } };
export const Small: Story = { name: 'Small (phone header)', args: { size: 'sm' } };
export const AllGone: Story = { args: { used: 10, total: 10 } };
export const CountUp: Story = {
  name: 'Unlimited (counts up)',
  args: { used: 4, total: undefined },
};
