import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button.tsx';

const meta = {
  title: 'Basics/Button',
  component: Button,
  args: { children: 'Play', variant: 'primary', size: 'lg', disabled: false },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Accent: Story = { args: { variant: 'accent', children: 'Hint' } };
export const Quiet: Story = { args: { variant: 'quiet', children: 'Undo', size: 'md' } };
export const Disabled: Story = { args: { disabled: true } };
