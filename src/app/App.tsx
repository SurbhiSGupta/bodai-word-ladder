/**
 * Which screen is showing, and the data each one needs: the word lists for the length
 * being played, today's date and daily puzzle, and the player's daily results.
 */

import { useEffect, useState } from 'react';
import { Buddies } from '../components/Buddies.tsx';
import { OutfitContext } from '../components/outfits.ts';
import { dateKey } from '../game/daily.ts';
import type { Puzzle } from '../game/ladder.ts';
import { CalendarScreen } from './CalendarScreen.tsx';
import { GameScreen } from './GameScreen.tsx';
import { HomeScreen } from './HomeScreen.tsx';
import { HelpScreen } from './HelpScreen.tsx';
import { SettingsScreen } from './SettingsScreen.tsx';
import { Tour } from './Tour.tsx';
import { StatsScreen } from './StatsScreen.tsx';
import { useSettings } from './settings.ts';
import { isInProgress, loadChallenges, loadDailies, loadResults } from './dailyStore.ts';
import type { GameSource } from './useLadderGame.ts';
import { LENGTHS, loadWords, type WordData, type WordLength } from './wordData.ts';

type Screen =
  | { name: 'home' }
  | { name: 'game'; source: GameSource }
  | { name: 'calendar' }
  | { name: 'stats' }
  | { name: 'settings' }
  | { name: 'help' };

const LENGTH_KEY = 'bodai-ladder-length';
const TOUR_KEY = 'bodai-ladder-tour-seen';

function tourSeen(): boolean {
  try {
    return localStorage.getItem(TOUR_KEY) === 'yes';
  } catch {
    return false;
  }
}
const DAILY_LENGTH: WordLength = 4;

function savedLength(): WordLength {
  try {
    const value = Number(localStorage.getItem(LENGTH_KEY));
    return (LENGTHS as readonly number[]).includes(value) ? (value as WordLength) : 4;
  } catch {
    return 4;
  }
}

function Loading() {
  return (
    <div className="grid h-dvh place-items-center" aria-busy="true">
      <div className="flex flex-col items-center gap-2">
        <Buddies face="curious" height={120} />
        <p className="text-small text-muted">Fetching words…</p>
      </div>
    </div>
  );
}

