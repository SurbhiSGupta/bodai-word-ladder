import { describe, expect, it } from 'vitest';
import { hasDoubledLetter, isOneLetterApart } from './neighbors';

describe('isOneLetterApart', () => {
  it('accepts a single changed letter', () => {
    expect(isOneLetterApart('cold', 'cord')).toBe(true);
    expect(isOneLetterApart('fire', 'hire')).toBe(true);
  });

  it('rejects the same word', () => {
    expect(isOneLetterApart('cold', 'cold')).toBe(false);
  });

  it('rejects two or more changed letters', () => {
    expect(isOneLetterApart('cold', 'warm')).toBe(false);
    expect(isOneLetterApart('cold', 'card')).toBe(false);
  });

  it('rejects words of different lengths (that is Stretch mode, not classic)', () => {
    expect(isOneLetterApart('cat', 'cart')).toBe(false);
  });
});

describe('hasDoubledLetter', () => {
  it('spots a letter repeated side by side', () => {
    expect(hasDoubledLetter('book')).toBe(true);
    expect(hasDoubledLetter('beef')).toBe(true);
  });

  it('ignores repeated letters that are apart', () => {
    expect(hasDoubledLetter('eye')).toBe(false);
    expect(hasDoubledLetter('cold')).toBe(false);
  });
});
