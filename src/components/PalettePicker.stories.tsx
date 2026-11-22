import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { Palette } from '../styles/palettes.ts';
import { PalettePicker } from './PalettePicker.tsx';

function Demo() {
  const [palette, setPalette] = useState<Palette>('bodai');
  return <PalettePicker value={palette} onChange={setPalette} />;
}

const meta = { title: 'Basics/PalettePicker' } satisfies Meta;
export default meta;

export const Palettes: StoryObj = { render: () => <Demo /> };
