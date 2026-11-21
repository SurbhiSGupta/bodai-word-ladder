import type { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary is the green Play button from Boduku; quiet sits on a surface. */
  variant?: 'primary' | 'accent' | 'quiet';
  size?: 'md' | 'lg';
};

const VARIANT_STYLES = {
  primary: 'bg-match text-match-ink hover:brightness-95',
  accent: 'bg-accent text-accent-ink hover:brightness-95',
  quiet: 'bg-surface text-ink border border-edge hover:bg-highlight-faint',
};

const SIZE_STYLES = {
  md: 'h-10 px-4 text-sm rounded-md',
  lg: 'h-14 px-6 text-lg rounded-md',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 font-bold transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      ].join(' ')}
      {...rest}
    />
  );
}
