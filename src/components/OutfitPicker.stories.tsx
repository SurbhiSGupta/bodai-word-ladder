import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FriskyOutfit, HerOutfit } from './Buddies.tsx';
import { OutfitPicker } from './OutfitPicker.tsx';

function Demo() {
  const [her, setHer] = useState<HerOutfit>('crown');
  const [frisky, setFrisky] = useState<FriskyOutfit>('bandana');
  return (
    <div className="max-w-sm">
      <OutfitPicker her={her} frisky={frisky} onHer={setHer} onFrisky={setFrisky} />
    </div>
  );
}

const meta = { title: 'Basics/OutfitPicker' } satisfies Meta;
export default meta;

/** As it sits in Settings → Look. Every outfit is free. */
export const Picker: StoryObj = { render: () => <Demo /> };
