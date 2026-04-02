import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  FileText, 
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
import { math } from '../../lib/math';
import { TactileButton } from '../TactileButton';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';

interface VectorsScreenProps {
  isAdvanced: boolean;
}

export const VectorsScreen = ({ isAdvanced }: VectorsScreenProps) => {
  const { t } = useI18n();
  const [dim, setDim] = useState(3);
  const [v1, setV1] = useState<string[]>(Array(3).fill('0'));
  const [v2, setV2] = useState<string[]>(Array(3).fill('0'));
  const [activeVector, setActiveVector] = useState<'v1' | 'v2'>('v1');
  const [activeIdx, setActiveIdx] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [activeSheet, setActiveSheet] = useState<'EDITOR' | 'WORKSHEET'>('EDITOR');
  const [worksheetData, setWorksheetData] = useState<any>(null);

  const handleKeyPress = (key: string) => {
    if (key === 'DEL') {
      if (activeVector === 'v1') {
        const newV = [...v1];
        newV[activeIdx] = newV[activeIdx].slice(0, -1) || '0';
        setV1(newV);
      } else {
        const newV = [...v2];
        newV[activeIdx] = newV[activeIdx].slice(0, -1) || '0';
        setV2(newV);
      }
    } else if (key === 'AC') {
      if (activeVector === 'v1') {
        const newV = [...v1];
        newV[activeIdx] = '0';
        setV1(newV);
      } else {
        const newV = [...v2];
        newV[activeIdx] = '0';
        setV2(newV);
      }
    } else if (key === 'ArrowLeft') {
      setActiveIdx(prev => Math.max(0, prev - 1));
    } else if (key === 'ArrowRight') {
      setActiveIdx(prev => Math.min(dim - 1, prev + 1));
    } else if (key === 'ArrowUp') {
      setActiveVector('v1');
    } else if (key === 'ArrowDown') {
      setActiveVector('v2');
    } else if (key === 'Enter' || key === 'Tab') {
      if (activeIdx < dim - 1) {
        setActiveIdx(prev => prev + 1);
      } else if (activeVector === 'v1') {
        setActiveVector('v2');
        setActiveIdx(0);
      }
    } else if (/[0-9.-]/.test(key)) {
      if (activeVector === 'v1') {
        const newV = [...v1];
        const currentVal = newV[activeIdx];
        newV[activeIdx] = currentVal === '0' ? key : currentVal + key;
        setV1(newV);
      } else {
        const newV = [...v2];
        const currentVal = newV[activeIdx];
        newV[activeIdx] = currentVal === '0' ? key : currentVal + key;
        setV2(newV);
      }
    }
  };

  useKeyboardInput(handleKeyPress);

  const formatNum = (v: any) => typeof v === 'number' ? parseFloat(v.toFixed(8)).toString() : v;

  const calculate = (op: string) => {
    const vec1 = v1.map(v => parseFloat(v));
    const vec2 = v2.map(v => parseFloat(v));
    let steps = [];
    try {
      let res;
      if (op === 'dot') {
        res = math.dot(vec1, vec2);
        steps.push({ description: "Calcular producto punto", formula: `v₁ · v₂ = ${formatNum(res)}` });
      } else if (op === 'cross') {
        if (dim !== 3) {
          throw new Error("El producto cruz solo está definido para vectores de 3 dimensiones.");
        }
        res = math.cross(vec1, vec2) as any;
        const [x1, y1, z1] = vec1;
        const [x2, y2, z2] = vec2;
        
        steps.push({ 
          description: "Calcular producto cruz (v₁ × v₂)", 
          formula: "v₁ × v₂ = (y₁z₂ - z₁y₂, z₁x₂ - x₁z₂, x₁y₂ - y₁x₂)" 
        });
        
        steps.push({
          description: "Sustituir componentes",
          formula: `x = (${y1}·${z2}) - (${z1}·${y2}) = ${formatNum(res[0])}\n` +
                   `y = (${z1}·${x2}) - (${x1}·${z2}) = ${formatNum(res[1])}\n` +
                   `z = (${x1}·${y2}) - (${y1}·${x2}) = ${formatNum(res[2])}`
        });

        steps.push({
          description: "Resultado final",
          result: `[${res.map((v: number) => formatNum(v)).join(', ')}]`
        });
      } else if (op === 'norm1') {
        res = math.norm(vec1);
        const sumSq = vec1.map(v => `${v}²`).join(' + ');
        steps.push({ 
          description: "Calcular magnitud de v₁ (Norma Euclidiana)", 
          formula: `||v₁|| = √(${sumSq}) = ${formatNum(res)}` 
        });
      } else if (op === 'norm2') {
        res = math.norm(vec2);
        const sumSq = vec2.map(v => `${v}²`).join(' + ');
        steps.push({ 
          description: "Calcular magnitud de v₂ (Norma Euclidiana)", 
          formula: `||v₂|| = √(${sumSq}) = ${formatNum(res)}` 
        });
      } else if (op === 'angle') {
        const dot = math.dot(vec1, vec2) as number;
        const n1 = math.norm(vec1) as number;
        const n2 = math.norm(vec2) as number;
        res = Math.acos(dot / (n1 * n2)) * (180 / Math.PI);
        steps.push({ description: "Calcular ángulo", formula: `θ = ${formatNum(res)}°` });
      }
      setResult(res);
      setWorksheetData({ title: `Operación: ${op.toUpperCase()}`, steps });
      setActiveSheet('WORKSHEET');
    } catch (e) {
      setResult('Error');
      setWorksheetData({ 
        title: "Error de Cálculo", 
        steps: [{ description: "Ocurrió un error durante el cálculo", result: e instanceof Error ? e.message : String(e) }] 
      });
      setActiveSheet('WORKSHEET');
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto gap-4 p-4 lg:p-6 overflow-hidden">
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex justify-end items-end">
          <div className="flex gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
            <button 
              onClick={() => setActiveSheet('EDITOR')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSheet === 'EDITOR' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              aria-label="Switch to Vector Editor"
            >
              Editor
            </button>
            <button 
              onClick={() => setActiveSheet('WORKSHEET')}
              disabled={!worksheetData}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSheet === 'WORKSHEET' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30'}`}
              aria-label="Switch to Vector Worksheet"
            >
              Worksheet
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSheet === 'EDITOR' ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0"
          >
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
              <section className="space-y-4">
                <div className="flex flex-col gap-1 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Vector Dimensions</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Dim:</span>
                    <input 
                      type="number" 
                      min="2" 
                      max="4" 
                      value={dim} 
                      onChange={(e) => {
                        const d = parseInt(e.target.value);
                        setDim(d);
                        setV1(Array(d).fill('0'));
                        setV2(Array(d).fill('0'));
                      }}
                      className="w-16 bg-surface-container-low border border-outline-variant/15 p-2 rounded-lg text-center font-mono focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex flex-col gap-1 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Operations</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'dot', name: 'Dot Product' },
                    { id: 'cross', name: 'Cross Product' },
                    { id: 'norm1', name: 'Magnitude A' },
                    { id: 'norm2', name: 'Magnitude B' },
                    { id: 'angle', name: 'Angle' },
                  ].map(op => (
                    <button
                      key={op.id}
                      onClick={() => calculate(op.id)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high hover:border-primary/40 transition-all group"
                      aria-label={`Calculate ${op.name}`}
                    >
                      <span className="text-xs font-bold tracking-wide">{op.name}</span>
                      <CornerDownRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-8">
              <section className="bg-surface-container-high border border-outline-variant/15 rounded-3xl p-6 lg:p-8 flex flex-col gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Vector v₁</span>
                    <div className="flex gap-2">
                      {v1.map((val, i) => (
                        <button
                          key={i}
                          onClick={() => { setActiveVector('v1'); setActiveIdx(i); }}
                          className={`flex-1 h-12 rounded-xl border transition-all flex items-center justify-center font-mono text-sm ${
                            activeVector === 'v1' && activeIdx === i ? 'bg-primary/10 border-primary text-primary scale-105 shadow-lg' : 'bg-surface-container-low border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                          aria-label={`Select component ${i + 1} of vector 1. Current value: ${val}`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Vector v₂</span>
                    <div className="flex gap-2">
                      {v2.map((val, i) => (
                        <button
                          key={i}
                          onClick={() => { setActiveVector('v2'); setActiveIdx(i); }}
                          className={`flex-1 h-12 rounded-xl border transition-all flex items-center justify-center font-mono text-sm ${
                            activeVector === 'v2' && activeIdx === i ? 'bg-primary/10 border-primary text-primary scale-105 shadow-lg' : 'bg-surface-container-low border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                          aria-label={`Select component ${i + 1} of vector 2. Current value: ${val}`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {['7', '8', '9', 'DEL'].map((k, i) => (
                    <TactileButton key={k} variant={i === 3 ? 'error' : 'default'} className="h-12 text-lg" onClick={() => handleKeyPress(k)} ariaLabel={i === 3 ? 'Delete last character' : `Number ${k}`}>{k}</TactileButton>
                  ))}
                  {['4', '5', '6', 'AC'].map((k, i) => (
                    <TactileButton key={k} variant={i === 3 ? 'error' : 'default'} className="h-12 text-lg" onClick={() => handleKeyPress(k)} ariaLabel={i === 3 ? 'All Clear' : `Number ${k}`}>{k}</TactileButton>
                  ))}
                  {['1', '2', '3', '-'].map((k) => (
                    <TactileButton key={k} className="h-12 text-lg" onClick={() => handleKeyPress(k)} ariaLabel={k === '-' ? 'Negative sign' : `Number ${k}`}>{k}</TactileButton>
                  ))}
                  <TactileButton className="h-12 text-lg" onClick={() => handleKeyPress('0')} ariaLabel="Number 0">0</TactileButton>
                  <TactileButton className="h-12 text-lg" onClick={() => handleKeyPress('.')} ariaLabel="Decimal point">.</TactileButton>
                  <TactileButton variant="ghost" className="col-span-2 h-12 text-[10px] font-bold tracking-widest uppercase" onClick={() => { setV1(Array(dim).fill('0')); setV2(Array(dim).fill('0')); }} ariaLabel="Reset both vectors to zero">Reset Vectors</TactileButton>
                </div>
              </section>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="worksheet"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-lg text-primary uppercase tracking-widest">{worksheetData?.title}</h3>
              <button 
                onClick={() => setActiveSheet('EDITOR')}
                className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
                aria-label="Close worksheet and return to editor"
              >
                <X className="w-4 h-4" /> Cerrar
              </button>
            </div>

            <div className="space-y-4">
              {worksheetData?.steps.map((step: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container-low border border-outline-variant/10 p-6 rounded-2xl space-y-4"
                >
                  <p className="text-sm font-bold text-on-surface">{step.description}</p>
                  <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 font-mono text-primary text-sm overflow-x-auto">
                    {step.formula}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
