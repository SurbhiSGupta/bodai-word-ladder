import { Segmented } from './Segmented.tsx';

export type ThemeChoice = 'auto' | 'light' | 'dark';

const OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

/** Auto, Light or Dark, like Boduku's Settings. */
export function ThemeSwitch({
  value,
  onChange,
}: {
  value: ThemeChoice;
  onChange: (choice: ThemeChoice) => void;
}) {
  return <Segmented label="Theme" value={value} options={OPTIONS} onChange={onChange} />;
}
