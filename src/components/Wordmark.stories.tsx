import type { Meta, StoryObj } from '@storybook/react-vite';
import { Wordmark } from './Wordmark.tsx';

const meta = {
  title: 'Brand/Wordmark',
  component: Wordmark,
  args: { size: 'display' },
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = {};
export const Title: Story = { args: { size: 'title' } };
export const Short: Story = { name: 'Short name', args: { children: 'Ladder', size: 'title' } };
