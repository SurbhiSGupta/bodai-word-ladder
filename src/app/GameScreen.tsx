/**
 * The practice game: start word pinned at the top, end word at the bottom, rungs scrolling
 * in between, and the keyboard in the thumb zone. Words are typed whole and colored only
 * after Enter. All the rules live in useLadderGame and src/game; this file is layout.
 */

import { useEffect, useRef, useState } from 'react';
import { BoneCounter } from '../components/BoneCounter.tsx';
import { Button } from '../components/Button.tsx';
import { EndCard } from '../components/EndCard.tsx';
import { Keyboard } from '../components/Keyboard.tsx';
import { LengthPicker } from '../components/LengthPicker.tsx';
import { Rung } from '../components/Rung.tsx';
import { Sheet } from '../components/Sheet.tsx';
import { ThemeSwitch } from '../components/ThemeSwitch.tsx';
import { Toast } from '../components/Toast.tsx';
import { Wordmark } from '../components/Wordmark.tsx';
import { BONES, useLadderGame } from './useLadderGame.ts';
import { LENGTHS, loadMeanings, type Meaning, type WordData } from './wordData.ts';

type Props = { data: WordData; onLength: (length: number) => void };

export function GameScreen({ data, onLength }: Props) {
  const game = useLadderGame(data);
  const { puzzle, ladder, draft, over } = game;
  const length = data.length;
  const scroller = useRef<HTMLOListElement>(null);
  const [meaningOf, setMeaningOf] = useState<string | null>(null);
  const [meanings, setMeanings] = useState<Record<string, Meaning[]> | null>(null);

  // Keep the newest rung in view.
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [ladder.rungs.length, over]);

  // Meanings load the first time a word is tapped.
  useEffect(() => {
    if (meaningOf && !meanings) void loadMeanings(length).then(setMeanings);
  }, [meaningOf, meanings, length]);

  // Physical keyboard. Shortcuts follow Guidelines/Interaction in Storybook.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (meaningOf) return; // the sheet handles its own keys (Escape closes it)
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === 'z') {
        if (event.shiftKey) game.redo();
        else game.undo();
      } else if (mod || event.altKey) {
        return;
      } else if (event.key === 'Enter') game.submit();
      else if (event.key === 'Backspace') game.backspace();
      else if (/^[a-zA-Z]$/.test(event.key)) game.type(event.key.toLowerCase());
      else return;
      event.preventDefault();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [game, meaningOf]);

  const steps = ladder.rungs.filter((w) => w !== puzzle.end);
  const typed = draft.padEnd(length, ' ');

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col gap-3 px-4 pt-3 pb-4">
      <header className="flex items-center justify-between gap-3">
        <h1>
          <Wordmark size="heading">Word Ladder</Wordmark>
        </h1>
        <BoneCounter used={ladder.bonesUsed} total={BONES} size="sm" />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <LengthPicker value={length} lengths={LENGTHS} onChange={onLength} />
        <ThemeSwitch />
      </div>

      <section aria-label="Ladder" className="flex min-h-0 flex-1 flex-col items-center gap-1">
        <Rung word={puzzle.start} role="start" size="md" />
        <ol
          ref={scroller}
          aria-label="Your steps"
          className="flex min-h-0 w-full flex-1 flex-col items-center gap-1 overflow-y-auto py-1"
        >
          {steps.map((word, i) => (
            <li key={`${word}-${i}`}>
              <Rung word={word} endWord={puzzle.end} size="md" />
            </li>
          ))}
          {!over && (
            <li key={`current-${game.shakes}`}>
              {/* No colors while typing: letters are only judged after Enter. */}
              <Rung
                word={typed}
                role="current"
                size="md"
                selectedIndex={draft.length < length ? draft.length : undefined}
                invalid={game.shakes > 0}
              />
            </li>
          )}
          {over && (
            <li className="w-full pt-2">
              <EndCard
                outcome={game.solved ? 'solved' : 'out-of-bones'}
                yourPath={[puzzle.start, ...ladder.rungs]}
                bestPath={puzzle.bestPath}
                par={puzzle.par}
                onWord={setMeaningOf}
                onNext={game.newPuzzle}
                onTryAgain={game.tryAgain}
              />
            </li>
          )}
        </ol>
        <Rung word={puzzle.end} role="end" size="md" />
        <p className="text-small text-muted">Par {puzzle.par}</p>
      </section>

      <div className="flex h-9 justify-center">
        {game.message && (
          <Toast key={game.message.id} message={game.message.text} tone={game.message.tone} />
        )}
      </div>
      {/* Screen readers hear every move as a sentence. */}
      <p className="sr-only" aria-live="polite">
        {game.announcement}
      </p>

      {!over && (
        <>
          <div className="flex gap-2">
            <Button variant="quiet" onClick={game.undo} disabled={!game.canUndo}>
              Undo
            </Button>
            <Button variant="quiet" onClick={game.redo} disabled={!game.canRedo}>
              Redo
            </Button>
            <Button variant="quiet" className="ml-auto" onClick={game.newPuzzle}>
              New puzzle
            </Button>
          </div>
          <Keyboard
            onKey={(key) =>
              key === 'enter'
                ? game.submit()
                : key === 'backspace'
                  ? game.backspace()
                  : game.type(key)
            }
            canSubmit={draft.length === length}
          />
        </>
      )}

      <Sheet
        open={meaningOf !== null}
        onClose={() => setMeaningOf(null)}
        title={(meaningOf ?? '').toUpperCase()}
      >
        {!meanings ? (
          <p className="text-body text-muted">Looking it up…</p>
        ) : (meanings[meaningOf ?? ''] ?? []).length === 0 ? (
          <p className="text-body text-muted">We don't have a meaning for this one yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {meanings[meaningOf ?? '']!.map((m, i) => (
              <li key={i} className="flex flex-col gap-0.5">
                <span className="text-label text-muted">
                  {m.pos}
                  {m.base ? ` · from ${m.base.toUpperCase()}` : ''}
                </span>
                <span className="text-body">{m.text}</span>
              </li>
            ))}
          </ul>
        )}
      </Sheet>
    </div>
  );
}
