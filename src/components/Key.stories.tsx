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

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

/** A first look at the full keyboard. The real one comes with the playable core. */
export const Keyboard: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-1.5">
      {ROWS.map((row, i) => (
        <div key={row} className="flex gap-1.5">
          {i === 2 && <Key label="Enter" wide />}
          {Array.from(row).map((letter) => (
            <Key key={letter} label={letter} />
          ))}
          {i === 2 && <Key label="⌫" spokenLabel="Delete" wide />}
        </div>
      ))}
    </div>
  ),
};
