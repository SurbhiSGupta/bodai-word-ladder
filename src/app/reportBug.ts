/**
 * Report a bug, like Bodai Sudoku: opens an email to Surbhi with room for what happened
 * and a block of details that help her reproduce it.
 */

import { getSettings } from './settings.ts';

const BUG_EMAIL = 'surbhi.s.gupta@gmail.com';

export function reportBug(details: string[] = []) {
  const settings = getSettings();
  const lines = [
    'What happened? What did you expect instead?',
    '',
    '',
    '',
    '--- Details for Bodai (please keep) ---',
    'App: web',
    `Browser: ${navigator.userAgent}`,
    `Screen: ${innerWidth}x${innerHeight}, scale ${devicePixelRatio}`,
    `Theme: ${settings.theme}, colors: ${settings.palette}`,
    ...details,
  ];
  const subject = encodeURIComponent('Bodai Word Ladder bug');
  location.href = `mailto:${BUG_EMAIL}?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`;
}
