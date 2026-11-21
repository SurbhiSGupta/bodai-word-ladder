import { useEffect, useRef, type ReactNode } from 'react';

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  /** Read by screen readers as the sheet's name, and shown as its heading. */
  title: string;
  children: ReactNode;
};

/**
 * A panel that slides up from the bottom, over a soft scrim. Built on the native <dialog>,
 * so focus stays inside, Escape closes it, and screen readers know it's a dialog.
 */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      className={[
        'm-0 mx-auto mt-auto w-full max-w-md rounded-t-lg bg-surface p-0 text-ink shadow-raised',
        'backdrop:bg-scrim',
        'open:motion-safe:animate-[sheet-up_var(--duration-base)_var(--ease-standard)]',
      ].join(' ')}
    >
      <div className="flex flex-col gap-3 px-5 pt-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-heading">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-11 place-items-center rounded-pill text-heading text-muted hover:bg-tile focus-visible:outline-2 focus-visible:outline-ink"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
