import { Segmented } from './Segmented.tsx';

export type LengthPickerProps = {
  value: number;
  lengths: readonly number[];
  onChange: (length: number) => void;
};

/** 3, 4 or 5-letter words. */
export function LengthPicker({ value, lengths, onChange }: LengthPickerProps) {
  return (
    <Segmented
      label="Word length"
      value={value}
      options={lengths.map((length) => ({
        value: length,
        label: String(length),
        spokenLabel: `${length}-letter words`,
      }))}
      onChange={onChange}
    />
  );
}
