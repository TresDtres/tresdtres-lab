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
  Ruler, 
  Weight, 
  Droplets, 
  Thermometer, 
  Square, 
  Zap, 
  Activity, 
  ArrowRightLeft, 
  CornerDownRight,
  Copy,
  Printer
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { math } from '../../lib/math';
import { TactileButton } from '../TactileButton';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { CODATA_2022, ConstantData } from '../../constants/codata';
import { exportToPDF } from '../../lib/pdfExport';
import { Latex } from '../Latex';

interface UnitsScreenProps {
  isAdvanced: boolean;
}

export const UnitsScreen = ({ isAdvanced }: UnitsScreenProps) => {
  const { t } = useI18n();
  const [mode, setMode] = useState<'BASIC' | 'DIMENSIONAL' | 'SOLUTIONS'>('BASIC');
  const [value, setValue] = useState('1');
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [result, setResult] = useState<string | null>(null);

  // Dimensional Analysis State
  const [dimValue, setDimValue] = useState('1');
  const [dimFromUnit, setDimFromUnit] = useState('km/h');
  const [dimToUnit, setDimToUnit] = useState('m/s');
  const [dimFactors, setDimFactors] = useState<{ value: string, from: string, to: string }[]>([
    { value: '1000', from: 'm', to: 'km' },
    { value: '3600', from: 's', to: 'h' }
  ]);

  // Solutions State
  const [solType, setSolType] = useState<'MOLARITY' | 'DILUTION'>('MOLARITY');
  const [solInputs, setSolInputs] = useState({
    c1: '', v1: '', c2: '', v2: '',
    mass: '', molarMass: '', volume: '',
    target: 'v1', // which variable to solve for
    massUnit: 'g',
    volumeUnit: 'L',
    c1Unit: 'M',
    c2Unit: 'M',
    v1Unit: 'mL',
    v2Unit: 'mL'
  });
  const [solResult, setSolResult] = useState<any>(null);

  const [activeSheet, setActiveSheet] = useState<'EDITOR' | 'WORKSHEET'>('EDITOR');
  const [worksheetData, setWorksheetData] = useState<any>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const [formatType, setFormatType] = useState<'fixed' | 'exponential' | 'auto'>('auto');
  const [precision, setPrecision] = useState(8);
  const [showCodata, setShowCodata] = useState(false);

  const [unitHistory, setUnitHistory] = useState<{value: string, from: string, to: string, result: string, category: string}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calculator-unit-history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('calculator-unit-history', JSON.stringify(unitHistory));
  }, [unitHistory]);

  const addToHistory = () => {
    if (result && result !== 'Error') {
      const newItem = { value, from: fromUnit, to: toUnit, result, category };
      setUnitHistory(prev => {
        if (prev.length > 0) {
          const last = prev[0];
          if (last.value === value && last.from === fromUnit && last.to === toUnit) return prev;
        }
        return [newItem, ...prev].slice(0, 10);
      });
    }
  };

  const reuseHistory = (item: any) => {
    setCategory(item.category);
    setValue(item.value);
    setFromUnit(item.from);
    setToUnit(item.to);
  };

  const categories = [
    { id: 'length', name: 'Length', icon: <Ruler className="w-4 h-4" />, units: ['m', 'km', 'cm', 'mm', 'mi', 'ft', 'in'] },
    { id: 'mass', name: 'Mass', icon: <Weight className="w-4 h-4" />, units: ['kg', 'g', 'mg', 'lb', 'oz'] },
    { id: 'volume', name: 'Volume', icon: <Droplets className="w-4 h-4" />, units: ['l', 'ml', 'm3', 'gal', 'cup'] },
    { id: 'temperature', name: 'Temp', icon: <Thermometer className="w-4 h-4" />, units: ['degC', 'degF', 'K'] },
    { id: 'area', name: 'Area', icon: <Square className="w-4 h-4" />, units: ['m2', 'km2', 'ha', 'acre', 'ft2'] },
    { id: 'force', name: 'Force', icon: <Zap className="w-4 h-4" />, units: ['N', 'lbf'] },
    ...(isAdvanced ? [
      { id: 'energy', name: 'Energy', icon: <Zap className="w-4 h-4" />, units: ['J', 'kJ', 'cal', 'kcal', 'kWh'] },
      { id: 'pressure', name: 'Pressure', icon: <Activity className="w-4 h-4" />, units: ['Pa', 'kPa', 'bar', 'psi', 'atm'] }
    ] : [])
  ];

  const currentCategory = categories.find(c => c.id === category);

  const solveSolutions = () => {
    const { c1, v1, c2, v2, mass, molarMass, volume, target, massUnit, volumeUnit, c1Unit, c2Unit, v1Unit, v2Unit } = solInputs;
    let steps = [];
    let finalResult = "";

    const toBaseConc = (val: string, unit: string) => {
      const v = parseFloat(val);
      if (unit === 'mM') return v / 1000;
      if (unit === 'µM') return v / 1000000;
      return v;
    };

    const fromBaseConc = (v: number, unit: string) => {
      if (unit === 'mM') return v * 1000;
      if (unit === 'µM') return v * 1000000;
      return v;
    };

    const toBaseVol = (val: string, unit: string) => {
      const v = parseFloat(val);
      if (unit === 'mL') return v / 1000;
      if (unit === 'µL') return v / 1000000;
      return v;
    };

    const fromBaseVol = (v: number, unit: string) => {
      if (unit === 'mL') return v * 1000;
      if (unit === 'µL') return v * 1000000;
      return v;
    };

    if (solType === 'DILUTION') {
      const C1 = toBaseConc(c1, c1Unit);
      const V1 = toBaseVol(v1, v1Unit);
      const C2 = toBaseConc(c2, c2Unit);
      const V2 = toBaseVol(v2, v2Unit);
      
      steps.push({
        description: "Identificar la ecuación de dilución",
        formula: "C₁V₁ = C₂V₂",
      });

      let solvedValue = 0;
      if (target === 'v1') {
        solvedValue = (C2 * V2) / C1;
        const displayVal = fromBaseVol(solvedValue, v1Unit);
        steps.push({
          description: `Despejar V₁ (${v1Unit})`,
          formula: `V₁ = (C₂ · V₂) / C₁\nV₁ = (${C2} M · ${V2} L) / ${C1} M`,
          result: `V₁ = ${displayVal.toFixed(4)} ${v1Unit}`
        });
        finalResult = `${displayVal.toFixed(4)} ${v1Unit}`;
      } else if (target === 'c1') {
        solvedValue = (C2 * V2) / V1;
        const displayVal = fromBaseConc(solvedValue, c1Unit);
        steps.push({
          description: `Despejar C₁ (${c1Unit})`,
          formula: `C₁ = (C₂ · V₂) / V₁\nC₁ = (${C2} M · ${V2} L) / ${V1} L`,
          result: `C₁ = ${displayVal.toFixed(4)} ${c1Unit}`
        });
        finalResult = `${displayVal.toFixed(4)} ${c1Unit}`;
      } else if (target === 'v2') {
        solvedValue = (C1 * V1) / C2;
        const displayVal = fromBaseVol(solvedValue, v2Unit);
        steps.push({
          description: `Despejar V₂ (${v2Unit})`,
          formula: `V₂ = (C₁ · V₁) / C₂\nV₂ = (${C1} M · ${V1} L) / ${C2} M`,
          result: `V₂ = ${displayVal.toFixed(4)} ${v2Unit}`
        });
        finalResult = `${displayVal.toFixed(4)} ${v2Unit}`;
      } else if (target === 'c2') {
        solvedValue = (C1 * V1) / V2;
        const displayVal = fromBaseConc(solvedValue, c2Unit);
        steps.push({
          description: `Despejar C₂ (${c2Unit})`,
          formula: `C₂ = (C₁ · V₁) / V₂\nC₂ = (${C1} M · ${V1} L) / ${V2} L`,
          result: `C₂ = ${displayVal.toFixed(4)} ${c2Unit}`
        });
        finalResult = `${displayVal.toFixed(4)} ${c2Unit}`;
      }
    } else {
      let m = parseFloat(solInputs.mass);
      if (solInputs.massUnit === 'mg') m /= 1000;
      if (solInputs.massUnit === 'kg') m *= 1000;
      
      const mw = parseFloat(solInputs.molarMass);
      
      let v = parseFloat(solInputs.volume);
      if (solInputs.volumeUnit === 'mL') v /= 1000;
      if (solInputs.volumeUnit === 'µL') v /= 1000000;

      const molarity = m / (mw * v);

      steps.push({
        description: "Fórmulas de Molaridad",
        formula: "n = m / PM\nM = n / V",
      });
      steps.push({
        description: "Calcular moles (n)",
        formula: `n = ${m} g / ${mw} g/mol`,
        result: `n = ${(m/mw).toFixed(4)} mol`
      });
      steps.push({
        description: "Calcular Molaridad (M)",
        formula: `M = ${(m/mw).toFixed(4)} mol / ${v} L`,
        result: `M = ${molarity.toFixed(4)} mol/L`
      });
      finalResult = `${molarity.toFixed(4)} M`;
    }

    setWorksheetData({ 
      title: solType === 'DILUTION' ? "Análisis de Dilución" : "Cálculo de Molaridad", 
      steps 
    });
    setCurrentStepIdx(0);
    setActiveSheet('WORKSHEET');
    setSolResult(finalResult);
  };

  const solveDimensional = () => {
    let steps = [];
    let currentValue = math.evaluate(dimValue);
    let currentUnit = dimFromUnit;

    const formatVal = (val: any) => {
      return math.format(val, {
        notation: formatType === 'auto' ? 'auto' : formatType,
        precision: precision
      });
    };

    steps.push({
      description: "Valor Inicial",
      formula: `${formatVal(currentValue)} [${currentUnit}]`,
    });

    dimFactors.forEach((factor, i) => {
      const fVal = math.evaluate(factor.value);
      const nextValue = math.multiply(currentValue, fVal);
      
      const stepFormula = `${formatVal(currentValue)} [${currentUnit}] · (${factor.value} [${factor.to}] / 1 [${factor.from}])`;
      
      let description = t('units.conversion_factor', { idx: i + 1, from: factor.from, to: factor.to });
      if (currentUnit.toLowerCase() === factor.from.toLowerCase()) {
        description += `\n${t('units.units_cancel', { unit: currentUnit })}`;
      }
      
      steps.push({
        description,
        formula: stepFormula,
        result: `${formatVal(nextValue)} [${factor.to}]`
      });
      
      currentValue = nextValue;
      currentUnit = factor.to;
    });

    setWorksheetData({ title: t('units.dimensional_analysis'), steps });
    setCurrentStepIdx(0);
    setActiveSheet('WORKSHEET');
  };

  useEffect(() => {
    const toMathJSUnit = (u: string) => {
      const mapping: Record<string, string> = {
        'm2': 'm^2',
        'km2': 'km^2',
        'ft2': 'ft^2',
        'm3': 'm^3',
        'l': 'L',
        'ml': 'mL',
      };
      return mapping[u] || u;
    };

    try {
      const from = toMathJSUnit(fromUnit);
      const to = toMathJSUnit(toUnit);
      
      const res = math.unit(Number(value), from).to(to);
      const val = res.toNumber(to);
      
      let formatted;
      if (formatType === 'fixed') {
        formatted = math.format(val, { notation: 'fixed', precision: precision });
      } else if (formatType === 'exponential') {
        formatted = math.format(val, { notation: 'exponential', precision: precision + 1 });
      } else {
        formatted = math.format(val, { precision: precision + 2, lowerExp: -4, upperExp: 7 });
      }
      
      setResult(`${formatted} ${toUnit}`);
    } catch (err) {
      setResult('Error');
    }
  }, [value, fromUnit, toUnit, formatType, precision]);

  const handleKeyPress = (key: string) => {
    if (key === 'DEL') setValue(prev => prev.slice(0, -1) || '0');
    else if (key === 'AC') setValue('0');
    else if (/[0-9.]/.test(key)) setValue(prev => prev === '0' ? key : prev + key);
  };

  useKeyboardInput(handleKeyPress);

  return (
    <div className={`space-y-8 lg:space-y-12 ${isAdvanced ? 'font-sans' : ''}`}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-end items-end">
          <div className="flex gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
            <button 
              onClick={() => setActiveSheet('EDITOR')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSheet === 'EDITOR' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              aria-label="Switch to Unit Editor"
            >
              {t('units.editor')}
            </button>
            <button 
              onClick={() => setActiveSheet('WORKSHEET')}
              disabled={!worksheetData}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSheet === 'WORKSHEET' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30'}`}
              aria-label="Switch to Unit Worksheet"
            >
              {t('units.worksheet')}
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
            className="space-y-8"
          >
            <section className={`${isAdvanced ? 'bg-surface-container-lowest border-primary/20 shadow-xl' : 'bg-surface-container-high border-outline-variant/15'} rounded-3xl p-8 lg:p-10 border min-h-[220px] flex flex-col justify-between relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="font-headline text-[10px] uppercase tracking-[0.2rem] text-on-surface-variant font-bold opacity-40">
                    {t('units.mode_selection')}
                  </span>
                  <div className="h-0.5 w-8 bg-primary/40"></div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button 
                    onClick={() => setMode('BASIC')}
                    className={`text-[9px] font-bold px-3 py-1.5 rounded-lg border transition-all uppercase tracking-widest ${mode === 'BASIC' ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-low'}`}
                    aria-label="Basic unit conversion mode"
                  >
                    {t('units.basic')}
                  </button>
                  <button 
                    onClick={() => setMode('DIMENSIONAL')}
                    className={`text-[9px] font-bold px-3 py-1.5 rounded-lg border transition-all uppercase tracking-widest ${mode === 'DIMENSIONAL' ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-low'}`}
                    aria-label="Dimensional analysis mode"
                  >
                    {t('units.dimensional')}
                  </button>
                  <button 
                    onClick={() => setMode('SOLUTIONS')}
                    className={`text-[9px] font-bold px-3 py-1.5 rounded-lg border transition-all uppercase tracking-widest ${mode === 'SOLUTIONS' ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-low'}`}
                    aria-label="Chemical solutions mode"
                  >
                    {t('units.solutions')}
                  </button>
                </div>
              </div>

              <div className="relative z-10 py-6">
                {mode === 'BASIC' ? (
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center lg:items-start gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-60">{t('units.from')}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-4xl lg:text-6xl font-black text-on-surface">{value}</span>
                        <span className="text-xl font-bold text-on-surface-variant opacity-60">{fromUnit}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        const temp = fromUnit;
                        setFromUnit(toUnit);
                        setToUnit(temp);
                      }}
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all active:scale-90 ${isAdvanced ? 'bg-primary text-white shadow-lg hover:shadow-primary/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                      aria-label="Swap from and to units"
                    >
                      <ArrowRightLeft className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col items-center lg:items-end gap-2 group relative">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-60">{t('units.to')}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-4xl lg:text-6xl font-black text-primary">{result?.split(' ')[0] || '0'}</span>
                        <span className="text-xl font-bold text-on-surface-variant opacity-60">{toUnit}</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (result) {
                            navigator.clipboard.writeText(result.split(' ')[0]);
                          }
                        }}
                        className="lg:absolute lg:-right-10 lg:top-1/2 lg:-translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Copy value"
                        aria-label="Copy result value to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : mode === 'DIMENSIONAL' ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2 mb-2">
                      <button 
                        onClick={() => setShowCodata(!showCodata)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                          showCodata ? 'bg-primary text-white shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                        aria-label={showCodata ? 'Hide CODATA physical constants' : 'Show CODATA physical constants'}
                      >
                        <Zap className="w-4 h-4" />
                        {showCodata ? 'Hide Constants' : 'Physical Constants (CODATA 2022)'}
                      </button>
                      <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">High-Precision Mode Active</span>
                    </div>

                    <AnimatePresence>
                      {showCodata && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="w-full overflow-hidden"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-surface-container-low border border-outline-variant/15 rounded-2xl mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                            {(Object.entries(CODATA_2022) as [string, ConstantData][]).map(([key, constant]) => (
                              <button
                                key={key}
                                onClick={() => {
                                  setDimFactors([...dimFactors, { 
                                    value: constant.value.toString(), 
                                    from: '1', 
                                    to: constant.unit 
                                  }]);
                                  setShowCodata(false);
                                }}
                                className="flex flex-col items-start p-3 rounded-xl border border-outline-variant/10 hover:border-primary/40 hover:bg-primary/5 transition-all group text-left"
                                aria-label={`Add constant: ${constant.name}. Value: ${constant.value.toExponential(4)} ${constant.unit}`}
                              >
                                <div className="flex justify-between w-full items-center mb-1">
                                  <span className="text-[10px] font-black text-primary truncate mr-2">{constant.name}</span>
                                  <span className="text-[8px] font-mono text-on-surface-variant/40 shrink-0">{key}</span>
                                </div>
                                <div className="flex justify-between w-full items-center">
                                  <span className="text-[9px] font-mono text-on-surface truncate">{constant.value.toExponential(8)}</span>
                                  <span className="text-[8px] font-bold text-primary/60 shrink-0 ml-2">{constant.unit}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <input 
                          type="text" 
                          value={dimValue}
                          onChange={(e) => setDimValue(e.target.value)}
                          placeholder={t('common.value')}
                          className="w-20 bg-surface-container-low border border-outline-variant/15 p-2 rounded-lg text-center font-mono text-xl focus:border-primary outline-none"
                        />
                        <span className="text-[8px] font-bold uppercase opacity-30">{t('common.value')}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <input 
                          type="text" 
                          value={dimFromUnit}
                          onChange={(e) => setDimFromUnit(e.target.value)}
                          placeholder="Unit"
                          className="w-20 bg-surface-container-low border border-outline-variant/15 p-2 rounded-lg text-center font-mono text-xl focus:border-primary outline-none"
                        />
                        <span className="text-[8px] font-bold uppercase opacity-30">Unit</span>
                      </div>
                      {dimFactors.map((f, i) => (
                        <React.Fragment key={i}>
                          <div className="text-2xl opacity-30">×</div>
                          <div className="flex flex-col items-center gap-1 bg-primary/5 p-2 rounded-xl border border-primary/10 relative group">
                            <button 
                              onClick={() => {
                                const newF = [...dimFactors];
                                newF.splice(i, 1);
                                setDimFactors(newF);
                              }}
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              aria-label={`Remove conversion factor ${i + 1}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="flex flex-col items-center border-b border-primary/20 pb-1">
                              <input 
                                type="text" 
                                value={f.value}
                                onChange={(e) => {
                                  const newF = [...dimFactors];
                                  newF[i].value = e.target.value;
                                  setDimFactors(newF);
                                }}
                                className="w-16 bg-transparent text-center font-mono text-sm focus:text-primary outline-none"
                              />
                              <input 
                                type="text" 
                                value={f.to}
                                onChange={(e) => {
                                  const newF = [...dimFactors];
                                  newF[i].to = e.target.value;
                                  setDimFactors(newF);
                                }}
                                placeholder="To"
                                className="w-16 bg-transparent text-center font-mono text-xs opacity-60 focus:text-primary outline-none"
                              />
                            </div>
                            <input 
                              type="text" 
                              value={f.from}
                              onChange={(e) => {
                                const newF = [...dimFactors];
                                newF[i].from = e.target.value;
                                setDimFactors(newF);
                              }}
                              placeholder="From"
                              className="w-16 bg-transparent text-center font-mono text-xs opacity-60 focus:text-primary outline-none"
                            />
                          </div>
                        </React.Fragment>
                      ))}
                      <button 
                        onClick={() => setDimFactors([...dimFactors, { value: '1', from: '?', to: '?' }])}
                        className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                        title="Add Factor"
                        aria-label="Add new conversion factor"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDimFactors([])}
                        className="p-2 rounded-full bg-error/10 text-error hover:bg-error hover:text-white transition-all"
                        title="Clear Factors"
                        aria-label="Clear all conversion factors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <TactileButton variant="primary" className="px-8 h-12 text-[10px] font-black tracking-widest" onClick={solveDimensional}>
                      ANALYZE CHAIN
                    </TactileButton>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex gap-4 mb-4">
                      <button 
                        onClick={() => setSolType('MOLARITY')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${solType === 'MOLARITY' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}
                        aria-label="Molarity calculation mode"
                      >
                        Molarity
                      </button>
                      <button 
                        onClick={() => setSolType('DILUTION')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${solType === 'DILUTION' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}
                        aria-label="Dilution calculation mode"
                      >
                        Dilution
                      </button>
                    </div>
                    {solType === 'MOLARITY' ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-bold uppercase opacity-40">Mass</span>
                            <select 
                              value={solInputs.massUnit}
                              onChange={(e) => setSolInputs({...solInputs, massUnit: e.target.value})}
                              className="text-[8px] font-bold bg-transparent outline-none text-primary"
                            >
                              <option value="mg">mg</option>
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                            </select>
                          </div>
                          <input 
                            type="text" 
                            value={solInputs.mass}
                            onChange={(e) => setSolInputs({...solInputs, mass: e.target.value})}
                            className="w-full bg-surface-container-low border border-outline-variant/15 p-3 rounded-xl text-center font-mono focus:border-primary outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-bold uppercase opacity-40">Molar Mass (g/mol)</span>
                          <input 
                            type="text" 
                            value={solInputs.molarMass}
                            onChange={(e) => setSolInputs({...solInputs, molarMass: e.target.value})}
                            className="w-full bg-surface-container-low border border-outline-variant/15 p-3 rounded-xl text-center font-mono focus:border-primary outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-bold uppercase opacity-40">Volume</span>
                            <select 
                              value={solInputs.volumeUnit}
                              onChange={(e) => setSolInputs({...solInputs, volumeUnit: e.target.value})}
                              className="text-[8px] font-bold bg-transparent outline-none text-primary"
                            >
                              <option value="µL">µL</option>
                              <option value="mL">mL</option>
                              <option value="L">L</option>
                            </select>
                          </div>
                          <input 
                            type="text" 
                            value={solInputs.volume}
                            onChange={(e) => setSolInputs({...solInputs, volume: e.target.value})}
                            className="w-full bg-surface-container-low border border-outline-variant/15 p-3 rounded-xl text-center font-mono focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {['c1', 'v1', 'c2', 'v2'].map(key => (
                          <div key={key} className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <span className="text-[8px] font-bold uppercase opacity-40">{key.toUpperCase()}</span>
                                <select 
                                  value={solInputs[`${key}Unit` as keyof typeof solInputs]}
                                  onChange={(e) => setSolInputs({...solInputs, [`${key}Unit`]: e.target.value})}
                                  className="text-[8px] font-bold bg-transparent outline-none text-primary"
                                >
                                  {key.startsWith('c') ? (
                                    <>
                                      <option value="µM">µM</option>
                                      <option value="mM">mM</option>
                                      <option value="M">M</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value="µL">µL</option>
                                      <option value="mL">mL</option>
                                      <option value="L">L</option>
                                    </>
                                  )}
                                </select>
                              </div>
                              <input 
                                type="radio" 
                                name="target" 
                                checked={solInputs.target === key}
                                onChange={() => setSolInputs({...solInputs, target: key})}
                                className="w-3 h-3 accent-primary"
                              />
                            </div>
                            <input 
                              type="text" 
                              disabled={solInputs.target === key}
                              value={solInputs[key as keyof typeof solInputs]}
                              onChange={(e) => setSolInputs({...solInputs, [key]: e.target.value})}
                              className={`w-full p-3 rounded-xl text-center font-mono outline-none border ${solInputs.target === key ? 'bg-primary/5 border-primary/20 text-primary font-black' : 'bg-surface-container-low border-outline-variant/15 focus:border-primary'}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <TactileButton variant="primary" className="px-8 h-12 text-[10px] font-black tracking-widest" onClick={solveSolutions}>
                      CALCULATE SOLUTION
                    </TactileButton>
                  </div>
                )}
              </div>
            </section>

            {mode === 'BASIC' && (
              <div className="space-y-8">
                <div className="flex justify-center">
                  <button 
                    onClick={addToHistory}
                    disabled={!result || result === 'Error'}
                    className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                    aria-label="Save current conversion to history"
                  >
                    <History className="w-4 h-4" />
                    Save Conversion
                  </button>
                </div>

                {unitHistory.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-primary/40" />
                      <span className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/40">Conversion History</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {unitHistory.map((item, idx) => (
                        <button 
                          key={idx}
                          onClick={() => reuseHistory(item)}
                          className="flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant/10 rounded-2xl hover:border-primary/40 transition-all group"
                          aria-label={`Reuse conversion: ${item.value} ${item.from} to ${item.result.split(' ')[0]} ${item.to}`}
                        >
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/40">{item.category}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold">{item.value} {item.from}</span>
                              <ArrowRightLeft className="w-3 h-3 text-primary/40" />
                              <span className="font-mono text-xs font-bold text-primary">{item.result.split(' ')[0]} {item.to}</span>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <CornerDownRight className="w-4 h-4 text-primary" />
                          </div>
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setUnitHistory([])}
                      className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/40 hover:text-error transition-colors"
                      aria-label="Clear all conversion history"
                    >
                      Clear History
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                  <section className="space-y-6">
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Categories</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setCategory(c.id);
                            setFromUnit(c.units[0]);
                            setToUnit(c.units[1] || c.units[0]);
                          }}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                            category === c.id ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-surface-container-low border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                          aria-label={`Select category: ${c.name}`}
                        >
                          <div className={`${category === c.id ? 'text-white' : 'text-primary'} opacity-80`}>{c.icon}</div>
                          <span className="text-xs font-bold tracking-wide">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Units</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/40 ml-1">Convert From</label>
                        <select 
                          value={fromUnit} 
                          onChange={(e) => setFromUnit(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-on-surface outline-none focus:border-primary transition-colors"
                        >
                          {currentCategory?.units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/40 ml-1">Convert To</label>
                        <select 
                          value={toUnit} 
                          onChange={(e) => setToUnit(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-on-surface outline-none focus:border-primary transition-colors"
                        >
                          {currentCategory?.units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Display Format</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/40 ml-1">Notation</label>
                        <select 
                          value={formatType} 
                          onChange={(e) => setFormatType(e.target.value as any)}
                          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm font-bold text-on-surface outline-none focus:border-primary transition-colors"
                        >
                          <option value="auto">Auto</option>
                          <option value="fixed">Fixed</option>
                          <option value="exponential">Scientific</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/40">Decimal Places</label>
                          <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{precision}</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={precision} 
                          onChange={(e) => setPrecision(Number(e.target.value))}
                          className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between px-1">
                          <span className="text-[8px] font-bold text-on-surface-variant/30">1</span>
                          <span className="text-[8px] font-bold text-on-surface-variant/30">10</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Value Input</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', 'DEL'].map((k) => (
                        <TactileButton 
                          key={k} 
                          variant={k === 'DEL' ? 'error' : 'default'} 
                          className="h-14 text-xl" 
                          onClick={() => handleKeyPress(k)}
                          ariaLabel={k === 'DEL' ? 'Delete last character' : `Number ${k}`}
                        >
                          {k}
                        </TactileButton>
                      ))}
                      <TactileButton 
                        variant="error" 
                        className="col-span-3 h-14 text-[10px] font-bold tracking-[0.2rem] uppercase" 
                        onClick={() => handleKeyPress('AC')}
                        ariaLabel="Clear all input"
                      >
                        Clear All
                      </TactileButton>
                    </div>
                  </section>
                </div>
              </div>
            )}
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
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      if (worksheetData) {
                        const content = worksheetData.steps.flatMap((s: any, i: number) => [
                          `Paso ${i + 1}: ${s.description}`,
                          s.formula || '',
                          s.result ? `Resultado: ${s.result}` : '',
                          '-------------------'
                        ]);
                        exportToPDF({
                          title: worksheetData.title,
                          subtitle: `Generated by TRESDTRES LAB - ${new Date().toLocaleString()}`,
                          content,
                          filename: `unidades_${worksheetData.title.toLowerCase().replace(/\s+/g, '_')}.pdf`
                        });
                      }
                    }}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    title="Export to PDF"
                    aria-label="Export worksheet to PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentStepIdx === 0}
                    className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:text-primary disabled:opacity-30 transition-all"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center px-3 bg-surface-container-low border border-outline-variant/20 rounded-lg text-[10px] font-bold text-on-surface-variant">
                    {currentStepIdx + 1} / {worksheetData?.steps.length}
                  </div>
                  <button 
                    onClick={() => setCurrentStepIdx(prev => Math.min((worksheetData?.steps.length || 1) - 1, prev + 1))}
                    disabled={currentStepIdx === (worksheetData?.steps.length || 1) - 1}
                    className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:text-primary disabled:opacity-30 transition-all"
                    aria-label="Next step"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => setActiveSheet('EDITOR')}
                  className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
                  aria-label="Close worksheet and return to editor"
                >
                  <X className="w-4 h-4" /> Cerrar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {worksheetData?.steps.map((step: any, idx: number) => (
                idx === currentStepIdx && (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-surface-container-low border border-outline-variant/10 p-8 rounded-[2.5rem] space-y-6 shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    <div className="flex items-start gap-6 relative z-10">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-sm font-black shrink-0 shadow-inner">
                        {idx + 1}
                      </div>
                      <div className="space-y-4 flex-1">
                        <p className="text-base font-bold text-on-surface tracking-tight">{step.description}</p>
                        {step.formula && (
                          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 flex justify-center items-center">
                            <Latex formula={step.formula} displayMode={true} className="text-primary text-xl lg:text-2xl" />
                          </div>
                        )}
                        {step.result && (
                          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/10">
                            <div className="px-2 py-1 rounded bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest">
                              Resultado
                            </div>
                            <span className="text-2xl font-black text-on-surface font-mono">{step.result}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
