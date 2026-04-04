import React from 'react';
import { Grid3X3, History, Database, Sigma, Binary, FlaskConical, Settings, LifeBuoy, Variable } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Mode } from '../../types';

interface DesktopSidebarProps {
  currentMode: Mode;
  setMode: (m: Mode) => void;
  setInitialEquationType: (t: any) => void;
  onSettings: () => void;
  onDiagnostics: () => void;
}

export const DesktopSidebar = ({ currentMode, setMode, setInitialEquationType, onSettings, onDiagnostics }: DesktopSidebarProps) => {
  const { t } = useI18n();
  const items = [
    { label: t('algebra.title'), icon: Variable, mode: Mode.Algebra },
    { label: t('modes.constants'), icon: Grid3X3, mode: Mode.Constants },
    { label: t('common.history'), icon: History, mode: Mode.Scientific },
    { label: t('sidebar.unit_prefixes'), icon: Database, mode: Mode.Units },
    { label: t('sidebar.formulae'), icon: Sigma, mode: Mode.Equations, type: 'formula' },
    { label: t('modes.programmer'), icon: Binary, mode: Mode.Programmer },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-outline-variant/10 p-8">
      <div className="mb-12">
        <h3 className="font-headline font-black text-sm text-on-surface">{t('sidebar.instrument_id')}</h3>
        <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{t('sidebar.precision_mode')}</p>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map(item => (
          <button
            key={item.label}
            onClick={() => {
              setMode(item.mode);
              if (item.type) setInitialEquationType(item.type);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              currentMode === item.mode 
                ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/10' 
                : 'text-on-surface-variant/60 hover:bg-surface-container-low'
            }`}
            aria-label={`Go to ${item.label}`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-6">
        <button 
          className="w-full py-3 bg-primary text-white rounded-lg font-headline font-black text-[10px] tracking-widest uppercase shadow-[0_4px_0_var(--color-primary-container)] active:translate-y-1 active:shadow-none transition-all"
          aria-label="Export calculation data"
        >
          {t('sidebar.export_data')}
        </button>
        <div className="space-y-2">
          <button 
            onClick={onSettings}
            className="flex items-center gap-3 text-on-surface-variant/60 hover:text-on-surface text-xs font-bold transition-colors w-full"
            aria-label="Open settings"
          >
            <Settings className="w-4 h-4" />
            {t('settings.title')}
          </button>
          <button 
            onClick={onDiagnostics}
            className="flex items-center gap-3 text-on-surface-variant/60 hover:text-on-surface text-xs font-bold transition-colors w-full"
            aria-label="Get support"
          >
            <LifeBuoy className="w-4 h-4" />
            {t('sidebar.support')}
          </button>
        </div>
      </div>
    </aside>
  );
};
