import { describe, expect, it } from 'vitest';
import { DEFAULTS, PRESETS, activePreset, bonesLimit } from './settings.ts';

describe('presets', () => {
  it('the defaults are Classic', () => {
    expect(activePreset(DEFAULTS)).toBe('classic');
  });

  it('applying a preset makes it the active one', () => {
    for (const name of Object.keys(PRESETS) as (keyof typeof PRESETS)[]) {
      expect(activePreset({ ...DEFAULTS, ...PRESETS[name].settings })).toBe(name);
    }
  });

  it('a custom mix matches no preset', () => {
    expect(activePreset({ ...DEFAULTS, bones: 5 })).toBeNull();
  });
});

describe('bonesLimit', () => {
  it('turns unlimited into no limit', () => {
    expect(bonesLimit({ ...DEFAULTS, bones: 'unlimited' })).toBeUndefined();
    expect(bonesLimit({ ...DEFAULTS, bones: 5 })).toBe(5);
  });
});
