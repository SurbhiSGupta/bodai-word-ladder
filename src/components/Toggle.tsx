import { useId } from 'react';

export type ToggleProps = {
  label: string;
  /** A short line under the label explaining what it does. */
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** An on/off switch with its label and an optional explanation. The whole row is tappable. */
export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 py-2">
      <span className="flex min-w-0 flex-col">
        <span className="text-body-strong">{label}</span>
        {description && <span className="text-small text-muted">{description}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={[
            'h-7 w-12 rounded-pill transition-colors',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink',
            checked ? 'bg-match' : 'bg-tile',
          ].join(' ')}
        />
        <span
          aria-hidden="true"
          className={[
            'absolute top-1 left-1 size-5 rounded-pill bg-surface shadow-card transition-transform',
            checked ? 'translate-x-5' : '',
          ].join(' ')}
        />
      </span>
    </label>
  );
}
