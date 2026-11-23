/**
 * Settings, grouped like Boduku's: a one-tap preset first, then the game rules, then how
 * it looks, then sound and feel. Every change saves straight away.
 */

import { useState, type ReactNode } from 'react';
import { OutfitPicker } from '../components/OutfitPicker.tsx';
import { PalettePicker } from '../components/PalettePicker.tsx';
import { Segmented } from '../components/Segmented.tsx';
import { ThemeSwitch } from '../components/ThemeSwitch.tsx';
import { Toggle } from '../components/Toggle.tsx';
import { feel } from '../feedback/feel.ts';
import { ScreenHeader } from './ScreenHeader.tsx';
import {
  PRESETS,
  activePreset,
  updateSettings,
  useSettings,
  type PresetName,
  type Settings,
} from './settings.ts';

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="text-label text-muted">{title}</h2>
      <div className="flex flex-col divide-y divide-edge rounded-lg bg-surface px-4 py-1 shadow-card">
        {children}
      </div>
    </section>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
      <span className="flex min-w-0 flex-col">
        <span className="text-body-strong">{label}</span>
        {description && <span className="text-small text-muted">{description}</span>}
      </span>
      {children}
    </div>
  );
}

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const settings = useSettings();
  const preset = activePreset(settings);
  const set = (patch: Partial<Settings>) => updateSettings(patch);
  const [customizing, setCustomizing] = useState(false);
  // The detailed rules stay folded unless opened, or when the settings are a custom mix.
  const showRules = customizing || !preset;

  const picks = (
    <>
      <div role="radiogroup" aria-label="Quick picks" className="grid grid-cols-3 gap-2">
        {(Object.entries(PRESETS) as [PresetName, (typeof PRESETS)[PresetName]][]).map(
          ([name, p]) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={preset === name}
              onClick={() => set(p.settings)}
              className={[
                'flex flex-col items-start gap-1 rounded-md p-3 text-left',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
                preset === name ? 'bg-ink text-bg' : 'bg-surface text-ink shadow-card',
              ].join(' ')}
            >
              <span className="text-body-strong">{p.label}</span>
              <span
                className={['text-small', preset === name ? 'opacity-80' : 'text-muted'].join(' ')}
              >
                {p.description}
              </span>
            </button>
          ),
        )}
      </div>
      {/* Always takes the same space, so switching a rule never makes the page jump. */}
      <p className="text-small text-muted" aria-live="polite">
        {preset ? `Playing ${PRESETS[preset].label}.` : 'Your own mix.'}
      </p>
    </>
  );

  const rules = (
    <>
      <Row label="Bones" description="One is eaten for each word that isn't in our list.">
        <Segmented
          label="Bones"
          value={settings.bones}
          options={[
            { value: 10, label: '10' },
            { value: 5, label: '5' },
            { value: 'unlimited', label: 'Unlimited' },
          ]}
          onChange={(bones) => set({ bones })}
        />
      </Row>
      <Row
        label="Pace"
        description={
          settings.pace === 'zen'
            ? 'No clock. Take your time.'
            : 'Beat the clock, or the move limit.'
        }
      >
        <Segmented
          label="Pace"
          value={settings.pace}
          options={[
            { value: 'zen', label: 'Zen' },
            { value: 'ninja', label: 'Ninja' },
          ]}
          onChange={(pace) => set({ pace })}
        />
      </Row>
      {settings.pace === 'ninja' && (
        <>
          <Row
            label="Ninja challenge"
            description={
              settings.ninja === 'timer'
                ? 'Solve before the clock runs out.'
                : 'Solve within par + 2 steps.'
            }
          >
            <Segmented
              label="Ninja challenge"
              value={settings.ninja}
              options={[
                { value: 'timer', label: 'Clock' },
                { value: 'moves', label: 'Moves' },
              ]}
              onChange={(ninja) => set({ ninja })}
            />
          </Row>
          {settings.ninja === 'timer' && (
            <Row label="Clock">
              <Segmented
                label="Clock"
                value={settings.ninjaSeconds}
                options={[
                  { value: 60, label: '1 min' },
                  { value: 120, label: '2 min' },
                  { value: 180, label: '3 min' },
                ]}
                onChange={(ninjaSeconds) => set({ ninjaSeconds })}
              />
            </Row>
          )}
        </>
      )}
      <Toggle
        label="Show par"
        description="How many steps the shortest ladder takes."
        checked={settings.showPar}
        onChange={(showPar) => set({ showPar })}
      />
      <Toggle
        label="Show bones"
        description="Off keeps them counting quietly, out of sight."
        checked={settings.showBones}
        onChange={(showBones) => set({ showBones })}
      />
    </>
  );

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-4 pt-3 pb-10">
      <ScreenHeader title="Settings" onBack={onBack} />

      <>
        <section className="flex flex-col gap-1">
          <h2 className="text-label text-muted">Challenge</h2>
          {picks}
          {preset && (
            <button
              type="button"
              aria-expanded={showRules}
              onClick={() => setCustomizing((c) => !c)}
              className="self-start rounded-pill px-1 py-1 text-small font-semibold text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ink"
            >
              {showRules ? 'Hide details' : 'Customize'}
            </button>
          )}
          {showRules && (
            <div className="flex flex-col divide-y divide-edge rounded-lg bg-surface px-4 py-1 shadow-card">
              {rules}
            </div>
          )}
        </section>
        <Group title="Words">
          <Toggle
            label="Family-friendly"
            description="Grown-up words are refused kindly and never used."
            checked={settings.familyFriendly}
            onChange={(familyFriendly) => set({ familyFriendly })}
          />
          <Toggle
            label="Doubled letters at the ends allowed"
            description="Practice puzzles may start or end on words like BOOK."
            checked={settings.doubledEnds}
            onChange={(doubledEnds) => set({ doubledEnds })}
          />
          <Row
            label="Hints"
            description={
              settings.hintStyle === 'letter'
                ? 'Shows which letter to change.'
                : 'A crossword-style clue for your next word.'
            }
          >
            <Segmented
              label="Hint style"
              value={settings.hintStyle}
              options={[
                { value: 'letter', label: 'Letter' },
                { value: 'clue', label: 'Clue' },
              ]}
              onChange={(hintStyle) => set({ hintStyle })}
            />
          </Row>
        </Group>
      </>

      <Group title="Look">
        <Row label="Theme">
          <ThemeSwitch value={settings.theme} onChange={(theme) => set({ theme })} />
        </Row>
        <div className="flex flex-col gap-2 py-3">
          <span className="text-body-strong">Colors</span>
          <PalettePicker value={settings.palette} onChange={(palette) => set({ palette })} />
        </div>
        <div className="flex flex-col gap-2 py-3">
          <span className="text-body-strong">Outfits</span>
          <OutfitPicker
            her={settings.herOutfit}
            frisky={settings.friskyOutfit}
            onHer={(herOutfit) => set({ herOutfit })}
            onFrisky={(friskyOutfit) => set({ friskyOutfit })}
          />
          <p className="rounded-md bg-highlight-faint px-3 py-2 text-small">
            Outfits are free for everyone. If they made you smile, you can 💛 Support Bodai.
          </p>
        </div>
      </Group>

      <Group title="Sound and feel">
        <Toggle
          label="Sound"
          checked={settings.sound}
          onChange={(sound) => {
            set({ sound });
            if (sound) feel('sound-on');
          }}
        />
        <Toggle
          label="Vibration"
          description="On Android phones. iPhones don't allow it on websites."
          checked={settings.vibration}
          onChange={(vibration) => set({ vibration })}
        />
        <Toggle
          label="Focus mode"
          description="While playing, hides everything but the ladder, bones and keyboard."
          checked={settings.focus}
          onChange={(focus) => set({ focus })}
        />
        <Toggle
          label="Animations"
          description="Off stops shakes and slides. Colors and sounds stay."
          checked={settings.animations}
          onChange={(animations) => set({ animations })}
        />
        <Toggle
          label="Auto-enter"
          description="The word goes in as soon as its last letter is typed."
          checked={settings.autoEnter}
          onChange={(autoEnter) => set({ autoEnter })}
        />
      </Group>
    </div>
  );
}
