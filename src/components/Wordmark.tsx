import type { ReactNode } from 'react';

/**
 * The game's name with Boduku's highlighter: one quick, slightly tilted pass of a marker
 * in the palette's accent. On dark backgrounds the mark fades so the ink shows through.
 */

export type WordmarkProps = {
  /** The words to highlight. */
  children?: ReactNode;
  size?: 'display' | 'title' | 'heading';
};

const SIZE = { display: 'text-display', title: 'text-title', heading: 'text-heading' };

export function Wordmark({ children = 'Bodai Word Ladder', size = 'display' }: WordmarkProps) {
  return (
    <span className={['relative isolate inline-block px-[0.12em]', SIZE[size]].join(' ')}>
      <svg
        viewBox="0 0 300 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -inset-x-[0.28em] -top-[0.02em] -bottom-[0.1em] -z-10 h-[calc(100%+0.12em)] w-[calc(100%+0.56em)] -rotate-2 dark:opacity-50"
      >
        <path
          fill="var(--accent)"
          d="M10 12L14 8L22 10C80 6 170 9 240 6C262 5 280 7 288 9L292 15L289 22L295 30L290 38L294 46L286 52C230 54 150 51 80 54C50 55 30 54 16 53L9 47L13 40L7 32L12 25L6 18Z"
        />
        <path
          fill="color-mix(in oklab, var(--accent) 82%, black)"
          fillOpacity="0.6"
          d="M232 8C255 6 275 7 287 10L291 16L288 23L293 31L289 39L292 46L285 51C268 52 250 52 234 53L238 30Z"
        />
        <path
          stroke="color-mix(in oklab, var(--accent) 55%, white)"
          strokeOpacity="0.7"
          strokeWidth="2.5"
          fill="none"
          d="M20 21C100 18 190 20 280 18M18 41C110 39 200 42 285 40"
        />
      </svg>
      <span className="text-accent-ink dark:text-ink">{children}</span>
    </span>
  );
}
