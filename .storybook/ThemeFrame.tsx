import { useEffect, type ReactNode } from 'react';

/** Applies the toolbar's theme and palette the same way the game does: attributes on <html>. */
export function ThemeFrame({
  theme,
  palette,
  children,
}: {
  theme: string;
  palette: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'auto') delete root.dataset.theme;
    else root.dataset.theme = theme;
    root.dataset.palette = palette;
  }, [theme, palette]);
  return <div className="min-h-dvh bg-bg p-6 text-ink">{children}</div>;
}
