import React, { useState, useEffect, useContext } from 'react';
import { HelpContext } from '../contexts/HelpContext';

export const TactileButton = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "default",
  span = 1,
  help,
  keyName,
  disabled = false,
  ariaLabel
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string,
  variant?: "default" | "primary" | "secondary" | "error" | "ghost",
  span?: number,
  key?: React.Key,
  keyName?: string,
  help?: string,
  disabled?: boolean,
  ariaLabel?: string
}) => {
  const { showHelp } = useContext(HelpContext);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleVisualPress = (e: any) => {
      const pressedKey = e.detail;
      const buttonLabel = typeof children === 'string' ? children : null;
      
      if (pressedKey === keyName || (buttonLabel && pressedKey === buttonLabel)) {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
      }
    };

    window.addEventListener('calculator-visual-press', handleVisualPress);
    return () => window.removeEventListener('calculator-visual-press', handleVisualPress);
  }, [keyName, children]);

  const baseStyles = "tactile-key h-14 rounded-xl flex items-center justify-center font-bold transition-all select-none relative";
  
  const variants = {
    default: "bg-surface-container-lowest text-on-surface border border-outline-variant/30 shadow-[0_6px_0_var(--color-shadow-tactile)] hover:bg-surface-container-low",
    primary: "bg-primary text-white text-xl border border-primary-container shadow-[0_6px_0_var(--color-primary-container)] hover:bg-primary-container",
    secondary: "bg-secondary/10 text-secondary border border-secondary/30 shadow-[0_6px_0_var(--color-shadow-tactile)] text-xs uppercase tracking-widest hover:bg-secondary/20",
    error: "bg-error-container/30 text-error border border-error/30 shadow-[0_6px_0_var(--color-shadow-tactile)] text-sm hover:bg-error-container/50",
    ghost: "bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest border border-outline-variant/20 shadow-[0_6px_0_var(--color-shadow-tactile)] hover:bg-surface-container-high"
  };

  const pressStyles = isPressed ? "translate-y-1 shadow-[0_2px_0_rgba(0,0,0,0.1)]" : "active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.1)]";

  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${pressStyles} ${className} ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
      style={{ gridColumn: `span ${span}` }}
      title={help}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] pointer-events-none"></div>
      <span className="relative z-10">{children}</span>
      {showHelp && help && (
        <div className="absolute -top-2 -right-2 z-20 bg-primary text-white text-[7px] px-1.5 py-0.5 rounded-full shadow-lg font-black uppercase tracking-tighter animate-bounce">
          ?
        </div>
      )}
      {showHelp && help && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 bg-on-surface text-surface text-[8px] px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          {help}
        </div>
      )}
    </button>
  );
};
