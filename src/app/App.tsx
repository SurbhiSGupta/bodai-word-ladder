/**
 * Phase 2 prototype, to try on a phone. Each rung is typed as a whole word (her pick over
 * tapping a single letter). Start word pinned at the top, end word at the bottom, rungs
 * scroll in between, and the next empty slot is highlighted.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BoneCounter } from '../components/BoneCounter.tsx';
import { Buddies } from '../components/Buddies.tsx';
import { Button } from '../components/Button.tsx';
import { Keyboard } from '../components/Keyboard.tsx';
import { Rung } from '../components/Rung.tsx';
import { Toast, type ToastProps } from '../components/Toast.tsx';
import { Wordmark } from '../components/Wordmark.tsx';
import blocked from '../data/blocked.json';
import words4 from '../data/words-4.json';
import { playTone } from '../feedback/tones.ts';
import { makeDictionary } from '../game/dictionary.ts';
import { buildNeighborIndex, randomPuzzle, shortestPath, type Puzzle } from '../game/ladder.ts';
import { seededRandom } from '../game/random.ts';
import {
  RESULT_MESSAGES,
  isSolved,
  newLadder,
  tryWord,
  undo,
  type Ladder,
} from '../game/session.ts';

const BONES = 10;
const dictionary = makeDictionary(words4, blocked);
const commonIndex = buildNeighborIndex(words4.common);

function firstPuzzle(): Puzzle {
  const bestPath = shortestPath('fire', 'cold', commonIndex);
  if (bestPath) return { start: 'fire', end: 'cold', par: bestPath.length - 1, bestPath };
  return nextPuzzle();
}

function nextPuzzle(): Puzzle {
  const puzzle = randomPuzzle(seededRandom(Date.now()), {
    endpoints: words4.endpoints,
    index: commonIndex,
    minPar: 3,
    maxPar: 5,
  });
  if (!puzzle) throw new Error('No puzzle found');
  return puzzle;
}

const blank = (length: number) => ' '.repeat(length);

export default function App() {
  const [showNear, setShowNear] = useState(true);
  const [puzzle, setPuzzle] = useState(firstPuzzle);
  const [ladder, setLadder] = useState<Ladder>(() => newLadder(puzzle.start, puzzle.end));
  const [draft, setDraft] = useState(() => blank(puzzle.start.length));
  const [toast, setToast] = useState<(ToastProps & { id: number }) | null>(null);
  const [shake, setShake] = useState(0);
  const scroller = useRef<HTMLOListElement>(null);

  const solved = isSolved(ladder);
  const length = puzzle.start.length;

  const clearDraft = useCallback(() => setDraft(blank(length)), [length]);

  const say = useCallback((message: string, tone: ToastProps['tone']) => {
    setToast({ message, tone, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [ladder.rungs.length]);

  const submit = useCallback(() => {
    const { ladder: next, result } = tryWord(ladder, draft, dictionary);
    setLadder(next);
    if (result === 'added' || result === 'solved') {
      playTone('rung-added');
      clearDraft();
      if (result === 'solved') say(RESULT_MESSAGES.solved, 'info');
      return;
    }
    if (result === 'not-a-word') {
      playTone('not-a-word');
      setShake((n) => n + 1);
      say(RESULT_MESSAGES['not-a-word'], 'problem');
      clearDraft();
      return;
    }
    say(RESULT_MESSAGES[result], result === 'blocked' ? 'gentle' : 'info');
  }, [ladder, draft, clearDraft, say]);

  const press = useCallback(
    (key: string) => {
      if (solved) return;
      if (key === 'enter') return submit();
      if (key === 'backspace') {
        const filled = draft.trimEnd();
        setDraft((filled.slice(0, -1) + blank(length)).slice(0, length));
        return;
      }
      const filled = draft.trimEnd();
      if (filled.length < length) setDraft((filled + key + blank(length)).slice(0, length));
    },
    [solved, submit, draft, length],
  );

  // Physical keyboard: letters, Enter, Backspace.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'Enter') press('enter');
      else if (event.key === 'Backspace') press('backspace');
      else if (/^[a-zA-Z]$/.test(event.key)) press(event.key.toLowerCase());
      else return;
      event.preventDefault();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [press]);

  function newGame() {
    const next = nextPuzzle();
    setPuzzle(next);
    setLadder(newLadder(next.start, next.end));
    setDraft(blank(next.start.length));
  }

  function stepBack() {
    setLadder(undo(ladder));
    clearDraft();
  }

  const typed = draft.trimEnd().length;
  const draftReady = typed === length;
  const steps = useMemo(() => ladder.rungs.filter((w) => w !== puzzle.end), [ladder, puzzle]);

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col gap-3 px-4 pt-3 pb-4">
      <header className="flex items-center justify-between gap-3">
        <Wordmark size="heading">Word Ladder</Wordmark>
        <BoneCounter used={ladder.bonesUsed} total={BONES} size="sm" />
      </header>

      <div className="flex flex-wrap items-center gap-2 text-small">
        <span className="text-label text-muted">Prototype</span>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={showNear}
            onChange={(e) => setShowNear(e.target.checked)}
            className="size-4 accent-ink"
          />
          Yellow
        </label>
      </div>

      <section aria-label="Ladder" className="flex min-h-0 flex-1 flex-col items-center gap-1">
        <Rung word={puzzle.start} role="start" size="md" />
        <ol
          ref={scroller}
          className="flex min-h-0 w-full flex-1 flex-col items-center gap-1 overflow-y-auto py-1"
        >
          {steps.map((word, i) => (
            <li key={`${word}-${i}`}>
              <Rung word={word} endWord={puzzle.end} showNear={showNear} size="md" />
            </li>
          ))}
          {!solved && (
            <li key={`current-${shake}`}>
              <Rung
                word={draft}
                endWord={puzzle.end}
                showNear={showNear}
                role="current"
                size="md"
                selectedIndex={typed < length ? typed : undefined}
                invalid={shake > 0}
              />
            </li>
          )}
          {solved && (
            <li className="flex flex-col items-center gap-2 py-2 text-center">
              <Buddies face="joy" height={110} />
              <p className="text-body-strong">
                Solved in {ladder.rungs.length} {ladder.rungs.length === 1 ? 'step' : 'steps'}
                {ladder.rungs.length <= puzzle.par ? ' · on par!' : ` · best is ${puzzle.par}`}
              </p>
              <p className="text-small text-muted">
                Best path: {puzzle.bestPath.map((w) => w.toUpperCase()).join(' → ')}
              </p>
            </li>
          )}
        </ol>
        <Rung word={puzzle.end} role="end" size="md" />
        <p className="text-small text-muted">Par {puzzle.par}</p>
      </section>

      <div aria-live="polite" className="flex h-9 justify-center">
        {toast && <Toast key={toast.id} message={toast.message} tone={toast.tone} />}
      </div>

      <div className="flex gap-2">
        <Button variant="quiet" onClick={stepBack} disabled={ladder.rungs.length === 0}>
          Undo
        </Button>
        <Button variant="quiet" onClick={newGame}>
          New puzzle
        </Button>
      </div>

      {!solved ? (
        <Keyboard onKey={press} canSubmit={draftReady} />
      ) : (
        <Button size="lg" onClick={newGame}>
          Next puzzle
        </Button>
      )}
    </div>
  );
}
