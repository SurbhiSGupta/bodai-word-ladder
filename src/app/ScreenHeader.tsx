/** The top of every screen that isn't home: a back button and a title. */
export function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="flex items-center gap-2">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to home"
        className="grid size-11 place-items-center rounded-pill text-title leading-none hover:bg-tile focus-visible:outline-2 focus-visible:outline-ink"
      >
        ‹
      </button>
      <h1 className="text-heading">{title}</h1>
    </header>
  );
}
