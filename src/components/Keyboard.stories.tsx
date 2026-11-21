import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Keyboard } from './Keyboard.tsx';

const meta = {
  title: 'Game/Keyboard',
  component: Keyboard,
  args: { onKey: fn(), canSubmit: true },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Keyboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
export const WordNotReady: Story = {
  name: 'Word not ready (Enter dimmed)',
  args: { canSubmit: false },
};
