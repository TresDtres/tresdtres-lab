/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { I18nProvider, useI18n } from './lib/i18n';
import { Mode } from './types';

// Screen Components
import { ScientificScreen } from './components/screens/ScientificScreen';
import { MatricesScreen } from './components/screens/MatricesScreen';
import { VectorsScreen } from './components/screens/VectorsScreen';
import { StatisticsScreen } from './components/screens/StatisticsScreen';
import { EquationsScreen } from './components/screens/EquationsScreen';
import { UnitsScreen } from './components/screens/UnitsScreen';
import { ComplexScreen } from './components/screens/ComplexScreen';
import { LabAIScreen } from './components/screens/LabAIScreen';
import { ProgrammerScreen } from './components/screens/ProgrammerScreen';
import { GraphingScreen } from './components/screens/GraphingScreen';
import { ConstantsScreen } from './components/screens/ConstantsScreen';
import { MoreScreen } from './components/screens/MoreScreen';

// Layout Components
import { TopAppBar } from './components/layout/TopAppBar';
import { DesktopTopNav } from './components/layout/DesktopTopNav';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { DesktopHistorySidebar } from './components/layout/DesktopHistorySidebar';
import { BottomNavBar } from './components/layout/BottomNavBar';

export const KEYBOARD_SHORTCUTS = [
  { key: '0-9, .', action: 'shortcuts.numbers' },
  { key: '+, -, *, /', action: 'shortcuts.operators' },
  { key: 'Enter', action: 'shortcuts.calculate' },
  { key: 'Backspace', action: 'shortcuts.delete' },
  { key: 'Escape', action: 'shortcuts.clear' },
  { key: '(', action: 'shortcuts.open_paren' },
  { key: ')', action: 'shortcuts.close_paren' },
  { key: '^', action: 'shortcuts.power' },
  { key: 's', action: 'shortcuts.sin' },
  { key: 'c', action: 'shortcuts.cos' },
  { key: 't', action: 'shortcuts.tan' },
  { key: 'l', action: 'shortcuts.log' },
  { key: 'n', action: 'shortcuts.ln' },
  { key: 'i', action: 'shortcuts.imaginary' },
];

export const HelpContext = React.createContext<{ showHelp: boolean }>({ showHelp: false });

