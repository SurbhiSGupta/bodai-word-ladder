/**
 * Plays the soft synthesized tones described in tokens/tokens.json (feedback events),
 * the same way Bodai Sudoku does: a sine note that fades in fast and out gently.
 * Recorded samples (laughs, Frisky's bark) come later with the game screens.
 */

import { FEEDBACK, type FeedbackEvent } from '../styles/feedback.ts';

let audio: AudioContext | null = null;

function context(): AudioContext | null {
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') void audio.resume();
    return audio;
  } catch {
    return null;
  }
}

/** Plays an event's tone. Returns false when the event has no tone or audio isn't available. */
export function playTone(event: FeedbackEvent): boolean {
  const sound = FEEDBACK[event].sound;
  if (!sound || !('tone' in sound)) return false;
  const ctx = context();
  if (!ctx) return false;

  const { tone, length, volume } = sound;
  const wave = 'wave' in sound ? sound.wave : 'sine';
  tone.forEach((frequency, i) => {
    const at = ctx.currentTime + i * length * 0.9;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(volume, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
    osc.connect(gain).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + length + 0.05);
  });
  return true;
}
