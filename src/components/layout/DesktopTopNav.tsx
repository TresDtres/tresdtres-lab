import React from 'react';
import { motion } from 'motion/react';
import { History, Settings } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Mode } from '../../types';

interface DesktopTopNavProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  onSettings: () => void;
  onHistory: () => void;
  isAdvanced: boolean;
  isGraphingEnabled: boolean;
}

export const DesktopTopNav = ({ mode, setMode, onSettings, onHistory, isAdvanced, isGraphingEnabled }: DesktopTopNavProps) => {
  const { t, lang, setLang } = useI18n();
  const navItems = [
    { id: Mode.Scientific, label: t('modes.scientific') },
    { id: Mode.Matrices, label: t('modes.matrices') },
    { id: Mode.Statistics, label: t('modes.statistics') },
    { id: Mode.Equations, label: t('modes.equations') },
    { id: Mode.Units, label: t('modes.units') },
    { id: Mode.Programmer, label: t('modes.programmer') },
    { id: Mode.Constants, label: t('modes.constants') },
    { id: Mode.LabAI, label: t('modes.lab_ai') },
    ...(isGraphingEnabled ? [{ id: Mode.Graphing, label: t('modes.graphing') }] : []),
  ];

  return (
    <div className="hidden lg:flex items-center justify-between px-12 h-20 bg-surface border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <h2 className="font-headline font-black text-xl tracking-tighter text-on-surface">
          TRESDTRES LAB
        </h2>
        <nav className="flex items-center gap-6">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`text-[10px] font-bold tracking-widest uppercase transition-all relative py-2 ${
                mode === item.id ? 'text-primary' : 'text-on-surface-variant/60 hover:text-on-surface-variant'
              }`}
              aria-label={`Switch to ${item.label} mode`}
            >
              {item.label}
              {mode === item.id && (
                <motion.div layoutId="desktop-nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-surface-variant/20 rounded-full px-3 py-1 border border-outline-variant/10">
          <button 
            onClick={() => setLang('es')}
            className={`text-[10px] font-bold transition-colors ${lang === 'es' ? 'text-primary' : 'text-on-surface-variant/40 hover:text-on-surface-variant'}`}
            aria-label="Cambiar idioma a español"
          >
            ES
          </button>
          <div className="w-[1px] h-3 bg-outline-variant/20" />
          <button 
            onClick={() => setLang('en')}
            className={`text-[10px] font-bold transition-colors ${lang === 'en' ? 'text-primary' : 'text-on-surface-variant/40 hover:text-on-surface-variant'}`}
            aria-label="Change language to English"
          >
            EN
          </button>
        </div>
        <button 
          onClick={onHistory} 
          className="text-on-surface-variant/60 hover:text-primary transition-colors"
          aria-label="Toggle history sidebar"
        >
          <History className="w-5 h-5" />
        </button>
        <button 
          onClick={onSettings} 
          className="text-on-surface-variant/60 hover:text-primary transition-colors"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
