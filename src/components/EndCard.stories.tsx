import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { EndCard } from './EndCard.tsx';

const meta = {
  title: 'Game/EndCard',
  component: EndCard,
  args: {
    outcome: 'solved',
    yourPath: ['slip', 'ship', 'shin', 'shun'],
    bestPath: ['slip', 'ship', 'shin', 'shun'],
    par: 3,
    onWord: fn(),
    onNext: fn(),
    onTryAgain: fn(),
  },
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-sm">{<Story />}</div>],
} satisfies Meta<typeof EndCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnPar: Story = {};

export const UnderPar: Story = {
  args: {
    yourPath: ['fire', 'fore', 'core', 'cord', 'cold'],
    bestPath: ['fire', 'fore', 'core', 'cord', 'cold'],
    par: 5,
  },
};

export const OverPar: Story = {
  args: {
    yourPath: ['fire', 'hire', 'here', 'hare', 'care', 'core', 'cord', 'cold'],
    bestPath: ['fire', 'fore', 'core', 'cord', 'cold'],
    par: 4,
  },
};

export const OutOfBones: Story = {
  args: {
    outcome: 'out-of-bones',
    yourPath: ['deft'],
    bestPath: ['deft', 'daft', 'dart', 'part', 'port'],
    par: 4,
  },
};

export const TimeUp: Story = {
  args: {
    outcome: 'time-up',
    yourPath: ['deft', 'daft'],
    bestPath: ['deft', 'daft', 'dart', 'part', 'port'],
    par: 4,
  },
};

/** The daily's end card, with Share. */
export const WithShare: Story = { args: { onShare: () => {}, nextLabel: 'Back to home' } };
