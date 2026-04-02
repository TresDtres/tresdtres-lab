import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  Settings2, 
  Info, 
  Search, 
  Calculator, 
  Sigma, 
  Variable, 
  Layers,
  Zap,
  Activity,
  ArrowRightLeft,
  CornerDownRight,
  Maximize2,
  Minimize2,
  RefreshCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { math } from '../../lib/math';
import { TactileButton } from '../TactileButton';

interface GraphingScreenProps {
  isAdvanced: boolean;
}

export const GraphingScreen = ({ isAdvanced }: GraphingScreenProps) => {
  const { t } = useI18n();
  const [equations, setEquations] = useState<{id: string, expr: string, color: string, visible: boolean}[]>([
    { id: '1', expr: 'sin(x)', color: '#3b82f6', visible: true },
    { id: '2', expr: 'x^2', color: '#ef4444', visible: true }
  ]);
  const [range, setRange] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const isDark = document.documentElement.classList.contains('dark');
    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    for (let x = range.xMin; x <= range.xMax; x++) {
      const px = ((x - range.xMin) / (range.xMax - range.xMin)) * width;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
    for (let y = range.yMin; y <= range.yMax; y++) {
      const py = height - ((y - range.yMin) / (range.yMax - range.yMin)) * height;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    const originX = ((-range.xMin) / (range.xMax - range.xMin)) * width;
    const originY = height - ((-range.yMin) / (range.yMax - range.yMin)) * height;
    
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Draw Equations
    equations.forEach(eq => {
      if (!eq.visible) return;
      ctx.strokeStyle = eq.color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      let first = true;
      for (let px = 0; px < width; px++) {
        const x = range.xMin + (px / width) * (range.xMax - range.xMin);
        try {
          const y = math.evaluate(eq.expr, { x });
          const py = height - ((y - range.yMin) / (range.yMax - range.yMin)) * height;
          
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        } catch (e) {}
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    draw();
  }, [equations, range]);

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto gap-4 p-4 lg:p-6 overflow-hidden">
      <div className="flex justify-end items-center shrink-0">
        <div className="flex gap-2">
          <button 
            onClick={() => setRange({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })}
            className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10 text-primary hover:bg-primary hover:text-white transition-all"
            aria-label="Reset view range to default"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        <div className="lg:w-1/3 flex flex-col gap-4 shrink-0 overflow-y-auto pr-2 scrollbar-hide">
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Equations</span>
              <button 
                onClick={() => setEquations([...equations, { id: Date.now().toString(), expr: 'x', color: '#10b981', visible: true }])}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                aria-label="Add new equation"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {equations.map(eq => (
                <div key={eq.id} className="bg-surface-container-low border border-outline-variant/10 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: eq.color }}></div>
                    <input 
                      type="text" 
                      value={eq.expr}
                      onChange={(e) => setEquations(equations.map(q => q.id === eq.id ? { ...q, expr: e.target.value } : q))}
                      className="flex-1 bg-transparent font-mono text-sm outline-none font-bold text-on-surface"
                    />
                    <button 
                      onClick={() => setEquations(equations.map(q => q.id === eq.id ? { ...q, visible: !q.visible } : q))}
                      className="text-on-surface-variant/40 hover:text-primary transition-colors"
                      aria-label={eq.visible ? `Hide equation ${eq.expr}` : `Show equation ${eq.expr}`}
                    >
                      {eq.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => setEquations(equations.filter(q => q.id !== eq.id))}
                      className="text-on-surface-variant/40 hover:text-error transition-colors"
                      aria-label={`Remove equation ${eq.expr}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-1 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">View Range</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['xMin', 'xMax', 'yMin', 'yMax'].map(k => (
                <div key={k} className="flex flex-col gap-1">
                  <span className="text-[8px] font-bold uppercase opacity-40 ml-1">{k}</span>
                  <input 
                    type="number" 
                    value={range[k as keyof typeof range]}
                    onChange={(e) => setRange({ ...range, [k]: parseFloat(e.target.value) })}
                    className="w-full bg-surface-container-low border border-outline-variant/15 p-2 rounded-xl text-center font-mono text-xs focus:border-primary outline-none"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex-1 bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 shadow-inner relative overflow-hidden">
          <canvas 
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full cursor-crosshair"
          />
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button 
              onClick={() => setRange(prev => ({ ...prev, xMin: prev.xMin * 0.8, xMax: prev.xMax * 0.8, yMin: prev.yMin * 0.8, yMax: prev.yMax * 0.8 }))}
              className="p-3 rounded-xl bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
              aria-label="Zoom in"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setRange(prev => ({ ...prev, xMin: prev.xMin * 1.2, xMax: prev.xMax * 1.2, yMin: prev.yMin * 1.2, yMax: prev.yMax * 1.2 }))}
              className="p-3 rounded-xl bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
              aria-label="Zoom out"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
