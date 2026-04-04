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
import { AlgebraScreen } from './components/screens/AlgebraScreen';
import { MoreScreen } from './components/screens/MoreScreen';

// Layout Components
import { TopAppBar } from './components/layout/TopAppBar';
import { DesktopTopNav } from './components/layout/DesktopTopNav';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { DesktopHistorySidebar } from './components/layout/DesktopHistorySidebar';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { SettingsModal } from './components/layout/SettingsModal';
import { DiagnosticsModal } from './components/layout/DiagnosticsModal';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { TutorBoard } from './components/layout/TutorBoard';

export const HelpContext = React.createContext<{ showHelp: boolean }>({ showHelp: false });

function AppContent() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>(Mode.Scientific);
  const modesOrder = [
    Mode.Scientific,
    Mode.Matrices,
    Mode.Vectors,
    Mode.Statistics,
    Mode.Equations,
    Mode.Units,
    Mode.Complex,
    Mode.Graphing,
    Mode.LabAI,
    Mode.Programmer,
    Mode.Constants,
    Mode.Algebra,
    Mode.More
  ];
  const [prevIndex, setPrevIndex] = useState(0);
  const currentIndex = modesOrder.indexOf(mode);
  const direction = currentIndex >= prevIndex ? 1 : -1;
  const distance = Math.abs(currentIndex - prevIndex);

  useEffect(() => {
    setPrevIndex(currentIndex);
  }, [currentIndex]);

  const [showSettings, setShowSettings] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
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
  const [isTutorMode, setIsTutorMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('calculator-tutor-mode') === 'true';
    }
    return false;
  });
  const [tutorData, setTutorData] = useState<any>(null);

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
    localStorage.setItem('calculator-tutor-mode', String(isTutorMode));
  }, [theme, isAdvanced, isGraphingEnabled, isTutorMode]);

  const renderScreen = () => {
    const addHistory = (expr: string, res: string) => {
      setHistory(prev => [expr + ' = ' + res, ...prev].slice(0, 20));
    };

    switch (mode) {
      case Mode.Scientific: return <ScientificScreen onResult={addHistory} isAdvanced={isAdvanced} setTutorData={setTutorData} />;
      case Mode.Matrices: return <MatricesScreen isAdvanced={isAdvanced} />;
      case Mode.Vectors: return <VectorsScreen isAdvanced={isAdvanced} />;
      case Mode.Statistics: return <StatisticsScreen isAdvanced={isAdvanced} />;
      case Mode.Equations: return <EquationsScreen isAdvanced={isAdvanced} initialType={initialEquationType} />;
      case Mode.Units: return <UnitsScreen isAdvanced={isAdvanced} />;
      case Mode.Complex: return <ComplexScreen isAdvanced={isAdvanced} />;
      case Mode.Graphing: return isGraphingEnabled ? <GraphingScreen isAdvanced={isAdvanced} /> : <ScientificScreen onResult={addHistory} isAdvanced={isAdvanced} setTutorData={setTutorData} />;
      case Mode.LabAI: return <LabAIScreen isAdvanced={isAdvanced} />;
      case Mode.Programmer: return <ProgrammerScreen isAdvanced={isAdvanced} />;
      case Mode.Constants: return <ConstantsScreen isAdvanced={isAdvanced} />;
      case Mode.Algebra: return <AlgebraScreen isAdvanced={isAdvanced} />;
      case Mode.More: return <MoreScreen setMode={setMode} isAdvanced={isAdvanced} isGraphingEnabled={isGraphingEnabled} onSettings={() => { setShowSettings(true); setSettingsTab('general'); }} />;
      default: return <ScientificScreen onResult={addHistory} isAdvanced={isAdvanced} setTutorData={setTutorData} />;
    }
  };

  const screenVariants = {
    enter: (custom: { direction: number, distance: number }) => ({
      x: custom.direction * (100 + custom.distance * 40),
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (custom: { direction: number, distance: number }) => ({
      x: custom.direction * -(100 + custom.distance * 40),
      opacity: 0,
      scale: 0.98
    })
  };

  return (
    <HelpContext.Provider value={{ showHelp }}>
      <div className="h-screen h-[100dvh] bg-surface font-body text-on-surface selection:bg-primary/20 flex flex-col lg:flex-row overflow-hidden">
        <DesktopSidebar 
          currentMode={mode} 
          setMode={setMode} 
          setInitialEquationType={setInitialEquationType} 
          onSettings={() => setShowSettings(true)} 
          onDiagnostics={() => setShowDiagnostics(true)}
        />
        
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
            <div className={`flex-1 flex flex-col lg:flex-row gap-6 h-full min-h-0 ${isTutorMode ? 'max-w-full' : 'max-w-6xl mx-auto w-full'}`}>
              <AnimatePresence mode="wait" custom={{ direction, distance }}>
                <motion.div
                  key={mode}
                  custom={{ direction, distance }}
                  variants={screenVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ 
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 }
                  }}
                  className={`flex flex-col min-h-0 transition-all duration-500 ${isTutorMode ? 'lg:w-[60%]' : 'w-full'}`}
                >
                  {renderScreen()}
                </motion.div>
              </AnimatePresence>

              {isTutorMode && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:w-[40%] h-full min-h-0 flex flex-col"
                >
                  <TutorBoard data={tutorData} />
                </motion.div>
              )}
            </div>
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
          isTutorMode={isTutorMode}
          setIsTutorMode={setIsTutorMode}
          showHelp={showHelp}
          setShowHelp={setShowHelp}
        />

        <DiagnosticsModal 
          isOpen={showDiagnostics} 
          onClose={() => setShowDiagnostics(false)} 
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
