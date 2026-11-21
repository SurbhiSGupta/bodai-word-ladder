import type { Meta, StoryObj } from '@storybook/react-vite';
import { Buddies, type Face } from './Buddies.tsx';

const meta = {
  title: 'Brand/Buddies',
  component: Buddies,
  args: { face: 'default', show: 'both', height: 200 },
} satisfies Meta<typeof Buddies>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Together: Story = {};
export const JustHer: Story = { args: { show: 'her' } };
export const JustFrisky: Story = { args: { show: 'frisky', height: 90 } };

const FACES: Face[] = ['default', 'happy', 'cute', 'curious', 'joy', 'kiss', 'sad'];

/** Every face, with when to use it. */
export const AllFaces: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {FACES.map((face) => (
        <figure key={face} className="flex flex-col items-center gap-1">
          <Buddies face={face} show="her" height={140} />
          <figcaption className="text-label text-muted">{face}</figcaption>
        </figure>
      ))}
    </div>
  ),
};
