/**
 * Which screen is showing, and the data each one needs: the word lists for the length
 * being played, today's date and daily puzzle, and the player's daily results.
 */

import { useEffect, useState } from 'react';
import { Buddies } from '../components/Buddies.tsx';
import { dateKey } from '../game/daily.ts';
import type { Puzzle } from '../game/ladder.ts';
import { CalendarScreen } from './CalendarScreen.tsx';
import { GameScreen } from './GameScreen.tsx';
import { HomeScreen } from './HomeScreen.tsx';
import { SettingsScreen } from './SettingsScreen.tsx';
import { StatsScreen } from './StatsScreen.tsx';
import { useSettings } from './settings.ts';
import { isInProgress, loadDailies, loadResults } from './dailyStore.ts';
import type { GameSource } from './useLadderGame.ts';
import { LENGTHS, loadWords, type WordData, type WordLength } from './wordData.ts';

type Screen =
  | { name: 'home' }
  | { name: 'game'; source: GameSource }
  | { name: 'calendar' }
  | { name: 'stats' }
  | { name: 'settings' };

const LENGTH_KEY = 'bodai-ladder-length';
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

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [practiceLength, setPracticeLength] = useState<WordLength>(savedLength);
  const [words, setWords] = useState<Partial<Record<WordLength, WordData>>>({});
  const [dailies, setDailies] = useState<Record<string, Puzzle> | null>(null);
  // Re-read when coming back to a screen, so a just-finished daily shows up.
  const [results, setResults] = useState(loadResults);
  // Checked again on every screen change, so leaving the game open past midnight still works.
  const [today, setToday] = useState(() => dateKey(new Date()));

  const neededLength: WordLength =
    screen.name === 'game' && screen.source.kind === 'practice' ? practiceLength : DAILY_LENGTH;

  const settings = useSettings();

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
    setScreen(next);
    window.scrollTo(0, 0);
  }

  const home = () => go({ name: 'home' });
  const playDaily = (date: string) => {
    const puzzle = dailies?.[date];
    if (puzzle) go({ name: 'game', source: { kind: 'daily', date, puzzle } });
  };

  if (screen.name === 'game') {
    const data = words[neededLength];
    if (!data) return <Loading />;
    const key = screen.source.kind === 'daily' ? screen.source.date : `practice-${practiceLength}`;
    return (
      <main>
        <GameScreen key={key} data={data} source={screen.source} onHome={home} />
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
          onPractice={() => go({ name: 'game', source: { kind: 'practice' } })}
          onCalendar={() => go({ name: 'calendar' })}
          onStats={() => go({ name: 'stats' })}
          onSettings={() => go({ name: 'settings' })}
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
    </main>
  );
}
