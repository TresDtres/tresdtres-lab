import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Variable, 
  Calculator, 
  Zap, 
  Activity, 
  RotateCcw,
  Hash,
  Sigma,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { math, toLatex } from '../../lib/math';
import { TactileButton } from '../TactileButton';
import { Latex } from '../Latex';

interface AlgebraScreenProps {
  isAdvanced: boolean;
}

export const AlgebraScreen = ({ isAdvanced }: AlgebraScreenProps) => {
  const { t } = useI18n();
  const [expression, setExpression] = useState('2x + 5x');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [simplified, setSimplified] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [factored, setFactored] = useState<string | null>(null);

  // Detect variables in the expression
  useEffect(() => {
    try {
      const node = math.parse(expression.replace(/·/g, '*').replace(/÷/g, '/'));
      const foundVars: string[] = [];
      node.traverse((node) => {
        if (math.isSymbolNode(node) && !math[node.name]) {
          if (!foundVars.includes(node.name)) {
            foundVars.push(node.name);
          }
        }
      });

      const newVars: Record<string, string> = {};
      foundVars.forEach(v => {
        newVars[v] = variables[v] || '0';
      });
      setVariables(newVars);
      
      // Auto-simplify
      const simp = math.simplify(node).toString();
      setSimplified(toLatex(simp));
    } catch (e) {
      // Invalid expression
    }
  }, [expression]);

  const handleEvaluate = () => {
    try {
      const scope: Record<string, number> = {};
      Object.entries(variables).forEach(([name, val]) => {
        scope[name] = parseFloat(val) || 0;
      });
      const sanitized = expression.replace(/·/g, '*').replace(/÷/g, '/');
      const res = math.evaluate(sanitized, scope);
      setResult(math.format(res, { precision: 10 }).toString());
    } catch (e) {
      setResult('Error');
    }
  };

  const handleSimplify = () => {
    try {
      const sanitized = expression.replace(/·/g, '*').replace(/÷/g, '/');
      const simp = math.simplify(sanitized).toString();
      setSimplified(toLatex(simp));
    } catch (e) {
      setSimplified('Error');
    }
  };

  const handleExpand = () => {
    try {
      // mathjs doesn't have a direct "expand" but simplify often expands
      // We can use a more specific simplify rule or just rely on it
      const sanitized = expression.replace(/·/g, '*').replace(/÷/g, '/');
      // For expansion, we can try to use mathjs's simplify with specific rules if needed
      // but standard simplify often does the job for simple polynomials
      const exp = math.simplify(sanitized).toString();
      setExpanded(toLatex(exp));
    } catch (e) {
      setExpanded('Error');
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-6 p-4 lg:p-8 overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Variable className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest text-on-surface">
              {t('algebra.title')}
            </h2>
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em]">
              Simbólico & Evaluación
            </p>
          </div>
        </div>
        <div className="h-1 w-20 bg-primary/40 rounded-full mt-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-surface-container-high rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">
                {t('algebra.expression')}
              </label>
              <div className="relative group">
                <input 
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/20 rounded-2xl px-6 py-4 text-xl font-mono focus:border-primary/40 focus:outline-none transition-all shadow-inner"
                  placeholder="e.g. 2x + 5x"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex justify-center p-4 bg-surface-container-lowest/50 rounded-2xl border border-dashed border-outline-variant/20">
                <Latex formula={toLatex(expression)} className="text-2xl text-primary" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <TactileButton onClick={handleSimplify} variant="ghost" className="text-[10px] font-black uppercase tracking-widest py-3">
                {t('algebra.simplify')}
              </TactileButton>
              <TactileButton onClick={handleExpand} variant="ghost" className="text-[10px] font-black uppercase tracking-widest py-3">
                {t('algebra.expand')}
              </TactileButton>
              <TactileButton onClick={() => setExpression('')} variant="error" className="text-[10px] font-black uppercase tracking-widest py-3">
                {t('common.clear')}
              </TactileButton>
            </div>
          </section>

          {/* Results Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 block mb-3">
                {t('algebra.simplify')}
              </span>
              <div className="min-h-[40px] flex items-center">
                {simplified ? <Latex formula={simplified} className="text-lg text-on-surface" /> : <span className="text-xs opacity-20 italic">---</span>}
              </div>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 block mb-3">
                {t('algebra.expand')}
              </span>
              <div className="min-h-[40px] flex items-center">
                {expanded ? <Latex formula={expanded} className="text-lg text-on-surface" /> : <span className="text-xs opacity-20 italic">---</span>}
              </div>
            </div>
          </section>
        </div>

        {/* Evaluation Section */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-primary/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  {t('algebra.evaluate')}
                </span>
                <Activity className="w-4 h-4 text-primary/40" />
              </div>

              <div className="space-y-4">
                {Object.keys(variables).length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                      {t('algebra.enter_values')}
                    </p>
                    {Object.keys(variables).map(v => (
                      <div key={v} className="flex items-center gap-4 bg-surface-container-high/50 p-3 rounded-2xl border border-outline-variant/5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-mono font-bold">
                          {v}
                        </div>
                        <input 
                          type="number"
                          value={variables[v]}
                          onChange={(e) => setVariables(prev => ({ ...prev, [v]: e.target.value }))}
                          className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-mono text-on-surface outline-none"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center opacity-20 italic text-xs">
                    {t('algebra.no_variables')}
                  </div>
                )}
              </div>

              <TactileButton 
                onClick={handleEvaluate}
                variant="primary"
                className="w-full py-4 text-xs font-black uppercase tracking-widest shadow-lg"
              >
                {t('algebra.evaluate')}
              </TactileButton>

              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-primary text-white rounded-3xl shadow-inner text-center space-y-2"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    {t('algebra.result')}
                  </span >
                  <div className="text-3xl font-black font-mono tracking-tighter">
                    {result}
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Info Card */}
          <section className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface">Tip Pro</h4>
              <p className="text-[10px] text-on-surface-variant/60 leading-relaxed uppercase tracking-wider">
                El sistema detecta automáticamente cualquier letra como variable. Puedes usar x, y, z o cualquier otra para tus polinomios.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
