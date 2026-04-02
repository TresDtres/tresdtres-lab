import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  FileText, 
  Save, 
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
  CornerDownRight
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { math } from '../../lib/math';
import { TactileButton } from '../TactileButton';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';

interface ComplexScreenProps {
  isAdvanced: boolean;
}

export const ComplexScreen = ({ isAdvanced }: ComplexScreenProps) => {
  const { t } = useI18n();
  const [display, setDisplay] = useState('0');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleKeyPress = (key: string) => {
    if (key === 'AC') {
      setDisplay('0');
      setResult(null);
    } else if (key === 'DEL') {
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === '=') {
      try {
        const res = math.evaluate(display);
        setResult(res);
        setHistory(prev => [display + ' = ' + res.toString(), ...prev].slice(0, 10));
      } catch (e) {
        setResult('Error');
      }
    } else {
      setDisplay(prev => prev === '0' ? key : prev + key);
    }
  };

  useKeyboardInput(handleKeyPress);

  const functions = [
    { id: 'abs', label: 'abs(z)', cmd: 'abs(' },
    { id: 'arg', label: 'arg(z)', cmd: 'arg(' },
    { id: 'conj', label: 'conj(z)', cmd: 'conj(' },
    { id: 're', label: 're(z)', cmd: 're(' },
    { id: 'im', label: 'im(z)', cmd: 'im(' },
    { id: 'exp', label: 'exp(z)', cmd: 'exp(' },
    { id: 'log', label: 'log(z)', cmd: 'log(' },
    { id: 'sqrt', label: 'sqrt(z)', cmd: 'sqrt(' },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-6 p-4 lg:p-8 overflow-hidden">
      <section className={`${isAdvanced ? 'bg-surface-container-lowest border-primary/20 shadow-xl' : 'bg-surface-container-high border-outline-variant/15'} rounded-3xl p-8 lg:p-10 border flex flex-col justify-end min-h-[180px] relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="flex flex-col items-end gap-2 relative z-10">
          <span className="text-sm font-mono text-on-surface-variant opacity-40 truncate w-full text-right">{display}</span>
          <span className="text-4xl lg:text-6xl font-black text-primary font-mono tracking-tighter">
            {result ? result.toString() : display}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        <section className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Complex Functions</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {functions.map(f => (
              <button
                key={f.id}
                onClick={() => handleKeyPress(f.cmd)}
                className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high hover:border-primary/40 transition-all group"
                aria-label={`Apply complex function: ${f.label}`}
              >
                <span className="text-xs font-bold tracking-wide">{f.label}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <CornerDownRight className="w-4 h-4 text-primary" />
                </div>
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <div className="mt-auto space-y-4 pt-6 border-t border-outline-variant/10">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary/40" />
                <span className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/40">Recent Calculations</span>
              </div>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="text-[11px] font-mono text-on-surface-variant/60 bg-surface-container-low/50 p-2 rounded-lg border border-outline-variant/5">
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Keypad</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['7', '8', '9', 'DEL'].map((k, i) => (
              <TactileButton key={k} variant={i === 3 ? 'error' : 'default'} className="h-14 text-xl" onClick={() => handleKeyPress(k)} keyName={k} ariaLabel={i === 3 ? 'Delete last character' : `Number ${k}`}>{k}</TactileButton>
            ))}
            {['4', '5', '6', 'AC'].map((k, i) => (
              <TactileButton key={k} variant={i === 3 ? 'error' : 'default'} className="h-14 text-xl" onClick={() => handleKeyPress(k)} keyName={k} ariaLabel={i === 3 ? 'All Clear' : `Number ${k}`}>{k}</TactileButton>
            ))}
            {['1', '2', '3', '+'].map((k) => (
              <TactileButton key={k} className="h-14 text-xl" onClick={() => handleKeyPress(k)} keyName={k} ariaLabel={k === '+' ? 'Plus operator' : `Number ${k}`}>{k}</TactileButton>
            ))}
            {['0', '.', 'i', '-'].map((k) => (
              <TactileButton key={k} className="h-14 text-xl" onClick={() => handleKeyPress(k)} keyName={k} ariaLabel={k === '.' ? 'Decimal point' : k === 'i' ? 'Imaginary unit i' : k === '-' ? 'Minus operator' : `Number ${k}`}>{k}</TactileButton>
            ))}
            {['(', ')', '*', '/'].map((k) => (
              <TactileButton key={k} className="h-14 text-xl" onClick={() => handleKeyPress(k)} keyName={k} ariaLabel={k === '(' ? 'Open parenthesis' : k === ')' ? 'Close parenthesis' : k === '*' ? 'Multiply operator' : 'Divide operator'}>{k}</TactileButton>
            ))}
            <TactileButton variant="primary" className="col-span-4 h-16 text-xl font-black" onClick={() => handleKeyPress('=')} keyName="=" ariaLabel="Calculate result">=</TactileButton>
          </div>
        </section>
      </div>
    </div>
  );
};
