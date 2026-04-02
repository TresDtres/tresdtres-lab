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
  RotateCcw,
  BarChart2,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { math } from '../../lib/math';
import { TactileButton } from '../TactileButton';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface StatisticsScreenProps {
  isAdvanced: boolean;
}

export const StatisticsScreen = ({ isAdvanced }: StatisticsScreenProps) => {
  const { t } = useI18n();
  const [data, setData] = useState<string[]>(['10', '20', '30', '40', '50']);
  const [activeIdx, setActiveIdx] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [activeSheet, setActiveSheet] = useState<'EDITOR' | 'WORKSHEET'>('EDITOR');

  const handleKeyPress = (key: string) => {
    if (key === 'DEL') {
      const newData = [...data];
      newData[activeIdx] = newData[activeIdx].slice(0, -1) || '0';
      setData(newData);
    } else if (key === 'AC') {
      const newData = [...data];
      newData[activeIdx] = '0';
      setData(newData);
    } else if (/[0-9.-]/.test(key)) {
      const newData = [...data];
      const currentVal = newData[activeIdx];
      newData[activeIdx] = currentVal === '0' ? key : currentVal + key;
      setData(newData);
    }
  };

  useKeyboardInput(handleKeyPress);

  const calculateStats = () => {
    const nums = data.map(d => parseFloat(d)).filter(n => !isNaN(n));
    if (nums.length === 0) return;

    const mean = math.mean(nums);
    const median = math.median(nums);
    const std = math.std(nums);
    const variance = math.variance(nums);
    const min = math.min(nums);
    const max = math.max(nums);
    const sum = math.sum(nums);

    setStats({ mean, median, std, variance, min, max, sum, count: nums.length });
    setActiveSheet('WORKSHEET');
  };

  const chartData = data.map((d, i) => ({ name: `P${i+1}`, value: parseFloat(d) || 0 }));

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto gap-4 p-4 lg:p-6 overflow-hidden">
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex justify-end items-end">
          <div className="flex gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
            <button 
              onClick={() => setActiveSheet('EDITOR')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSheet === 'EDITOR' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              aria-label="Switch to Data Editor"
            >
              Data Editor
            </button>
            <button 
              onClick={() => setActiveSheet('WORKSHEET')}
              disabled={!stats}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSheet === 'WORKSHEET' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30'}`}
              aria-label="Switch to Statistical Analysis"
            >
              Analysis
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
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Data Points</span>
                  <button 
                    onClick={() => setData([...data, '0'])}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    aria-label="Add new data point"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.map((d, i) => (
                    <div key={i} className="relative group">
                      <button
                        onClick={() => setActiveIdx(i)}
                        className={`w-full h-12 rounded-xl border transition-all flex items-center justify-center font-mono text-sm ${
                          activeIdx === i ? 'bg-primary/10 border-primary text-primary scale-105 shadow-lg' : 'bg-surface-container-low border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                        aria-label={`Select data point ${i + 1}. Current value: ${d}`}
                      >
                        {d}
                      </button>
                      {data.length > 1 && (
                        <button 
                          onClick={() => {
                            const newData = data.filter((_, idx) => idx !== i);
                            setData(newData);
                            if (activeIdx >= newData.length) setActiveIdx(newData.length - 1);
                          }}
                          className="absolute -top-2 -right-2 bg-error text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Remove data point ${i + 1}`}
                        >
                          <X className="w-2 h-2" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex flex-col gap-1 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Visualization</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { id: 'bar', icon: <BarChart2 className="w-4 h-4" />, name: 'Bar Chart' },
                    { id: 'line', icon: <TrendingUp className="w-4 h-4" />, name: 'Line Chart' },
                    { id: 'area', icon: <PieChart className="w-4 h-4" />, name: 'Area Chart' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setChartType(t.id as any)}
                      className={`p-3 rounded-xl border transition-all ${
                        chartType === t.id ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-low border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                      aria-label={`Switch to ${t.name} visualization`}
                    >
                      {t.icon}
                    </button>
                  ))}
                </div>
                <div className="h-48 bg-surface-container-low rounded-2xl border border-outline-variant/10 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : chartType === 'line' ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-primary)' }} />
                      </LineChart>
                    ) : (
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-8">
              <section className="bg-surface-container-high border border-outline-variant/15 rounded-3xl p-6 lg:p-8 flex flex-col gap-6">
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
                  <TactileButton variant="primary" className="col-span-2 h-12 text-[10px] font-black tracking-widest uppercase" onClick={calculateStats} ariaLabel="Calculate statistical analysis">Calculate Stats</TactileButton>
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
              <h3 className="font-headline font-bold text-lg text-primary uppercase tracking-widest">Statistical Analysis</h3>
              <button 
                onClick={() => setActiveSheet('EDITOR')}
                className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
                aria-label="Close analysis and return to editor"
              >
                <X className="w-4 h-4" /> Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Mean', value: stats.mean },
                { label: 'Median', value: stats.median },
                { label: 'Std Dev', value: stats.std },
                { label: 'Variance', value: stats.variance },
                { label: 'Min', value: stats.min },
                { label: 'Max', value: stats.max },
                { label: 'Sum', value: stats.sum },
                { label: 'Count', value: stats.count },
              ].map((s, i) => (
                <div key={i} className="bg-surface-container-low border border-outline-variant/10 p-6 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">{s.label}</span>
                  <span className="text-xl font-black text-primary font-mono">{typeof s.value === 'number' ? s.value.toFixed(4) : s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
