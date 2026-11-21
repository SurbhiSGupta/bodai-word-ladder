import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button.tsx';
import { Sheet } from './Sheet.tsx';

function MeaningDemo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open WOLD</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="WOLD">
        <ul className="flex flex-col gap-3">
          <li className="flex flex-col gap-0.5">
            <span className="text-label text-muted">noun</span>
            <span className="text-body">a tract of open rolling country (especially upland)</span>
          </li>
        </ul>
      </Sheet>
    </>
  );
}

const meta = { title: 'Basics/Sheet' } satisfies Meta;

export default meta;

/** A word's meaning, as the end card shows it. Escape or a tap outside closes it. */
export const WordMeaning: StoryObj = { render: () => <MeaningDemo /> };
