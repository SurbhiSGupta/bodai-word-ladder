/**
 * Support pack codes, the same as Bodai Sudoku's, so one code unlocks the extras in both
 * games. 12 letters: 16 bits for the last day it works (days after 1 Jan 2026, 0 = forever),
 * 12 bits of serial number, then a 32-bit HMAC signature. Codes are made with Boduku's
 * play-store/tools/make-codes.mjs; the secret lives in the page, as it does there.
 */

const CODE_SECRET = 'v-Z8YUMP8py_KfIJfRS9yoW8';
export const CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const CODE_EPOCH = Date.UTC(2026, 0, 1);

export async function codeSignature(days: number, serial: number): Promise<number> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(CODE_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const payload = new Uint8Array([days >> 8, days & 255, serial >> 8, serial & 255]);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, payload));
  return ((sig[0]! << 24) | (sig[1]! << 16) | (sig[2]! << 8) | sig[3]!) >>> 0;
}

/**
 * The code's last day (YYYY-MM-DD, or null for forever), or null if it isn't a real code.
 * Forgiving about dashes, spaces, case, and O/0 or I/L/1 mix-ups.
 */
export async function readCode(
  text: string,
): Promise<{ until: string | null; serial: number } | null> {
  const clean = text
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1');
  if (clean.length !== 12 || !globalThis.crypto?.subtle) return null;
  let bits = 0n;
  for (const ch of clean) {
    const value = CODE_ALPHABET.indexOf(ch);
    if (value < 0) return null;
    bits = bits * 32n + BigInt(value);
  }
  const days = Number(bits >> 44n);
  const serial = Number((bits >> 32n) & 0xfffn);
  if (Number(bits & 0xffffffffn) !== (await codeSignature(days, serial))) return null;
  const until = days ? new Date(CODE_EPOCH + days * 864e5).toISOString().slice(0, 10) : null;
  return { until, serial };
}