function Screens() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [practiceLength, setPracticeLength] = useState<WordLength>(savedLength);
  const [words, setWords] = useState<Partial<Record<WordLength, WordData>>>({});
  const [dailies, setDailies] = useState<Record<string, Puzzle> | null>(null);
  const [challenges, setChallenges] = useState<Record<string, Puzzle> | null>(null);
  // Re-read when coming back to a screen, so a just-finished daily shows up.
  const [results, setResults] = useState(() => loadResults());
  const [challengeResults, setChallengeResults] = useState(() => loadResults('challenge'));
  // Checked again on every screen change, so leaving the game open past midnight still works.
  const [today, setToday] = useState(() => dateKey(new Date()));

  const neededLength: WordLength =
    screen.name !== 'game'
      ? DAILY_LENGTH
      : screen.source.kind === 'practice'
        ? practiceLength
        : (screen.source.puzzle.start.length as WordLength);

  const settings = useSettings();
  const [tourOpen, setTourOpen] = useState(false);
  const [showTourBanner, setShowTourBanner] = useState(() => !tourSeen());

  function markTourSeen() {
    setShowTourBanner(false);
    try {
      localStorage.setItem(TOUR_KEY, 'yes');
    } catch {
      // Private browsing: the banner may come back next time, which is fine.
    }
  }

  // Theme and palette live on <html>, where the color tokens look for them.
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'auto') delete root.dataset.theme;
    else root.dataset.theme = settings.theme;
    root.dataset.palette = settings.palette;
    if (settings.animations) delete root.dataset.motion;
    else root.dataset.motion = 'off';
  }, [settings.theme, settings.palette, settings.animations]);

  useEffect(() => {
    void loadDailies().then(setDailies);
    void loadChallenges().then(setChallenges);
  }, []);

  useEffect(() => {
    if (words[neededLength]) return;
    let current = true;
    void loadWords(neededLength).then((data) => {
      if (current) setWords((w) => ({ ...w, [neededLength]: data }));
    });
    return () => {
      current = false;
    };
  }, [neededLength, words]);

  useEffect(() => {
    try {
      localStorage.setItem(LENGTH_KEY, String(practiceLength));
    } catch {
      // Not remembered in private browsing; that's fine.
    }
  }, [practiceLength]);

  function go(next: Screen) {
    setToday(dateKey(new Date()));
    setResults(loadResults());
    setChallengeResults(loadResults('challenge'));
    setScreen(next);
    window.scrollTo(0, 0);
  }

  const home = () => go({ name: 'home' });
  const playDaily = (date: string) => {
    const puzzle = dailies?.[date];
    if (puzzle) go({ name: 'game', source: { kind: 'daily', date, puzzle } });
  };
  const playChallenge = () => {
    const puzzle = challenges?.[today];
    if (puzzle) go({ name: 'game', source: { kind: 'challenge', date: today, puzzle } });
  };
  // Offered once today's daily is solved, unless the challenge has already been played.
  const todayChallenge = challenges?.[today];
  const offerChallenge =
    todayChallenge && !challengeResults[today] && !isInProgress(today, 'challenge')
      ? { puzzle: todayChallenge, onAccept: playChallenge }
      : undefined;

  if (screen.name === 'game') {
    const data = words[neededLength];
    if (!data) return <Loading />;
    const key =
      screen.source.kind === 'practice'
        ? `practice-${practiceLength}`
        : `${screen.source.kind}-${screen.source.date}`;
    return (
      <main>
        <GameScreen
          key={key}
          data={data}
          source={screen.source}
          onHome={home}
          challenge={
            screen.source.kind === 'daily' && screen.source.date === today
              ? offerChallenge
              : undefined
          }
        />
      </main>
    );
  }

  return (
    <main>
      {screen.name === 'home' && (
        <HomeScreen
          today={today}
          todayPuzzle={dailies?.[today]}
          results={results}
          todayInProgress={isInProgress(today)}
          practiceLength={practiceLength}
          onPracticeLength={setPracticeLength}
          onPlayToday={() => playDaily(today)}
          challenge={todayChallenge}
          challengeResult={challengeResults[today]}
          challengeInProgress={isInProgress(today, 'challenge')}
          onPlayChallenge={playChallenge}
          onPractice={() => go({ name: 'game', source: { kind: 'practice' } })}
          onCalendar={() => go({ name: 'calendar' })}
          onStats={() => go({ name: 'stats' })}
          onSettings={() => go({ name: 'settings' })}
          onHelp={() => go({ name: 'help' })}
          onTour={() => {
            markTourSeen();
            setTourOpen(true);
          }}
          showTourBanner={showTourBanner}
          onDismissTour={markTourSeen}
          showPar={settings.showPar}
        />
      )}
      {screen.name === 'calendar' && dailies && (
        <CalendarScreen
          today={today}
          firstDay={Object.keys(dailies)[0] ?? today}
          results={results}
          onPlay={playDaily}
          onBack={home}
        />
      )}
      {screen.name === 'stats' && <StatsScreen today={today} results={results} onBack={home} />}
      {screen.name === 'settings' && <SettingsScreen onBack={home} />}
      {screen.name === 'help' && <HelpScreen onBack={home} onTour={() => setTourOpen(true)} />}
      <Tour open={tourOpen} onClose={() => setTourOpen(false)} />
    </main>
  );
}

/** Dresses her and Frisky everywhere, from the outfits picked in Settings. */
export default function App() {
  const { herOutfit, friskyOutfit } = useSettings();
  return (
    <OutfitContext.Provider value={{ her: herOutfit, frisky: friskyOutfit }}>
      <Screens />
    </OutfitContext.Provider>
  );
}
