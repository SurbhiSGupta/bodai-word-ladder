import { Buddies } from './Buddies.tsx';
import { Button } from './Button.tsx';
import { WordChip } from './WordChip.tsx';

export type EndCardProps = {
  outcome: 'solved' | 'out-of-bones' | 'time-up' | 'out-of-moves';
  /** Every word the player climbed, start to end. */
  yourPath: string[];
  bestPath: string[];
  par: number;
  /** Hints used along the way, mentioned kindly if any. */
  hints?: number;
  onWord: (word: string) => void;
  onNext: () => void;
  /** Label for the main button. */
  nextLabel?: string;
  /** Same puzzle, every bone back. Left out for the daily, which counts once. */
  onTryAgain?: () => void;
  /** Shares how it went, without the words. Left out where there's nothing to share. */
  onShare?: () => void;
};

/**
 * What the player sees when a ladder ends: their path next to the best one, every word
 * tappable for its meaning. Kind either way: out of bones is a shrug, not a scolding.
 */
export function EndCard({
  outcome,
  yourPath,
  bestPath,
  par,
  hints = 0,
  onWord,
  onNext,
  nextLabel,
  onTryAgain,
  onShare,
}: EndCardProps) {
  const steps = yourPath.length - 1;
  const solved = outcome === 'solved';
  const underPar = solved && steps < par;
  const best = new Set(bestPath);

  const headline = !solved
    ? outcome === 'time-up'
      ? "Time's up!"
      : outcome === 'out-of-moves'
        ? 'Out of moves'
        : "Frisky's out of bones"
    : underPar
      ? `Under par! ${steps} steps`
      : steps === par
        ? `On par: ${steps} steps`
        : `Solved in ${steps} steps`;

  return (
    <section
      aria-label={headline}
      className="flex w-full flex-col items-center gap-3 rounded-lg bg-surface p-4 text-center shadow-card"
    >
      <Buddies face={!solved ? 'sad' : underPar ? 'kiss' : 'joy'} height={96} />
      <h2 className="text-heading">{headline}</h2>

      {solved && (
        <div className="flex w-full flex-col items-center gap-1.5">
          <span className="text-label text-muted">Your ladder</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {yourPath.map((word, i) => (
              <WordChip key={`${word}-${i}`} word={word} onClick={onWord} />
            ))}
          </div>
        </div>
      )}

      <div className="flex w-full flex-col items-center gap-1.5">
        <span className="text-label text-muted">
          {solved ? `Best path · par ${par}` : `One way up · par ${par}`}
        </span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {bestPath.map((word, i) => (
            <WordChip
              key={`${word}-${i}`}
              word={word}
              onClick={onWord}
              emphasis={solved && yourPath.includes(word) && best.has(word)}
            />
          ))}
        </div>
      </div>

      <p className="text-small text-muted">
        {hints > 0 ? `With ${hints} ${hints === 1 ? 'hint' : 'hints'}. ` : ''}Tap any word to see
        what it means.
      </p>

      <div className="flex w-full gap-2">
        {onShare && (
          <Button variant="quiet" className="flex-1" onClick={onShare}>
            Share
          </Button>
        )}
        {!solved && onTryAgain && (
          <Button variant="quiet" className="flex-1" onClick={onTryAgain}>
            Try again
          </Button>
        )}
        <Button className="flex-1" onClick={onNext}>
          {nextLabel ?? (solved ? 'Next puzzle' : 'New puzzle')}
        </Button>
      </div>
    </section>
  );
}
