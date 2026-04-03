import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Trash2, 
  Settings2, 
  Info, 
  HelpCircle, 
  Search, 
  BookOpen, 
  FlaskConical, 
  Calculator, 
  Sigma, 
  Variable, 
  Layers,
  Zap,
  Activity,
  ArrowRightLeft,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { math, toLatex } from '../../lib/math';
import { TactileButton } from '../TactileButton';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { Latex } from '../Latex';

interface ScientificScreenProps {
  onResult: (expr: string, res: string) => void;
  isAdvanced: boolean;
}

export const ScientificScreen = ({ onResult, isAdvanced }: ScientificScreenProps) => {
  const { t } = useI18n();
  const [display, setDisplay] = useState('0');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isInverse, setIsInverse] = useState(false);
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad' | 'grad'>('deg');
  const displayRef = useRef<HTMLDivElement>(null);

  const handleKeyPress = (key: string) => {
    if (key === 'AC') {
      setDisplay('0');
      setResult(null);
    } else if (key === 'DEL') {
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === '=' || key === 'Enter') {
      try {
        const config = {
          angles: angleUnit
        };
        const res = math.evaluate(display, config);
        const formatted = math.format(res, { precision: 14 });
        setResult(formatted.toString());
        setHistory(prev => [display + ' = ' + formatted.toString(), ...prev].slice(0, 20));
        setDisplay(formatted.toString());
      } catch (e) {
        setResult('Error');
      }
    } else if (key === 'ANS') {
      if (history.length > 0) {
        const lastResult = history[0].split('=')[1].trim();
        setDisplay(prev => prev === '0' ? lastResult : prev + lastResult);
      }
    } else {
      setDisplay(prev => prev === '0' ? key : prev + key);
    }
  };

  useKeyboardInput(handleKeyPress);

  const mainKeys = [
    ['7', '8', '9', 'DEL', 'AC'],
    ['4', '5', '6', '*', '/'],
    ['1', '2', '3', '+', '-'],
    ['0', '.', 'EXP', 'ANS', '=']
  ];

  const scientificKeys = [
    [isInverse ? 'asin' : 'sin', isInverse ? 'acos' : 'cos', isInverse ? 'atan' : 'tan', '(', ')'],
    [isInverse ? '10^x' : 'log', isInverse ? 'e^x' : 'ln', 'sqrt', 'pow', 'pi'],
    ['abs', 'fact', 'mod', 'inv', 'e']
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-4 p-4 lg:p-6 overflow-hidden">
      <div className="flex justify-end items-center shrink-0">
        <div className="flex gap-2">
          <button 
            onClick={() => setAngleUnit(prev => prev === 'deg' ? 'rad' : prev === 'rad' ? 'grad' : 'deg')}
            className="px-3 py-1 rounded-lg bg-surface-container-low border border-outline-variant/10 text-[10px] font-black uppercase tracking-widest text-primary"
            aria-label={`Change angle unit, current: ${angleUnit.toUpperCase()}`}
          >
            {angleUnit.toUpperCase()}
          </button>
          <button 
            onClick={() => setIsInverse(!isInverse)}
            className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${isInverse ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant'}`}
            aria-label={isInverse ? "Disable inverse functions" : "Enable inverse functions"}
          >
            INV
          </button>
        </div>
      </div>

      <section className={`${isAdvanced ? 'bg-surface-container-lowest border-primary/20 shadow-xl' : 'bg-surface-container-high border-outline-variant/15'} rounded-3xl p-6 lg:p-10 border flex flex-col justify-end min-h-[140px] lg:min-h-[180px] relative overflow-hidden shrink-0`}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="flex flex-col items-end gap-2 relative z-10">
          <div className="text-sm font-mono text-on-surface-variant opacity-40 truncate w-full text-right overflow-x-auto scrollbar-hide h-6">
            <Latex formula={toLatex(display)} className="text-on-surface-variant" />
          </div>
          <div className="text-4xl lg:text-6xl font-black text-primary font-mono tracking-tighter truncate w-full text-right overflow-x-auto scrollbar-hide">
            {result || display}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-5 gap-2 lg:gap-3">
            {scientificKeys.flat().map(k => (
              <TactileButton 
                key={k} 
                variant="ghost" 
                className="h-10 lg:h-12 text-[10px] font-bold uppercase tracking-widest"
                onClick={() => {
                  if (k === '(' || k === ')' || k === 'pi' || k === 'e') {
                    handleKeyPress(k);
                  } else if (k === '10^x') {
                    handleKeyPress('10^');
                  } else if (k === 'e^x') {
                    handleKeyPress('e^');
                  } else if (k === 'pow') {
                    handleKeyPress('^');
                  } else {
                    handleKeyPress(k + '(');
                  }
                }}
                ariaLabel={`Scientific function: ${k}`}
              >
                {k}
              </TactileButton>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 lg:gap-3 flex-1">
            {mainKeys.flat().map((k, i) => (
              <TactileButton 
                key={k} 
                variant={k === 'AC' || k === 'DEL' ? 'error' : k === '=' ? 'primary' : 'default'}
                className={`h-full min-h-[50px] text-lg lg:text-xl font-black ${k === '=' ? 'shadow-lg' : ''}`}
                onClick={() => handleKeyPress(k)}
                keyName={k}
                ariaLabel={k === 'AC' ? 'All Clear' : k === 'DEL' ? 'Delete last character' : k === '=' ? 'Calculate result' : k === 'ANS' ? 'Use last answer' : `Number or operator: ${k}`}
              >
                {k}
              </TactileButton>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex items-center gap-2 px-2">
            <History className="w-4 h-4 text-primary/40" />
            <span className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/40">History</span>
            <button 
              onClick={() => setHistory([])}
              className="ml-auto p-1 hover:text-error transition-colors opacity-40 hover:opacity-100"
              aria-label="Clear calculation history"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide bg-surface-container-lowest/50 rounded-2xl border border-outline-variant/5 p-3">
            {history.length > 0 ? history.map((h, i) => (
              <button 
                key={i}
                onClick={() => setDisplay(h.split('=')[1].trim())}
                className="w-full text-left p-3 rounded-xl hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/10"
                aria-label={`History item: ${h}. Click to use result.`}
              >
                <div className="text-[10px] font-mono text-on-surface-variant/40 group-hover:text-on-surface-variant transition-colors truncate">
                  {h.split('=')[0]}
                </div>
                <div className="text-sm font-mono font-black text-primary truncate">
                  {h.split('=')[1]}
                </div>
              </button>
            )) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 gap-2">
                <Calculator className="w-8 h-8" />
                <span className="text-[10px] font-black uppercase tracking-widest">No history</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
