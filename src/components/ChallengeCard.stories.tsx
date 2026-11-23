import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChallengeCard, ChallengeInvite } from './ChallengeCard.tsx';

const puzzle = {
  start: 'blacken',
  end: 'skillet',
  par: 8,
  bestPath: ['blacken', 'slacken', 'slicken', 'slicker', 'slither', 'skitter', 'skillet'],
};

const meta = {
  title: 'Game/ChallengeCard',
  component: ChallengeCard,
  args: { puzzle, actionLabel: 'I accept', onPlay: () => {} },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChallengeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On Home, under today's puzzle. */
export const NotPlayed: Story = {};

export const InProgress: Story = { args: { status: 'In progress', actionLabel: 'Continue' } };

export const Conquered: Story = {
  args: { status: 'Conquered in 9 steps ✓', actionLabel: 'See it' },
};

/** What slides up once today's puzzle is solved, inside a Sheet. Like Boduku's Wild card. */
export const Invitation: StoryObj<typeof ChallengeInvite> = {
  render: () => (
    <div className="max-w-md rounded-lg bg-surface p-5 shadow-raised">
      <h2 className="pb-3 text-heading">Do you accept the challenge?</h2>
      <ChallengeInvite puzzle={puzzle} onAccept={() => {}} onDecline={() => {}} />
    </div>
  ),
};
