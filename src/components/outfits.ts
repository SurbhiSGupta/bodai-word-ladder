/**
 * Outfits for her and Frisky: their names and the context that dresses them app-wide.
 * The drawings live in Buddies.tsx.
 */

import { createContext } from 'react';

export type HerOutfit = 'none' | 'beanie' | 'sun-hat' | 'scarf' | 'bow';
export type FriskyOutfit = 'none' | 'bandana' | 'bow-tie' | 'party-hat';

/** What they're wearing everywhere in the app. Set once at the top; props still win. */
export const OutfitContext = createContext<{ her: HerOutfit; frisky: FriskyOutfit }>({
  her: 'none',
  frisky: 'none',
});

/** Every outfit with its name, in the order Settings shows them. */
export const HER_OUTFIT_NAMES: Record<HerOutfit, string> = {
  none: 'As she is',
  beanie: 'Beanie',
  'sun-hat': 'Sun hat',
  scarf: 'Scarf',
  bow: 'Hair bow',
};
export const FRISKY_OUTFIT_NAMES: Record<FriskyOutfit, string> = {
  none: 'Just his collar',
  bandana: 'Bandana',
  'bow-tie': 'Bow tie',
  'party-hat': 'Party hat',
};
