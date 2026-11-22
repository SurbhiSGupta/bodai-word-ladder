/**
 * Daily stats: the headline numbers, then how solves landed against par.
 * Only dailies count here; practice is just for fun.
 */

import { Buddies } from '../components/Buddies.tsx';
import { dailyStats, type DailyResults } from '../game/daily.ts';
import { ScreenHeader } from './ScreenHeader.tsx';

type Props = { today: string; results: DailyResults; onBack: () => void };

export function StatsScreen({ today, results, onBack }: Props) {
  const stats = dailyStats(results, today);
  const tiles = [
    { label: 'Played', value: stats.played },
    { label: 'Solved', value: stats.solved },
    { label: 'On par', value: stats.onPar },
    { label: 'Streak', value: stats.current },
    { label: 'Best streak', value: stats.best },
  ];
  const bars = [
    { label: 'Under par', value: stats.vsPar.under, tone: 'bg-match' },
    { label: 'On par', value: stats.vsPar.at, tone: 'bg-match' },
    { label: 'Par + 1', value: stats.vsPar.over1, tone: 'bg-near' },
    { label: 'Par + 2 or more', value: stats.vsPar.over2, tone: 'bg-tile' },
  ];
  const most = Math.max(1, ...bars.map((b) => b.value));

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-4 pt-3 pb-6">
      <ScreenHeader title="Your stats" onBack={onBack} />

      {stats.played === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <Buddies face="curious" height={130} />
          <p className="text-body text-muted">
            Play today's puzzle and your stats will start here.
          </p>
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-2">
            {tiles.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-0.5 rounded-md bg-surface py-3 shadow-card"
              >
                <dd className="text-title tabular-nums">{value}</dd>
                <dt className="text-small text-muted">{label}</dt>
              </div>
            ))}
          </dl>

          <section aria-labelledby="par-h" className="flex flex-col gap-2">
            <h2 id="par-h" className="text-label text-muted">
              Solves against par
            </h2>
            <ul className="flex flex-col gap-2">
              {bars.map(({ label, value, tone }) => (
                <li key={label} className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <span className="text-small">{label}</span>
                  <span className="flex items-center gap-2">
                    <span
                      className={['h-6 rounded-sm', value > 0 ? 'min-w-6' : '', tone].join(' ')}
                      style={{ width: `${(value / most) * 100}%` }}
                    />
                    <span className="text-small text-muted tabular-nums">{value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
