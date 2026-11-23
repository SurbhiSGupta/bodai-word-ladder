/**
 * Outfits for her and Frisky: their names and the context that dresses them app-wide.
 * The drawings live in Buddies.tsx.
 */

import { createContext } from 'react';

/** The Support pack outfits, the same as Bodai Sudoku's, so both games dress them alike. */
export type HerOutfit = 'none' | 'party' | 'crown' | 'beret' | 'shades' | 'scarf' | 'cape';
export type FriskyOutfit = 'none' | 'bandana' | 'bow';

/** What they're wearing everywhere in the app. Set once at the top; props still win. */
export const OutfitContext = createContext<{ her: HerOutfit; frisky: FriskyOutfit }>({
  her: 'none',
  frisky: 'none',
});

/** Every outfit with its name, in Boduku's order. */
export const HER_OUTFIT_NAMES: Record<HerOutfit, string> = {
  none: 'None',
  party: 'Party hat',
  crown: 'Crown',
  beret: 'Beret',
  shades: 'Sunglasses',
  scarf: 'Scarf',
  cape: 'Cape',
};
export const FRISKY_OUTFIT_NAMES: Record<FriskyOutfit, string> = {
  none: 'Collar',
  bandana: 'Bandana',
  bow: 'Bow tie',
};
