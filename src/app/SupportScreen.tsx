/**
 * Support Bodai, like Boduku's: try on her outfits, Frisky's look and the colors, then
 * unlock them with the one-time pack. Until then they show here only; the game stays free.
 */

import { useState, type FormEvent } from 'react';
import { Buddies } from '../components/Buddies.tsx';
import { Button } from '../components/Button.tsx';
import { OutfitPicker } from '../components/OutfitPicker.tsx';
import { PalettePicker } from '../components/PalettePicker.tsx';
import { Rung } from '../components/Rung.tsx';
import { dateKey } from '../game/daily.ts';
import { readCode } from '../game/supportCode.ts';
import { ScreenHeader } from './ScreenHeader.tsx';
import { updateSettings, useSettings } from './settings.ts';
import { unlockPack, useSupporter } from './supporter.ts';

function longDay(key: string) {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SupportScreen({ onBack }: { onBack: () => void }) {
  const settings = useSettings();
  const supporter = useSupporter();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  async function redeem(event: FormEvent) {
    event.preventDefault();
    const found = await readCode(code);
    if (!found) {
      setMessage('That code doesn’t look right. Check the letters and try again.');
      return;
    }
    if (found.until && found.until < dateKey(new Date())) {
      setMessage(`That code ended on ${longDay(found.until)}.`);
      return;
    }
    if (supporter && (!supporter.until || (found.until && found.until <= supporter.until))) {
      setMessage('You already have the pack. Thank you!');
      return;
    }
    setCode('');
    unlockPack('code', found.until);
    setMessage('Code accepted. Enjoy the extras!');
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-4 pt-3 pb-6">
      <ScreenHeader title="Support Bodai" onBack={onBack} />
      <p className="text-body text-muted">
        {supporter
          ? 'Pick her outfit, Frisky’s look and your colors. They show up all over the game.'
          : 'Bodai Word Ladder is free, with no ads. If you enjoy it, the one-time pack says thanks and unlocks a few fun extras. Try them on here.'}
      </p>

      <div className="flex flex-col items-center gap-3 rounded-lg bg-surface pt-8 pb-4 shadow-card">
        <Buddies
          face="happy"
          height={170}
          outfit={settings.herOutfit}
          friskyOutfit={settings.friskyOutfit}
        />
        <Rung word="cold" role="end" size="md" />
      </div>

      <section aria-labelledby="looks-h" className="flex flex-col gap-2">
        <h2 id="looks-h" className="text-label text-muted">
          Her outfit and Frisky’s look
        </h2>
        <OutfitPicker
          her={settings.herOutfit}
          frisky={settings.friskyOutfit}
          onHer={(herOutfit) => updateSettings({ herOutfit })}
          onFrisky={(friskyOutfit) => updateSettings({ friskyOutfit })}
        />
      </section>

      <section aria-labelledby="colors-h" className="flex flex-col gap-2">
        <h2 id="colors-h" className="text-label text-muted">
          Colors
        </h2>
        <PalettePicker
          value={settings.palette}
          onChange={(palette) => updateSettings({ palette })}
        />
      </section>

      <div className="flex flex-col gap-2 rounded-lg bg-highlight-faint p-4">
        {supporter ? (
          <>
            <p className="text-body">
              💛 Thank you! Bodai is made by one person, and your support keeps it free and ad-free
              for everyone. — Surbhi
            </p>
            {supporter.until && (
              <p className="text-small text-muted">
                Your code works until {longDay(supporter.until)}.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-body-strong">The pack is coming to the Android app.</p>
            <p className="text-small text-muted">
              Pay once. No subscription, no ads, and every puzzle stays free. Got a code from Bodai?
              It works here too.
            </p>
          </>
        )}
      </div>

      <form onSubmit={(e) => void redeem(e)} className="flex flex-col gap-2">
        <label htmlFor="code" className="text-label text-muted">
          Have a code?
        </label>
        <div className="flex gap-2">
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="XXXX-XXXX-XXXX"
            className="min-w-0 flex-1 rounded-md border border-edge bg-surface px-3 text-body tracking-widest uppercase"
          />
          <Button type="submit">Use code</Button>
        </div>
        <p className="min-h-5 text-small" aria-live="polite">
          {message}
        </p>
      </form>
    </div>
  );
}
