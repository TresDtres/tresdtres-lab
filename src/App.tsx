/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { SettingsModal } from './components/layout/SettingsModal';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

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

        <SettingsModal 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          tab={settingsTab}
          setTab={setSettingsTab}
          isAdvanced={isAdvanced}
          setIsAdvanced={setIsAdvanced}
          theme={theme}
          setTheme={setTheme}
          isGraphingEnabled={isGraphingEnabled}
          setIsGraphingEnabled={setIsGraphingEnabled}
          showHelp={showHelp}
          setShowHelp={setShowHelp}
        />

        <div className="fixed bottom-24 right-4 opacity-5 pointer-events-none select-none z-0">
          <span className="text-6xl font-black rotate-90 block">SK-1</span>
        </div>
      </div>
    </HelpContext.Provider>
  );
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </GlobalErrorBoundary>
  );
}
