/**
 * Plays the sounds described in tokens/tokens.json (feedback events), the same way Bodai
 * Sudoku does: soft synthesized tones, and real recordings for the big moments. The
 * recordings live in public/sounds (credits in CREDITS.md there) and are fetched the first
 * time a sound plays, so the game still opens fast.
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

/**
 * Each recording's file and loudness, copied from Boduku: the files are left as they were
 * downloaded, gain evens out their volume, and to trims silence at the end.
 */
const SAMPLES: Record<string, { file: string; gain: number; to?: number }> = {
  'laugh-girl': { file: 'laugh-girl.mp3', gain: 8.9 },
  'laugh-boy': { file: 'laugh-boy.mp3', gain: 2.0, to: 4.6 },
  'laugh-child': { file: 'laugh-child.mp3', gain: 1.13 },
  'frisky-bark': { file: 'frisky-bark.mp3', gain: 0.29 },
  // Real laughs from Surbhi's family videos, two seconds each.
  ...Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [
      `family-${i + 1}`,
      { file: `family-${i + 1}.m4a`, gain: 0.9 },
    ]),
  ),
};
const SAMPLE_VOLUME = 0.55;
/** Gap between two recordings in one moment, like the bark before a laugh. */
const BETWEEN = 0.5;

const LAUGHS = [
  ...Array.from({ length: 12 }, (_, i) => `family-${i + 1}`),
  'laugh-girl',
  'laugh-boy',
  'laugh-child',
];
let laughBag: string[] = [];

/** The next laugh, shuffled so the same one doesn't come back too soon. */
function nextLaugh(): string {
  if (!laughBag.length) {
    laughBag = [...LAUGHS];
    for (let i = laughBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [laughBag[i], laughBag[j]] = [laughBag[j]!, laughBag[i]!];
    }
  }
  return laughBag.pop()!;
}

const buffers = new Map<string, Promise<AudioBuffer>>();

function load(ctx: AudioContext, name: string): Promise<AudioBuffer> {
  let loading = buffers.get(name);
  if (!loading) {
    loading = fetch(`${import.meta.env.BASE_URL}sounds/${SAMPLES[name]!.file}`)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data));
    buffers.set(name, loading);
  }
  return loading;
}

function playSample(ctx: AudioContext, name: string, delay: number, volume: number) {
  const sample = SAMPLES[name];
  if (!sample) return;
  load(ctx, name)
    .then((buffer) => {
      const source = ctx.createBufferSource();
      const level = ctx.createGain();
      source.buffer = buffer;
      level.gain.value = sample.gain * SAMPLE_VOLUME * volume;
      source.connect(level).connect(ctx.destination);
      source.start(ctx.currentTime + delay, 0, sample.to);
    })
    .catch(() => {
      // Offline before the file was ever fetched: the moment just stays quiet.
    });
}

/** Plays an event's sound. Returns false when the event has none or audio isn't available. */
export function playTone(event: FeedbackEvent): boolean {
  const sound = FEEDBACK[event].sound;
  if (!sound) return false;
  const ctx = context();
  if (!ctx) return false;

  // The first sound of a game fetches every recording, so the win laugh is ready in time.
  if (buffers.size === 0)
    for (const name of Object.keys(SAMPLES)) void load(ctx, name).catch(() => {});

  if ('samples' in sound) {
    const volume = 'volume' in sound ? sound.volume : 1;
    sound.samples.forEach((name: string, i: number) =>
      playSample(ctx, name === 'laugh' ? nextLaugh() : name, i * BETWEEN, volume),
    );
    return true;
  }

  const { tone, length, volume } = sound;
  const wave: OscillatorType = 'wave' in sound ? (sound.wave as OscillatorType) : 'sine';
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
