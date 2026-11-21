import type { ButtonHTMLAttributes } from 'react';

export type KeyProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** A letter, or a word like ENTER for the wide keys. */
  label: string;
  /** Read aloud instead of the label, e.g. "Delete" for ⌫. */
  spokenLabel?: string;
  wide?: boolean;
};

/** One key on the on-screen keyboard. */
export function Key({ label, spokenLabel, wide = false, className = '', ...rest }: KeyProps) {
  return (
    <button
      type="button"
      aria-label={spokenLabel ?? label}
      className={[
        'inline-flex h-14 items-center justify-center rounded-sm bg-tile font-bold text-tile-ink uppercase',
        'transition active:scale-95 hover:brightness-95',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        'disabled:opacity-40',
        wide ? 'w-14 shrink-0 px-1 text-xs' : 'min-w-0 flex-1 text-lg',
        className,
      ].join(' ')}
      {...rest}
    >
      {label}
    </button>
  );
}
