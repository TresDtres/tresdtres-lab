import React from 'react';
import { motion } from 'motion/react';
import { 
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
  HashIcon,
  BarChart2,
  TrendingUp,
  PieChart,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  Microscope,
  Atom,
  Dna,
  TestTube2,
  Maximize2,
  Minimize2,
  RefreshCcw,
  Eye,
  EyeOff,
  LayoutGrid,
  History,
  Languages,
  Database,
  Moon,
  Sun,
  Monitor,
  Shield,
  Keyboard
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Mode } from '../../types';

interface MoreScreenProps {
  setMode: (m: Mode) => void;
  isAdvanced: boolean;
  isGraphingEnabled: boolean;
  onSettings: () => void;
}

export const MoreScreen = ({ setMode, isAdvanced, isGraphingEnabled, onSettings }: MoreScreenProps) => {
  const { t } = useI18n();

  const modes = [
    { id: Mode.Scientific, name: 'Scientific', icon: <Calculator className="w-6 h-6" />, color: 'bg-blue-500' },
    { id: Mode.Matrices, name: 'Matrices', icon: <Layers className="w-6 h-6" />, color: 'bg-purple-500' },
    { id: Mode.Vectors, name: 'Vectors', icon: <Variable className="w-6 h-6" />, color: 'bg-indigo-500' },
    { id: Mode.Statistics, name: 'Statistics', icon: <Sigma className="w-6 h-6" />, color: 'bg-green-500' },
    { id: Mode.Equations, name: 'Equations', icon: <Activity className="w-6 h-6" />, color: 'bg-orange-500' },
    { id: Mode.Units, name: 'Units', icon: <ArrowRightLeft className="w-6 h-6" />, color: 'bg-teal-500' },
    { id: Mode.Complex, name: 'Complex', icon: <Atom className="w-6 h-6" />, color: 'bg-pink-500' },
    { id: Mode.LabAI, name: 'Lab AI', icon: <Bot className="w-6 h-6" />, color: 'bg-cyan-500' },
    { id: Mode.Programmer, name: 'Programmer', icon: <Cpu className="w-6 h-6" />, color: 'bg-slate-500' },
    { id: Mode.Constants, name: 'Constants', icon: <Database className="w-6 h-6" />, color: 'bg-amber-500' },
    { id: Mode.Algebra, name: 'Algebra', icon: <Variable className="w-6 h-6" />, color: 'bg-orange-600' },
    ...(isGraphingEnabled ? [{ id: Mode.Graphing, name: 'Graphing', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-rose-500' }] : []),
  ];

  const quickSettings = [
    { id: 'settings', name: 'Settings', icon: <Settings2 className="w-5 h-5" />, action: onSettings },
    { id: 'history', name: 'History', icon: <History className="w-5 h-5" />, action: () => {} },
    { id: 'help', name: 'Help', icon: <HelpCircle className="w-5 h-5" />, action: () => {} },
    { id: 'shortcuts', name: 'Shortcuts', icon: <Keyboard className="w-5 h-5" />, action: onSettings },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-8 p-4 lg:p-8 overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-2 shrink-0">
        <span className="text-on-surface font-black text-xs font-headline tracking-[0.3rem] uppercase opacity-40">
          {isAdvanced ? 'System Hub Diagnostics' : 'System Hub'}
        </span>
        <div className="h-1 w-16 bg-primary/40 rounded-full"></div>
      </div>

      <section className="space-y-6">
        <div className="flex flex-col gap-1 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Available Modules</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-high hover:border-primary/40 hover:scale-105 active:scale-95 transition-all group shadow-sm"
              aria-label={`Switch to ${m.name} mode`}
            >
              <div className={`w-14 h-14 rounded-2xl ${m.color} text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                {m.icon}
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">{m.name}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Quick Actions</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickSettings.map(s => (
              <button
                key={s.id}
                onClick={s.action}
                className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-high hover:border-primary/40 transition-all group"
                aria-label={`Open ${s.name}`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <span className="text-xs font-bold tracking-wide text-on-surface-variant group-hover:text-primary transition-colors">{s.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="p-8 bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 border-dashed flex flex-col justify-center items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase tracking-widest text-on-surface">Advanced Mode Active</h4>
            <p className="text-[11px] text-on-surface-variant/60 leading-relaxed uppercase tracking-wider max-w-[280px]">
              You are currently using the experimental diagnostics interface. All system modules are unlocked and running at peak precision.
            </p>
          </div>
          <button 
            onClick={onSettings}
            className="mt-2 px-6 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
            aria-label="Configure system settings"
          >
            Configure System
          </button>
        </section>
      </div>
    </div>
  );
};
