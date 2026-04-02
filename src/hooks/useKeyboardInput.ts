import { useEffect } from 'react';

export const useKeyboardInput = (onKeyPress: (key: string) => void, active: boolean = true) => {
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key;
      let mappedKey: string | null = null;

      if (key >= '0' && key <= '9') mappedKey = key;
      else if (key === '.') mappedKey = '.';
      else if (key === '+') mappedKey = '+';
      else if (key === '-') mappedKey = '-';
      else if (key === '*') mappedKey = '*';
      else if (key === '/') mappedKey = '/';
      else if (key === 'Enter') mappedKey = 'Enter';
      else if (key === 'Backspace') mappedKey = 'DEL';
      else if (key === 'Escape') mappedKey = 'AC';
      else if (key === 'ArrowUp') mappedKey = 'ArrowUp';
      else if (key === 'ArrowDown') mappedKey = 'ArrowDown';
      else if (key === 'ArrowLeft') mappedKey = 'ArrowLeft';
      else if (key === 'ArrowRight') mappedKey = 'ArrowRight';
      else if (key === 'Tab') mappedKey = 'Tab';
      else if (key === '(') mappedKey = '(';
      else if (key === ')') mappedKey = ')';
      else if (key === '^') mappedKey = '^';
      else if (key.toLowerCase() === 's') mappedKey = 'sin';
      else if (key.toLowerCase() === 'c') mappedKey = 'cos';
      else if (key.toLowerCase() === 't') mappedKey = 'tan';
      else if (key.toLowerCase() === 'l') mappedKey = 'log';
      else if (key.toLowerCase() === 'n') mappedKey = 'ln';
      else if (key.toLowerCase() === 'i') mappedKey = 'i';

      if (mappedKey) {
        onKeyPress(mappedKey);
        // Dispatch custom event for visual feedback
        window.dispatchEvent(new CustomEvent('calculator-visual-press', { detail: mappedKey }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, active]);
};
