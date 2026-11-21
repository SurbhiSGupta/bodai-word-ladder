// A placeholder home screen so every preview link shows something real.
// The game itself starts in Phase 3.

const SAMPLE_LADDER = ['FIRE', 'FORE', 'CORE', 'CORD', 'COLD'];

export default function App() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight">
        <span className="bg-accent px-1 text-accent-ink">Bodai Word Ladder</span>
      </h1>

      <ol aria-label="Example ladder from FIRE to COLD" className="flex flex-col gap-2">
        {SAMPLE_LADDER.map((word) => (
          <li
            key={word}
            className="rounded-xl border border-edge bg-surface px-6 py-2 text-center text-2xl font-bold tracking-[0.3em]"
          >
            {word}
          </li>
        ))}
      </ol>

      <p className="text-muted">Coming soon. One letter at a time.</p>
    </main>
  );
}
