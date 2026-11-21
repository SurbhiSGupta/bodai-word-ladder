/**
 * Loads the word list for the chosen length, then shows the game.
 * The length is remembered, so the player comes back to the size they like.
 */

import { useEffect, useState } from 'react';
import { Buddies } from '../components/Buddies.tsx';
import { GameScreen } from './GameScreen.tsx';
import { LENGTHS, loadWords, type WordData, type WordLength } from './wordData.ts';

const LENGTH_KEY = 'bodai-ladder-length';

function savedLength(): WordLength {
  try {
    const value = Number(localStorage.getItem(LENGTH_KEY));
    return (LENGTHS as readonly number[]).includes(value) ? (value as WordLength) : 4;
  } catch {
    return 4;
  }
}

export default function App() {
  const [length, setLength] = useState<WordLength>(savedLength);
  const [data, setData] = useState<WordData | null>(null);

  useEffect(() => {
    let current = true;
    void loadWords(length).then((loaded) => current && setData(loaded));
    try {
      localStorage.setItem(LENGTH_KEY, String(length));
    } catch {
      // Not remembered in private browsing; that's fine.
    }
    return () => {
      current = false;
    };
  }, [length]);

  if (!data || data.length !== length) {
    return (
      <main className="grid h-dvh place-items-center" aria-busy="true">
        <div className="flex flex-col items-center gap-2">
          <Buddies face="curious" height={120} />
          <p className="text-small text-muted">Fetching words…</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <GameScreen key={length} data={data} onLength={(next) => setLength(next as WordLength)} />
    </main>
  );
}
