import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface LatexProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export const Latex: React.FC<LatexProps> = ({ formula, displayMode = false, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError: false,
          strict: false,
          trust: true,
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        containerRef.current.textContent = formula;
      }
    }
  }, [formula, displayMode]);

  return <span ref={containerRef} className={className} />;
};
