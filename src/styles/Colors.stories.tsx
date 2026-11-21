import type { Meta, StoryObj } from '@storybook/react-vite';
import tokens from '../../tokens/tokens.json';

/** Every color token, read straight from tokens/tokens.json. Use the toolbar to switch theme and palette. */
function ColorSwatches() {
  const names = [...Object.keys(tokens.theme.light), ...Object.keys(tokens.palettes.bodai.light)];
  return (
    <div className="grid max-w-4xl grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
      {names.map((name) => (
        <div key={name} className="flex items-center gap-3">
          <span
            className="size-11 shrink-0 rounded-sm border border-edge"
            style={{ background: `var(--${name})` }}
          />
          <span className="min-w-0">
            <span className="block font-semibold">{name}</span>
            <code className="block text-xs text-muted">var(--{name})</code>
          </span>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: 'Foundations/Colors',
  component: ColorSwatches,
} satisfies Meta<typeof ColorSwatches>;

export default meta;
export const AllColors: StoryObj<typeof meta> = {};
