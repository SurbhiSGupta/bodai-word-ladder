/**
 * Everything one practice game needs: the puzzle, the ladder, the word being typed,
 * and the actions the screen calls. Progress is saved in the browser per word length,
 * so a refresh (or coming back tomorrow) picks up where the player left off.
 */

import { useCallback, useEffect, useState } from 'react';
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
import { practicePuzzle, type WordData } from './wordData.ts';

export const BONES = 10;

type Saved = { puzzle: Puzzle; ladder: Ladder };
type Message = { text: string; tone: ToastProps['tone']; id: number };

const storageKey = (length: number) => `bodai-ladder-practice-${length}`;

function load(length: number): Saved | null {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(length)) ?? 'null') as Saved | null;
    const ok =
      saved?.puzzle?.start?.length === length &&
      Array.isArray(saved.ladder?.rungs) &&
      Array.isArray(saved.puzzle.bestPath);
    return ok ? { ...saved, ladder: { ...saved.ladder, undone: saved.ladder.undone ?? [] } } : null;
  } catch {
    return null;
  }
}

function save(length: number, game: Saved) {
  try {
    localStorage.setItem(storageKey(length), JSON.stringify(game));
  } catch {
    // Private browsing or storage full: the game still plays, it just isn't remembered.
  }
}

function fresh(data: WordData): Saved {
  const puzzle = practicePuzzle(data);
  return { puzzle, ladder: newLadder(puzzle.start, puzzle.end) };
}

export function useLadderGame(data: WordData) {
  const length = data.length;
  const [game, setGame] = useState<Saved>(() => load(length) ?? fresh(data));
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  /** Read aloud to screen readers: what just happened, in a sentence. */
  const [announcement, setAnnouncement] = useState('');
  const [shakes, setShakes] = useState(0);

  const { puzzle, ladder } = game;
  const solved = isSolved(ladder);
  const outOfBones = !solved && isOutOfBones(ladder, BONES);
  const over = solved || outOfBones;
  const bonesLeft = Math.max(BONES - ladder.bonesUsed, 0);

  useEffect(() => save(length, game), [length, game]);

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
    [over, length],
  );

  const backspace = useCallback(() => setDraft((d) => d.slice(0, -1)), []);

  const submit = useCallback(() => {
    if (over) return;
    const word = draft;
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
  }, [over, draft, ladder, length, data.dictionary, puzzle.par, say]);

  const undo = useCallback(() => {
    if (over || ladder.rungs.length === 0) return;
    playTone('undo');
    setLadder(undoLadder(ladder));
    setDraft('');
    setAnnouncement(`Took back ${ladder.rungs.at(-1)!.toUpperCase()}.`);
  }, [over, ladder]);

  const redo = useCallback(() => {
    if (over || ladder.undone.length === 0) return;
    setLadder(redoLadder(ladder));
    setDraft('');
    setAnnouncement(`Put back ${ladder.undone.at(-1)!.toUpperCase()}.`);
  }, [over, ladder]);

  const newPuzzle = useCallback(() => {
    setGame(fresh(data));
    setDraft('');
    setAnnouncement('New puzzle.');
  }, [data]);

  const tryAgain = useCallback(() => {
    setLadder(restartLadder(ladder));
    setDraft('');
    setAnnouncement('Same puzzle, every bone back.');
  }, [ladder]);

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
