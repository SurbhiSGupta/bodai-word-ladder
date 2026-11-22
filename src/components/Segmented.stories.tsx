import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Segmented } from './Segmented.tsx';

function Demo() {
  const [bones, setBones] = useState<'10' | '5' | 'unlimited'>('10');
  return (
    <Segmented
      label="Bones"
      value={bones}
      options={[
        { value: '10', label: '10' },
        { value: '5', label: '5' },
        { value: 'unlimited', label: 'Unlimited' },
      ]}
      onChange={setBones}
    />
  );
}

const meta = { title: 'Basics/Segmented' } satisfies Meta;
export default meta;

/** One pill for every either/or choice: bones, theme, word length, Zen or Ninja. */
export const Bones: StoryObj = { render: () => <Demo /> };
