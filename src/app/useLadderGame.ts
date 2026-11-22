/**
 * Everything one game needs: the puzzle, the ladder, the word being typed, and the actions
 * the screen calls. It plays either a practice puzzle (saved per word length) or one day's
 * daily puzzle (saved per date, with the result recorded for streaks and stats).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { feel } from '../feedback/feel.ts';
import { nextStep, type NextStep } from '../game/hint.ts';
import type { Puzzle } from '../game/ladder.ts';
import {
  RESULT_MESSAGES,
  isOutOfBones,
  currentWord,
  isSolved,
  newLadder,
  noteHint,
  redo as redoLadder,
  restart as restartLadder,
  tryWord,
  undo as undoLadder,
  type Ladder,
} from '../game/session.ts';
import type { ToastProps } from '../components/Toast.tsx';
import { dateKey } from '../game/daily.ts';
import { recordDaily } from './dailyStore.ts';
import { bonesLimit, getSettings, useSettings } from './settings.ts';
import { practicePuzzle, type WordData } from './wordData.ts';

/** How a game ended, or null while it's still going. */
export type Outcome = 'solved' | 'out-of-bones' | 'time-up' | 'out-of-moves';

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
    return ok
      ? {
          ...saved,
          ladder: {
            ...saved.ladder,
            undone: saved.ladder.undone ?? [],
            hints: saved.ladder.hints ?? 0,
          },
        }
      : null;
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
  const puzzle =
    source.kind === 'daily'
      ? source.puzzle
      : practicePuzzle(data, { allowDoubledEnds: getSettings().doubledEnds });
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

  const settings = useSettings();
  const bones = bonesLimit(settings);
  const dictionary = settings.familyFriendly ? data.dictionary : data.grownUpDictionary;
  const { puzzle, ladder } = game;

  // Ninja pace: a countdown, or a cap of par + 2 steps.
  const clock = settings.pace === 'ninja' && settings.ninja === 'timer';
  const moveCap =
    settings.pace === 'ninja' && settings.ninja === 'moves' ? puzzle.par + 2 : undefined;
  const [secondsLeft, setSecondsLeft] = useState<number>(settings.ninjaSeconds);

  const solved = isSolved(ladder);
  const outcome: Outcome | null = solved
    ? 'solved'
    : isOutOfBones(ladder, bones)
      ? 'out-of-bones'
      : clock && secondsLeft <= 0
        ? 'time-up'
        : moveCap !== undefined && ladder.rungs.length >= moveCap
          ? 'out-of-moves'
          : null;
  const over = outcome !== null;
  const bonesLeft = bones === undefined ? undefined : Math.max(bones - ladder.bonesUsed, 0);

  // The clock starts fresh each time the game screen opens, and on a new puzzle or retry.
  useEffect(() => {
    if (!clock || over) return;
    const tick = setInterval(() => setSecondsLeft((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(tick);
  }, [clock, over]);

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

  const backspace = useCallback(() => setDraft((d) => d.slice(0, -1)), [setDraft]);

  const submit = useCallback(() => {
    if (over) return;
    const word = draftRef.current;
    const { ladder: next, result } = tryWord(ladder, word.padEnd(length, ' '), dictionary);
    setLadder(next);
    const spoken = word.toUpperCase();

    if (result === 'added') {
      feel('rung-added');
      setDraft('');
      setAnnouncement(`${spoken} added. ${next.rungs.length} so far, par is ${puzzle.par}.`);
    } else if (result === 'solved') {
      feel('rung-added');
      feel(next.rungs.length < puzzle.par ? 'under-par' : 'solved');
      setDraft('');
      setAnnouncement(`${spoken}. Solved in ${next.rungs.length} steps.`);
    } else if (result === 'not-a-word') {
      feel('not-a-word');
      setShakes((n) => n + 1);
      setDraft('');
      say(RESULT_MESSAGES['not-a-word'], 'problem');
      setAnnouncement(
        `${spoken} isn't in our word list. ` +
          (bones === undefined
            ? `${next.bonesUsed} bones used.`
            : `${Math.max(bones - next.bonesUsed, 0)} of ${bones} bones left.`),
      );
    } else {
      if (result === 'blocked') feel('keep-it-friendly');
      say(RESULT_MESSAGES[result], result === 'blocked' ? 'gentle' : 'info');
      setAnnouncement(RESULT_MESSAGES[result]);
    }
  }, [over, ladder, length, dictionary, bones, puzzle.par, say, setDraft]);

  // Hints count once per rung, however many times the player opens them.
  const hintedFor = useRef<string | null>(null);
  const hint = useCallback((): NextStep | null => {
    if (over) return null;
    const from = currentWord(ladder);
    const step = nextStep(from, puzzle.end, data.index);
    if (step && hintedFor.current !== from) {
      hintedFor.current = from;
      setLadder(noteHint(ladder));
      feel('hint');
    }
    return step;
  }, [over, ladder, puzzle.end, data.index]);

  /** Puts a word in the rung being typed, ready for Enter. */
  const fillIn = useCallback((word: string) => setDraft(word), [setDraft]);

  /** Whether a word would be accepted, refused kindly, or isn't in the list. */
  const wordStatus = useCallback(
    (word: string): 'ok' | 'blocked' | 'not-a-word' =>
      dictionary.isBlocked(word) ? 'blocked' : dictionary.accepts(word) ? 'ok' : 'not-a-word',
    [dictionary],
  );

  const type = useCallback(
    (letter: string) => {
      if (over) return;
      setDraft((d) => (d.length < length ? d + letter : d));
      // Auto-enter: the last letter sends the word, no Enter needed.
      if (settings.autoEnter && draftRef.current.length === length) submit();
    },
    [over, length, setDraft, settings.autoEnter, submit],
  );

  const undo = useCallback(() => {
    if (over || ladder.rungs.length === 0) return;
    feel('undo');
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
    setSecondsLeft(getSettings().ninjaSeconds);
    setDraft('');
    setAnnouncement('New puzzle.');
  }, [data, setDraft, setSecondsLeft]);

  const tryAgain = useCallback(() => {
    setLadder(restartLadder(ladder));
    setSecondsLeft(getSettings().ninjaSeconds);
    setDraft('');
    setAnnouncement('Same puzzle, a fresh start.');
  }, [ladder, setDraft, setSecondsLeft]);

  return {
    puzzle,
    ladder,
    draft,
    message,
    announcement,
    shakes,
    solved,
    outcome,
    over,
    bones,
    bonesLeft,
    secondsLeft: clock && !over ? secondsLeft : undefined,
    movesLeft:
      moveCap === undefined || over ? undefined : Math.max(moveCap - ladder.rungs.length, 0),
    showPar: settings.showPar,
    focus: settings.focus,
    showBones: settings.showBones,
    hintStyle: settings.hintStyle,
    hint,
    fillIn,
    say,
    wordStatus,
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
