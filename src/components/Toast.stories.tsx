import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast.tsx';

const meta = {
  title: 'Basics/Toast',
  component: Toast,
  args: { message: 'Not in our word list', tone: 'problem' },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotAWord: Story = {};
export const KeepItFriendly: Story = {
  args: { message: "Let's keep it friendly 🐾", tone: 'gentle' },
};
export const Info: Story = { args: { message: 'Under par! 🎉', tone: 'info' } };