function AppContent() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>(Mode.Scientific);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'general' | 'howto'>('general');
  const [showHistory, setShowHistory] = useState(false);
  const [initialEquationType, setInitialEquationType] = useState<'quadratic' | 'linear2x2' | 'linear3x3' | 'chemical' | 'formula'>('quadratic');
  const [showHelp, setShowHelp] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isAdvanced, setIsAdvanced] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('calculator-advanced') === 'true';
    }
    return false;
  });
  const [isGraphingEnabled, setIsGraphingEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calculator-graphing-enabled');
      return saved === null ? true : saved === 'true';
    }
    return true;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calculator-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('calculator-theme', theme);
    localStorage.setItem('calculator-advanced', String(isAdvanced));
    localStorage.setItem('calculator-graphing-enabled', String(isGraphingEnabled));
  }, [theme, isAdvanced, isGraphingEnabled]);

  const renderScreen = () => {
    const addHistory = (expr: string, res: string) => {
      setHistory(prev => [expr + ' = ' + res, ...prev].slice(0, 20));
    };

    switch (mode) {
      case Mode.Scientific: return <ScientificScreen onResult={addHistory} isAdvanced={isAdvanced} />;
      case Mode.Matrices: return <MatricesScreen isAdvanced={isAdvanced} />;
      case Mode.Vectors: return <VectorsScreen isAdvanced={isAdvanced} />;
      case Mode.Statistics: return <StatisticsScreen isAdvanced={isAdvanced} />;
      case Mode.Equations: return <EquationsScreen isAdvanced={isAdvanced} initialType={initialEquationType} />;
      case Mode.Units: return <UnitsScreen isAdvanced={isAdvanced} />;
      case Mode.Complex: return <ComplexScreen isAdvanced={isAdvanced} />;
      case Mode.Graphing: return isGraphingEnabled ? <GraphingScreen isAdvanced={isAdvanced} /> : <ScientificScreen onResult={addHistory} isAdvanced={isAdvanced} />;
      case Mode.LabAI: return <LabAIScreen isAdvanced={isAdvanced} />;
      case Mode.Programmer: return <ProgrammerScreen isAdvanced={isAdvanced} />;
      case Mode.Constants: return <ConstantsScreen isAdvanced={isAdvanced} />;
      case Mode.More: return <MoreScreen setMode={setMode} isAdvanced={isAdvanced} isGraphingEnabled={isGraphingEnabled} onSettings={() => { setShowSettings(true); setSettingsTab('general'); }} />;
      default: return <ScientificScreen onResult={addHistory} isAdvanced={isAdvanced} />;
    }
  };

  return (
    <HelpContext.Provider value={{ showHelp }}>
      <div className="h-screen h-[100dvh] bg-surface font-body text-on-surface selection:bg-primary/20 flex flex-col lg:flex-row overflow-hidden">
        <DesktopSidebar currentMode={mode} setMode={setMode} setInitialEquationType={setInitialEquationType} onSettings={() => setShowSettings(true)} />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <TopAppBar mode={mode} onSettings={() => setShowSettings(!showSettings)} isAdvanced={isAdvanced} />
          <DesktopTopNav 
            mode={mode} 
            setMode={setMode} 
            onSettings={() => setShowSettings(true)} 
            onHistory={() => setShowHistory(!showHistory)} 
            isAdvanced={isAdvanced}
            isGraphingEnabled={isGraphingEnabled}
          />
          
          <main className="flex-1 overflow-hidden pt-16 pb-20 lg:pt-12 lg:pb-12 px-2 sm:px-4 lg:px-8 w-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-6xl mx-auto h-full w-full flex flex-col min-h-0"
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </main>

          <BottomNavBar currentMode={mode} setMode={setMode} />
        </div>

        <DesktopHistorySidebar history={history} />

        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
              onClick={() => setShowSettings(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`bg-surface rounded-2xl w-full ${settingsTab === 'howto' ? 'max-w-md' : 'max-w-xs'} p-6 shadow-2xl border border-outline-variant/20`}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline font-bold text-lg">{t('settings.title')}</h3>
                  <button onClick={() => setShowSettings(false)} aria-label="Close settings"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex gap-4 mb-6 border-b border-outline-variant/10">
                  <button 
                    onClick={() => setSettingsTab('general')}
                    className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all ${settingsTab === 'general' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant/40'}`}
                    aria-label="General settings"
                  >
                    {t('settings.general')}
                  </button>
                  <button 
                    onClick={() => setSettingsTab('howto')}
                    className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all ${settingsTab === 'howto' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant/40'}`}
                    aria-label="Keyboard shortcuts guide"
                  >
                    {t('settings.shortcuts')}
                  </button>
                </div>

                <div className="space-y-4">
                  {settingsTab === 'howto' ? (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar" id="printable-shortcuts">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary">{t('settings.shortcuts')}</h4>
                        <button 
                          onClick={() => {
                            const windowUrl = window.location.href;
                            const uniqueName = new Date();
                            const windowName = 'Print' + uniqueName.getTime();
                            const printWindow = window.open(windowUrl, windowName, 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
                            
                            if (printWindow) {
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Calculadora - ${t('settings.shortcuts')}</title>
                                    <style>
                                      body { font-family: sans-serif; padding: 40px; color: #333; }
                                      h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
                                      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                      th { background-color: #f4f4f4; }
                                      .key { font-family: monospace; background: #eee; padding: 2px 6px; border-radius: 4px; border: 1px solid #ccc; }
                                    </style>
                                  </head>
                                  <body>
                                    <h1>${t('settings.keyboard_guide_title')}</h1>
                                    <table>
                                      <thead>
                                        <tr>
                                          <th>${t('settings.pc_key')}</th>
                                          <th>${t('settings.calc_function')}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        ${KEYBOARD_SHORTCUTS.map(s => `
                                          <tr>
                                            <td><span class="key">${s.key}</span></td>
                                            <td>${t(s.action)}</td>
                                          </tr>
                                        `).join('')}
                                      </tbody>
                                    </table>
                                    <p style="margin-top: 40px; font-size: 10px; color: #666;">${t('settings.generated_by')}</p>
                                    <script>
                                      window.onload = function() { window.print(); window.close(); }
                                    </script>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                            }
                          }}
                          className="p-1.5 hover:bg-primary/10 text-on-surface-variant/60 hover:text-primary rounded-md transition-colors"
                          title={t('settings.print')}
                          aria-label="Print shortcuts guide"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {KEYBOARD_SHORTCUTS.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-surface-container-low rounded-lg border border-outline-variant/5">
                            <code className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">{s.key}</code>
                            <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">{t(s.action)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold uppercase tracking-widest">{t('settings.advanced_mode')}</span>
                          <span className="text-[9px] text-on-surface-variant opacity-60 uppercase tracking-widest">{t('settings.pristine_lab')}</span>
                        </div>
                        <button 
                          onClick={() => {
                            const next = !isAdvanced;
                            setIsAdvanced(next);
                          }}
                          className={`w-12 h-6 rounded-full relative transition-colors ${isAdvanced ? 'bg-primary' : 'bg-outline-variant/30'}`}
                          aria-label={`Toggle advanced mode. Currently ${isAdvanced ? 'enabled' : 'disabled'}`}
                        >
                          <motion.div 
                            animate={{ x: isAdvanced ? 26 : 4 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                          />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{t('settings.dark_mode')}</span>
                        <button 
                          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                          className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-outline-variant/30'}`}
                          aria-label={`Toggle dark mode. Currently ${theme === 'dark' ? 'enabled' : 'disabled'}`}
                        >
                          <motion.div 
                            animate={{ x: theme === 'dark' ? 22 : 4 }}
                            className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                          />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{t('settings.graphing_mode')}</span>
                          <span className="text-[9px] text-on-surface-variant opacity-60 uppercase tracking-widest">{t('settings.enable_graphing')}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setIsGraphingEnabled(!isGraphingEnabled);
                            if (isGraphingEnabled && mode === Mode.Graphing) {
                              setMode(Mode.Scientific);
                            }
                          }}
                          className={`w-10 h-5 rounded-full relative transition-colors ${isGraphingEnabled ? 'bg-primary' : 'bg-outline-variant/30'}`}
                          aria-label={`Toggle graphing mode. Currently ${isGraphingEnabled ? 'enabled' : 'disabled'}`}
                        >
                          <motion.div 
                            animate={{ x: isGraphingEnabled ? 22 : 4 }}
                            className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                          />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{t('settings.haptic_feedback')}</span>
                        <div className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{t('settings.contextual_help')}</span>
                          <span className="text-[9px] text-on-surface-variant opacity-60 uppercase tracking-widest">{t('settings.show_button_info')}</span>
                        </div>
                        <button 
                          onClick={() => setShowHelp(!showHelp)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${showHelp ? 'bg-primary' : 'bg-outline-variant/30'}`}
                          aria-label={`Toggle contextual help. Currently ${showHelp ? 'enabled' : 'disabled'}`}
                        >
                          <motion.div 
                            animate={{ x: showHelp ? 22 : 4 }}
                            className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                          />
                        </button>
                      </div>
                      <div className="pt-4 border-t border-outline-variant/10">
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60 mb-2">Kernel Version</p>
                        <p className="text-xs font-mono">SK-1.0.4-STABLE</p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-24 right-4 opacity-5 pointer-events-none select-none z-0">
          <span className="text-6xl font-black rotate-90 block">SK-1</span>
        </div>
      </div>
    </HelpContext.Provider>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
