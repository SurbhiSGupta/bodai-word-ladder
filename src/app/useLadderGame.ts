/**
 * Everything one game needs: the puzzle, the ladder, the word being typed, and the actions
 * the screen calls. It plays either a practice puzzle (saved per word length) or one day's
 * daily puzzle (saved per date, with the result recorded for streaks and stats).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { playTone } from '../feedback/tones.ts';
import type { Puzzle } from '../game/ladder.ts';
import {
  RESULT_MESSAGES,
  isOutOfBones,
  isSolved,
  newLadder,
  redo as redoLadder,
  restart as restartLadder,
  tryWord,
  undo as undoLadder,
  type Ladder,
} from '../game/session.ts';
import type { ToastProps } from '../components/Toast.tsx';
import { dateKey } from '../game/daily.ts';
import { recordDaily } from './dailyStore.ts';
import { practicePuzzle, type WordData } from './wordData.ts';

export const BONES = 10;

type Saved = { puzzle: Puzzle; ladder: Ladder };
type Message = { text: string; tone: ToastProps['tone']; id: number };

/** What to play: a practice puzzle, or a given day's daily. */
export type GameSource = { kind: 'practice' } | { kind: 'daily'; date: string; puzzle: Puzzle };

const storageKey = (length: number, source: GameSource) =>
  source.kind === 'daily' ? `bodai-ladder-daily-${source.date}` : `bodai-ladder-practice-${length}`;

function load(length: number, source: GameSource): Saved | null {
  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey(length, source)) ?? 'null',
    ) as Saved | null;
    const ok =
      saved?.puzzle?.start?.length === length &&
      Array.isArray(saved.ladder?.rungs) &&
      Array.isArray(saved.puzzle.bestPath);
    return ok ? { ...saved, ladder: { ...saved.ladder, undone: saved.ladder.undone ?? [] } } : null;
  } catch {
    return null;
  }
}

function save(length: number, source: GameSource, game: Saved) {
  try {
    localStorage.setItem(storageKey(length, source), JSON.stringify(game));
  } catch {
    // Private browsing or storage full: the game still plays, it just isn't remembered.
  }
}

function fresh(data: WordData, source: GameSource): Saved {
  const puzzle = source.kind === 'daily' ? source.puzzle : practicePuzzle(data);
  return { puzzle, ladder: newLadder(puzzle.start, puzzle.end) };
}

export function useLadderGame(data: WordData, source: GameSource = { kind: 'practice' }) {
  const length = data.length;
  const [game, setGame] = useState<Saved>(() => load(length, source) ?? fresh(data, source));
  const [draft, setDraftState] = useState('');
  // The latest letters, so Enter pressed in the same instant as the last letter still sees it.
  const draftRef = useRef('');
  const setDraft = useCallback((next: string | ((d: string) => string)) => {
    draftRef.current = typeof next === 'function' ? next(draftRef.current) : next;
    setDraftState(draftRef.current);
  }, []);
  const [message, setMessage] = useState<Message | null>(null);
  /** Read aloud to screen readers: what just happened, in a sentence. */
  const [announcement, setAnnouncement] = useState('');
  const [shakes, setShakes] = useState(0);

  const { puzzle, ladder } = game;
  const solved = isSolved(ladder);
  const outOfBones = !solved && isOutOfBones(ladder, BONES);
  const over = solved || outOfBones;
  const bonesLeft = Math.max(BONES - ladder.bonesUsed, 0);

  useEffect(() => save(length, source, game), [length, source, game]);

  // A finished daily counts toward streaks and stats.
  const dailyDate = source.kind === 'daily' ? source.date : null;
  useEffect(() => {
    if (!dailyDate || !over) return;
    recordDaily(dailyDate, {
      solved,
      steps: ladder.rungs.length,
      par: puzzle.par,
      bonesUsed: ladder.bonesUsed,
      late: dailyDate !== dateKey(new Date()),
    });
  }, [dailyDate, over, solved, ladder, puzzle.par]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2200);
    return () => clearTimeout(timer);
  }, [message]);

  const say = useCallback((text: string, tone: ToastProps['tone']) => {
    setMessage({ text, tone, id: Date.now() });
  }, []);

  const setLadder = (next: Ladder) => setGame((g) => ({ ...g, ladder: next }));

  const type = useCallback(
    (letter: string) => {
      if (over) return;
      setDraft((d) => (d.length < length ? d + letter : d));
    },
    [over, length, setDraft],
  );

  const backspace = useCallback(() => setDraft((d) => d.slice(0, -1)), [setDraft]);

  const submit = useCallback(() => {
    if (over) return;
    const word = draftRef.current;
    const { ladder: next, result } = tryWord(ladder, word.padEnd(length, ' '), data.dictionary);
    setLadder(next);
    const spoken = word.toUpperCase();

    if (result === 'added') {
      playTone('rung-added');
      setDraft('');
      setAnnouncement(`${spoken} added. ${next.rungs.length} so far, par is ${puzzle.par}.`);
    } else if (result === 'solved') {
      playTone('rung-added');
      setDraft('');
      setAnnouncement(`${spoken}. Solved in ${next.rungs.length} steps.`);
    } else if (result === 'not-a-word') {
      playTone('not-a-word');
      setShakes((n) => n + 1);
      setDraft('');
      const left = Math.max(BONES - next.bonesUsed, 0);
      say(RESULT_MESSAGES['not-a-word'], 'problem');
      setAnnouncement(`${spoken} isn't in our word list. ${left} of ${BONES} bones left.`);
    } else {
      say(RESULT_MESSAGES[result], result === 'blocked' ? 'gentle' : 'info');
      setAnnouncement(RESULT_MESSAGES[result]);
    }
  }, [over, ladder, length, data.dictionary, puzzle.par, say, setDraft]);

  const undo = useCallback(() => {
    if (over || ladder.rungs.length === 0) return;
    playTone('undo');
    setLadder(undoLadder(ladder));
    setDraft('');
    setAnnouncement(`Took back ${ladder.rungs.at(-1)!.toUpperCase()}.`);
  }, [over, ladder, setDraft]);

  const redo = useCallback(() => {
    if (over || ladder.undone.length === 0) return;
    setLadder(redoLadder(ladder));
    setDraft('');
    setAnnouncement(`Put back ${ladder.undone.at(-1)!.toUpperCase()}.`);
  }, [over, ladder, setDraft]);

  const newPuzzle = useCallback(() => {
    setGame(fresh(data, { kind: 'practice' }));
    setDraft('');
    setAnnouncement('New puzzle.');
  }, [data, setDraft]);

  const tryAgain = useCallback(() => {
    setLadder(restartLadder(ladder));
    setDraft('');
    setAnnouncement('Same puzzle, every bone back.');
  }, [ladder, setDraft]);

  return {
    puzzle,
    ladder,
    draft,
    message,
    announcement,
    shakes,
    solved,
    outOfBones,
    over,
    bonesLeft,
    canUndo: !over && ladder.rungs.length > 0,
    canRedo: !over && ladder.undone.length > 0,
    type,
    backspace,
    submit,
    undo,
    redo,
    newPuzzle,
    tryAgain,
  };
}
