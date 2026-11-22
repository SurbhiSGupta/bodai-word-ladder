/**
 * One game, daily or practice: start word pinned at the top, end word at the bottom, rungs scrolling
 * in between, and the keyboard in the thumb zone. Words are typed whole and colored only
 * after Enter. All the rules live in useLadderGame and src/game; this file is layout.
 */

import { useEffect, useRef, useState } from 'react';
import { BoneCounter } from '../components/BoneCounter.tsx';
import { Button } from '../components/Button.tsx';
import { EndCard } from '../components/EndCard.tsx';
import { Keyboard } from '../components/Keyboard.tsx';
import { Rung } from '../components/Rung.tsx';
import { Sheet } from '../components/Sheet.tsx';
import { Toast } from '../components/Toast.tsx';
import { maskClue, ordinal, type NextStep } from '../game/hint.ts';
import { getSettings } from './settings.ts';
import { useLadderGame, type GameSource } from './useLadderGame.ts';
import { loadMeanings, type Meaning, type WordData } from './wordData.ts';

type Props = { data: WordData; source: GameSource; onHome: () => void };

function shortDate(key: string) {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function GameScreen({ data, source, onHome }: Props) {
  const game = useLadderGame(data, source);
  const daily = source.kind === 'daily';
  const { puzzle, ladder, draft, over } = game;
  const length = data.length;
  const scroller = useRef<HTMLOListElement>(null);
  const [meaningOf, setMeaningOf] = useState<string | null>(null);
  const [meanings, setMeanings] = useState<Record<string, Meaning[]> | null>(null);
  /** Opened from 🔍: also say whether the word is in our list. */
  const [lookingUp, setLookingUp] = useState(false);
  const [hintStep, setHintStep] = useState<NextStep | null>(null);
  const [hintRevealed, setHintRevealed] = useState(false);

  // Keep the newest rung in view.
  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: getSettings().animations ? 'smooth' : 'auto',
    });
  }, [ladder.rungs.length, over]);

  // Meanings load the first time a word or a clue needs one.
  const needMeanings = meaningOf !== null || (hintStep !== null && game.hintStyle === 'clue');
  useEffect(() => {
    if (needMeanings && !meanings) void loadMeanings(length).then(setMeanings);
  }, [needMeanings, meanings, length]);

  function openHint() {
    const step = game.hint();
    if (!step) {
      game.say('No way up from here. Try Undo.', 'info');
      return;
    }
    setHintRevealed(false);
    setHintStep(step);
  }

  function lookUp() {
    if (draft.length < length) {
      game.say('Type a whole word to look it up', 'info');
      return;
    }
    setLookingUp(true);
    setMeaningOf(draft);
  }

  const sheetOpen = meaningOf !== null || hintStep !== null;

  // Physical keyboard. Shortcuts follow Guidelines/Interaction in Storybook.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (sheetOpen) return; // the sheet handles its own keys (Escape closes it)
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === 'z') {
        if (event.shiftKey) game.redo();
        else game.undo();
      } else if (mod || event.altKey) {
        return;
      } else if (event.key === 'Enter') game.submit();
      else if (event.key === 'Backspace') game.backspace();
      else if (event.key === '?') openHint();
      else if (/^[a-zA-Z]$/.test(event.key)) game.type(event.key.toLowerCase());
      else return;
      event.preventDefault();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const steps = ladder.rungs.filter((w) => w !== puzzle.end);
  const typed = draft.padEnd(length, ' ');

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col gap-3 px-4 pt-3 pb-4">
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={onHome}
            aria-label="Back to home"
            className="grid size-11 shrink-0 place-items-center rounded-pill text-title leading-none hover:bg-tile focus-visible:outline-2 focus-visible:outline-ink"
          >
            ‹
          </button>
          <h1 className={['truncate text-heading', game.focus ? 'sr-only' : ''].join(' ')}>
            {daily ? `Daily · ${shortDate(source.date)}` : `Practice · ${length} letters`}
          </h1>
        </div>
      </header>

      <div className="flex items-center justify-between gap-2 px-1">
        <span className="flex items-center gap-3 text-small text-muted tabular-nums">
          {game.showPar && <span>Par {puzzle.par}</span>}
          {game.secondsLeft !== undefined && (
            <span
              aria-label={`${game.secondsLeft} seconds left`}
              className={[
                'font-semibold',
                game.secondsLeft <= 15 ? 'text-bad-ink' : 'text-ink',
              ].join(' ')}
            >
              ⏱ {Math.floor(game.secondsLeft / 60)}:{String(game.secondsLeft % 60).padStart(2, '0')}
            </span>
          )}
          {game.movesLeft !== undefined && (
            <span className="font-semibold text-ink">
              {game.movesLeft} {game.movesLeft === 1 ? 'move' : 'moves'} left
            </span>
          )}
        </span>
        {game.showBones && <BoneCounter used={ladder.bonesUsed} total={game.bones} size="sm" />}
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
                outcome={game.outcome ?? 'solved'}
                yourPath={[puzzle.start, ...ladder.rungs]}
                bestPath={puzzle.bestPath}
                par={puzzle.par}
                hints={ladder.hints}
                onWord={setMeaningOf}
                onNext={daily ? onHome : game.newPuzzle}
                nextLabel={daily ? 'Back to home' : undefined}
                onTryAgain={daily ? undefined : game.tryAgain}
              />
            </li>
          )}
        </ol>
        <Rung word={puzzle.end} role="end" size="md" />
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
          <div className={['flex gap-2', game.focus ? 'hidden' : ''].join(' ')}>
            <Button variant="quiet" onClick={game.undo} disabled={!game.canUndo}>
              Undo
            </Button>
            <Button variant="quiet" onClick={game.redo} disabled={!game.canRedo}>
              Redo
            </Button>
            <Button variant="quiet" aria-label="Hint (shortcut: ?)" onClick={openHint}>
              💡
            </Button>
            <Button variant="quiet" aria-label="Look up the word you've typed" onClick={lookUp}>
              🔍
            </Button>
            {!daily && (
              <Button variant="quiet" className="ml-auto" onClick={game.newPuzzle}>
                New
              </Button>
            )}
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
        onClose={() => {
          setMeaningOf(null);
          setLookingUp(false);
        }}
        title={(meaningOf ?? '').toUpperCase()}
      >
        {lookingUp && meaningOf && (
          <p
            className={[
              'text-body-strong',
              game.wordStatus(meaningOf) === 'ok' ? 'text-ink' : 'text-bad-ink',
            ].join(' ')}
          >
            {game.wordStatus(meaningOf) === 'ok'
              ? '✓ In our word list'
              : game.wordStatus(meaningOf) === 'blocked'
                ? "Let's keep it friendly 🐾"
                : 'Not in our word list'}
          </p>
        )}
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

      <Sheet open={hintStep !== null} onClose={() => setHintStep(null)} title="Hint">
        {hintStep && (
          <div className="flex flex-col gap-4">
            {(() => {
              const meaning = meanings?.[hintStep.word]?.[0];
              const clue =
                game.hintStyle === 'clue' && meaning
                  ? maskClue(meaning.text, [hintStep.word, meaning.base ?? ''])
                  : null;
              if (game.hintStyle === 'clue' && !meanings) {
                return <p className="text-body text-muted">Finding a clue…</p>;
              }
              return clue ? (
                <div className="flex flex-col gap-1">
                  <span className="text-label text-muted">Clue for your next word</span>
                  <p className="text-heading">{clue}</p>
                </div>
              ) : (
                <p className="text-heading">Change the {ordinal(hintStep.position)} letter.</p>
              );
            })()}
            <p className="text-small text-muted">
              {hintStep.stepsLeft} {hintStep.stepsLeft === 1 ? 'step' : 'steps'} to go from here.
            </p>
            {hintRevealed ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-title tracking-[0.2em] uppercase">{hintStep.word}</p>
                <Button
                  onClick={() => {
                    game.fillIn(hintStep.word);
                    setHintStep(null);
                  }}
                >
                  Use it
                </Button>
              </div>
            ) : (
              <Button variant="quiet" onClick={() => setHintRevealed(true)}>
                Show me the word
              </Button>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}
