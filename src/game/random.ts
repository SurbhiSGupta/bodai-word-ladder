/**
 * Seeded randomness, so the same seed always gives the same puzzle.
 * The daily puzzle uses the date as its seed, which makes it the same for everyone.
 */

export type Random = () => number;

/** A small, fast seeded generator (mulberry32). Returns numbers in [0, 1). */
export function seededRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turns any text (like "2026-11-21") into a numeric seed. */
export function seedFromText(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Picks one item at random. Returns undefined for an empty list. */
export function pickOne<T>(items: readonly T[], random: Random): T | undefined {
  return items[Math.floor(random() * items.length)];
}
