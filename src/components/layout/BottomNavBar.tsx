import React from 'react';
import { Calculator, Grid3X3, Terminal, BarChart3, MoreHorizontal, Variable } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Mode } from '../../types';

interface BottomNavBarProps {
  currentMode: Mode;
  setMode: (m: Mode) => void;
}

export const BottomNavBar = ({ currentMode, setMode }: BottomNavBarProps) => {
  const { t } = useI18n();
  const navItems = [
    { id: Mode.Scientific, label: t('modes.scientific'), icon: Calculator },
    { id: Mode.Algebra, label: t('algebra.title'), icon: Variable },
    { id: Mode.Matrices, label: t('modes.matrices'), icon: Grid3X3 },
    { id: Mode.LabAI, label: t('modes.lab_ai'), icon: Terminal },
    { id: Mode.More, label: t('modes.more'), icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 border-t border-outline-variant/15 bg-surface-container-lowest flex justify-around items-center h-20 pb-safe px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden">
      {navItems.map((item) => {
        const isActive = currentMode === item.id || (item.id === Mode.More && [Mode.Equations, Mode.Units, Mode.Complex, Mode.Vectors, Mode.More].includes(currentMode));
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-100 active:translate-y-0.5 ${
              isActive 
                ? 'text-primary bg-surface-container-low shadow-[0_3px_0_rgba(193,198,215,0.6)] translate-y-[-2px]' 
                : 'text-on-surface-variant hover:bg-surface-container-lowest'
            }`}
            aria-label={`Switch to ${item.label} mode`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'fill-current' : ''}`} />
            <span className="font-headline text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
