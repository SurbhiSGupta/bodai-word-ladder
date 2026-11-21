import type { Meta, StoryObj } from '@storybook/react-vite';
import { Key } from './Key.tsx';

const meta = {
  title: 'Basics/Key',
  component: Key,
  args: { label: 'q', wide: false },
} satisfies Meta<typeof Key>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Letter: Story = {};
export const Enter: Story = { args: { label: 'Enter', wide: true } };
export const Delete: Story = { args: { label: '⌫', spokenLabel: 'Delete', wide: true } };
