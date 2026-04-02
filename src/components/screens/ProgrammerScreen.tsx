import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Cpu,
  Binary,
  Hash,
  HashIcon
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { math } from '../../lib/math';
import { TactileButton } from '../TactileButton';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';

interface ProgrammerScreenProps {
  isAdvanced: boolean;
}

export const ProgrammerScreen = ({ isAdvanced }: ProgrammerScreenProps) => {
  const { t } = useI18n();
  const [base, setBase] = useState<'HEX' | 'DEC' | 'OCT' | 'BIN'>('DEC');
  const [bitMode, setBitMode] = useState<'8' | '16' | '32' | '64'>('64');
  const [display, setDisplay] = useState('0');
  const [result, setResult] = useState<string | null>(null);

  const handleKeyPress = (key: string) => {
    if (key === 'AC') {
      setDisplay('0');
      setResult(null);
    } else if (key === 'DEL') {
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === '=' || key === 'Enter') {
      try {
        const res = math.evaluate(display);
        setResult(res.toString());
      } catch (e) {
        setResult('Error');
      }
    } else {
      setDisplay(prev => prev === '0' ? key : prev + key);
    }
  };

  useKeyboardInput(handleKeyPress);

  const bases = [
    { id: 'HEX', name: 'Hexadecimal', prefix: '0x' },
    { id: 'DEC', name: 'Decimal', prefix: '' },
    { id: 'OCT', name: 'Octal', prefix: '0o' },
    { id: 'BIN', name: 'Binary', prefix: '0b' },
  ];

  const bitModes = ['8', '16', '32', '64'];

  const getBaseValue = (b: string) => {
    try {
      const val = parseInt(display, base === 'HEX' ? 16 : base === 'DEC' ? 10 : base === 'OCT' ? 8 : 2);
      if (isNaN(val)) return '0';
      return val.toString(b === 'HEX' ? 16 : b === 'DEC' ? 10 : b === 'OCT' ? 8 : 2).toUpperCase();
    } catch (e) {
      return '0';
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-4 p-4 lg:p-6 overflow-hidden">
      <div className="flex justify-end items-center shrink-0">
        <div className="flex gap-2">
          {bitModes.map(m => (
            <button 
              key={m}
              onClick={() => setBitMode(m as any)}
              className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${bitMode === m ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant'}`}
              aria-label={`Set bit mode to ${m} bits`}
            >
              {m}-BIT
            </button>
          ))}
        </div>
      </div>

      <section className={`${isAdvanced ? 'bg-surface-container-lowest border-primary/20 shadow-xl' : 'bg-surface-container-high border-outline-variant/15'} rounded-3xl p-6 lg:p-8 border flex flex-col gap-4 min-h-[180px] relative overflow-hidden shrink-0`}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="flex flex-col gap-3 relative z-10">
          {bases.map(b => (
            <button 
              key={b.id}
              onClick={() => setBase(b.id as any)}
              className={`flex items-center justify-between p-2 rounded-xl transition-all ${base === b.id ? 'bg-primary/10 text-primary font-black' : 'text-on-surface-variant/40 hover:bg-surface-container-low'}`}
              aria-label={`Switch to ${b.name} base`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold uppercase tracking-widest w-8">{b.id}</span>
                <span className="font-mono text-sm lg:text-base truncate max-w-[200px] lg:max-w-none">
                  {getBaseValue(b.id)}
                </span>
              </div>
              {base === b.id && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-2 lg:gap-3 flex-1">
            {['D', 'E', 'F', 'AC'].map((k, i) => (
              <TactileButton 
                key={k} 
                variant={i === 3 ? 'error' : 'default'}
                disabled={base !== 'HEX' && i < 3}
                className="h-full min-h-[50px] text-lg font-black"
                onClick={() => handleKeyPress(k)}
                ariaLabel={i === 3 ? 'All Clear' : `Hexadecimal digit ${k}`}
              >
                {k}
              </TactileButton>
            ))}
            {['A', 'B', 'C', 'DEL'].map((k, i) => (
              <TactileButton 
                key={k} 
                variant={i === 3 ? 'error' : 'default'}
                disabled={base !== 'HEX' && i < 3}
                className="h-full min-h-[50px] text-lg font-black"
                onClick={() => handleKeyPress(k)}
                ariaLabel={i === 3 ? 'Delete last character' : `Hexadecimal digit ${k}`}
              >
                {k}
              </TactileButton>
            ))}
            {['7', '8', '9', '&'].map((k, i) => (
              <TactileButton 
                key={k} 
                disabled={(base === 'OCT' && parseInt(k) > 7) || (base === 'BIN' && parseInt(k) > 1)}
                className="h-full min-h-[50px] text-lg font-black"
                onClick={() => handleKeyPress(k)}
                ariaLabel={k === '&' ? 'Bitwise AND' : `Digit ${k}`}
              >
                {k}
              </TactileButton>
            ))}
            {['4', '5', '6', '|'].map((k, i) => (
              <TactileButton 
                key={k} 
                disabled={(base === 'OCT' && parseInt(k) > 7) || (base === 'BIN' && parseInt(k) > 1)}
                className="h-full min-h-[50px] text-lg font-black"
                onClick={() => handleKeyPress(k)}
                ariaLabel={k === '|' ? 'Bitwise OR' : `Digit ${k}`}
              >
                {k}
              </TactileButton>
            ))}
            {['1', '2', '3', '^'].map((k, i) => (
              <TactileButton 
                key={k} 
                disabled={(base === 'BIN' && parseInt(k) > 1)}
                className="h-full min-h-[50px] text-lg font-black"
                onClick={() => handleKeyPress(k)}
                ariaLabel={k === '^' ? 'Bitwise XOR' : `Digit ${k}`}
              >
                {k}
              </TactileButton>
            ))}
            {['0', '<<', '>>', '='].map((k, i) => (
              <TactileButton 
                key={k} 
                variant={i === 3 ? 'primary' : 'default'}
                className="h-full min-h-[50px] text-lg font-black"
                onClick={() => handleKeyPress(k)}
                ariaLabel={k === '<<' ? 'Bitwise left shift' : k === '>>' ? 'Bitwise right shift' : k === '=' ? 'Calculate result' : 'Digit 0'}
              >
                {k}
              </TactileButton>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <section className="p-6 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 border-dashed flex-1">
            <div className="flex items-center gap-3 text-primary mb-3">
              <Cpu className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Bitwise Logic</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/5">
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">AND</span>
                <span className="font-mono text-xs text-primary">&</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/5">
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">OR</span>
                <span className="font-mono text-xs text-primary">|</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/5">
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">XOR</span>
                <span className="font-mono text-xs text-primary">^</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/5">
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">NOT</span>
                <span className="font-mono text-xs text-primary">~</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
