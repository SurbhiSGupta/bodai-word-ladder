import { Key } from './Key.tsx';

export type KeyboardProps = {
  /** Called with a lowercase letter, "enter" or "backspace". */
  onKey: (key: string) => void;
  /** Dims Enter until the word is ready. */
  canSubmit?: boolean;
};

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

/** The on-screen keyboard, sized for thumbs. Physical keys are handled by the screen itself. */
export function Keyboard({ onKey, canSubmit = true }: KeyboardProps) {
  return (
    <div className="flex w-full flex-col gap-1.5" aria-label="Keyboard" role="group">
      {ROWS.map((row, i) => (
        <div key={row} className="flex justify-center gap-1">
          {i === 1 && <span className="w-2 shrink-0" />}
          {i === 2 && (
            <Key label="Enter" wide disabled={!canSubmit} onClick={() => onKey('enter')} />
          )}
          {Array.from(row).map((letter) => (
            <Key key={letter} label={letter} onClick={() => onKey(letter)} />
          ))}
          {i === 2 && (
            <Key label="⌫" spokenLabel="Delete" wide onClick={() => onKey('backspace')} />
          )}
          {i === 1 && <span className="w-2 shrink-0" />}
        </div>
      ))}
    </div>
  );
}
