import { describe, expect, it } from 'vitest';
import { CODE_ALPHABET, codeSignature, readCode } from './supportCode.ts';

/** Makes a code the way Boduku's make-codes tool does. */
async function makeCode(days: number, serial: number) {
  let bits =
    (BigInt(days) << 44n) | (BigInt(serial) << 32n) | BigInt(await codeSignature(days, serial));
  let text = '';
  for (let i = 0; i < 12; i++) {
    text = CODE_ALPHABET[Number(bits % 32n)] + text;
    bits /= 32n;
  }
  return `${text.slice(0, 4)}-${text.slice(4, 8)}-${text.slice(8)}`;
}

describe('readCode', () => {
  it('reads a forever code', async () => {
    expect(await readCode(await makeCode(0, 7))).toEqual({ until: null, serial: 7 });
  });

  it('reads the last day a code works', async () => {
    expect((await readCode(await makeCode(31, 1)))?.until).toBe('2026-02-01');
  });

  it('forgives case, spaces and O/0 or I/1 mix-ups', async () => {
    const code = (await makeCode(0, 42)).toLowerCase().replace(/-/g, ' ');
    expect(await readCode(code.replace(/0/g, 'o').replace(/1/g, 'l'))).not.toBeNull();
  });

  it('turns down a made-up code', async () => {
    expect(await readCode('ABCD-EFGH-JKMN')).toBeNull();
    expect(await readCode('too short')).toBeNull();
  });
});
