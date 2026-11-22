import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toggle } from './Toggle.tsx';

function Demo({ start, description }: { start: boolean; description?: string }) {
  const [on, setOn] = useState(start);
  return (
    <div className="max-w-sm">
      <Toggle label="Family-friendly" description={description} checked={on} onChange={setOn} />
    </div>
  );
}

const meta = { title: 'Basics/Toggle' } satisfies Meta;
export default meta;

export const On: StoryObj = {
  render: () => <Demo start description="Grown-up words are refused kindly." />,
};
export const Off: StoryObj = { render: () => <Demo start={false} /> };
