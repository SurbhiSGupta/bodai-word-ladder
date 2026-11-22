/**
 * What the player hears and feels for a game moment, following their Sound and Vibration
 * settings. Sounds come from the tones in tokens.json; vibration uses the browser's
 * vibrate(), which works on Android phones (iPhones ignore it, as Safari has no vibration).
 */

import { getSettings } from '../app/settings.ts';
import { FEEDBACK, type FeedbackEvent, type Haptic } from '../styles/feedback.ts';
import { playTone } from './tones.ts';

/** Short and soft, matching the tap / error / win haptics in the design system. */
const PATTERNS: Record<Haptic, number | number[]> = {
  tap: 8,
  error: [30, 40, 30],
  win: [20, 40, 60],
};

export function feel(event: FeedbackEvent) {
  const { sound, vibration } = getSettings();
  if (sound) playTone(event);
  const haptic = FEEDBACK[event].haptic;
  if (vibration && haptic && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(PATTERNS[haptic]);
  }
}
