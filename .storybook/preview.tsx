import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/index.css';
import { PALETTES } from '../src/styles/palettes.ts';
import { ThemeFrame } from './ThemeFrame.tsx';

const withThemeAndPalette: Decorator = (Story, context) => {
  const { theme, palette } = context.globals as { theme: string; palette: string };
  return (
    <ThemeFrame theme={theme} palette={palette}>
      <Story />
    </ThemeFrame>
  );
};

const preview: Preview = {
  decorators: [withThemeAndPalette],
  globalTypes: {
    theme: {
      description: 'Light or dark',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'auto', title: 'Auto (system)' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    palette: {
      description: 'Color family',
      toolbar: {
        title: 'Palette',
        icon: 'paintbrush',
        items: PALETTES.map((name) => ({
          value: name,
          title: name[0]!.toUpperCase() + name.slice(1),
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', palette: 'bodai' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
};

export default preview;
