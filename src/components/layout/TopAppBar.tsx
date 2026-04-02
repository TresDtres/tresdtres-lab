import React from 'react';
import { FlaskConical, Settings } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Mode } from '../../types';

interface TopAppBarProps {
  mode: Mode;
  onSettings: () => void;
  onHistory?: () => void;
  isAdvanced: boolean;
}

export const TopAppBar = ({ mode, onSettings, isAdvanced }: TopAppBarProps) => {
  const { t } = useI18n();
  const getModeTitle = () => {
    switch (mode) {
      case Mode.Scientific: return t('modes.scientific');
      case Mode.Matrices: return t('modes.matrices');
      case Mode.Vectors: return t('modes.vectors');
      case Mode.Statistics: return t('modes.statistics');
      case Mode.Equations: return t('modes.equations');
      case Mode.Units: return t('modes.units');
      case Mode.Complex: return t('modes.complex');
      case Mode.Graphing: return t('modes.graphing');
      case Mode.LabAI: return t('modes.lab_ai');
      case Mode.Programmer: return t('modes.programmer');
      case Mode.More: return t('modes.more');
      default: return 'Tresdtres Lab';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface shadow-[inset_0_-1px_0_rgba(193,198,215,0.15)] flex items-center justify-between px-6 h-16 border-b border-outline-variant/10 lg:hidden">
      <div className="flex items-center gap-2">
        <FlaskConical className="text-primary w-5 h-5" />
        <h1 className="font-headline uppercase tracking-[0.1rem] font-bold text-sm text-primary">
          TRESDTRES-SK-1
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-headline uppercase tracking-[0.1rem] font-bold text-xs text-on-surface-variant">{getModeTitle()}</span>
        <button 
          onClick={onSettings} 
          className="text-on-surface-variant hover:opacity-80 transition-all active:scale-95"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
