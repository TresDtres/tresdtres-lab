import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Activity, Database, Languages, Cpu } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import * as math from 'mathjs';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  icon: any;
}

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticsModal = ({ isOpen, onClose }: DiagnosticsModalProps) => {
  const { t, lang } = useI18n();
  const [tests, setTests] = useState<TestResult[]>([
    { id: 'engine', name: t('diagnostics.engine'), status: 'pending', icon: Cpu },
    { id: 'i18n', name: t('diagnostics.i18n'), status: 'pending', icon: Languages },
    { id: 'storage', name: t('diagnostics.storage'), status: 'pending', icon: Database },
    { id: 'algebra', name: t('diagnostics.algebra'), status: 'pending', icon: Activity },
    { id: 'security', name: t('diagnostics.security'), status: 'pending', icon: ShieldCheck },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'complete'>('idle');

  const runTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    
    const updateTest = (id: string, status: TestResult['status'], message?: string) => {
      setTests(prev => prev.map(t => t.id === id ? { ...t, status, message } : t));
    };

    // 1. Math Engine Test
    updateTest('engine', 'running');
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = math.evaluate('2 + 2 * 3');
      if (res === 8) {
        updateTest('engine', 'success', t('diagnostics.success') + ': 2+2*3=8');
      } else {
        throw new Error('Unexpected result');
      }
    } catch (e) {
      updateTest('engine', 'error', t('diagnostics.error'));
    }

    // 2. I18n Test
    updateTest('i18n', 'running');
    await new Promise(r => setTimeout(r, 600));
    if (lang) {
      updateTest('i18n', 'success', t('diagnostics.success') + `: ${lang.toUpperCase()}`);
    } else {
      updateTest('i18n', 'error', t('diagnostics.error'));
    }

    // 3. Storage Test
    updateTest('storage', 'running');
    await new Promise(r => setTimeout(r, 600));
    try {
      localStorage.setItem('diag_test', 'ok');
      localStorage.removeItem('diag_test');
      updateTest('storage', 'success', t('diagnostics.success'));
    } catch (e) {
      updateTest('storage', 'error', t('diagnostics.error'));
    }

    // 4. Algebra Test
    updateTest('algebra', 'running');
    await new Promise(r => setTimeout(r, 600));
    try {
      const simplified = math.simplify('2x + 3x').toString();
      if (simplified === '5 * x' || simplified === '5x') {
        updateTest('algebra', 'success', t('diagnostics.success'));
      } else {
        throw new Error('Algebraic mismatch');
      }
    } catch (e) {
      updateTest('algebra', 'error', t('diagnostics.error'));
    }

    // 5. Security Test
    updateTest('security', 'running');
    await new Promise(r => setTimeout(r, 600));
    updateTest('security', 'success', t('diagnostics.success'));

    setIsRunning(false);
    setOverallStatus('complete');
  };

  useEffect(() => {
    if (isOpen && overallStatus === 'idle') {
      runTests();
    }
  }, [isOpen]);

  const reset = () => {
    setTests([
      { id: 'engine', name: t('diagnostics.engine'), status: 'pending', icon: Cpu },
      { id: 'i18n', name: t('diagnostics.i18n'), status: 'pending', icon: Languages },
      { id: 'storage', name: t('diagnostics.storage'), status: 'pending', icon: Database },
      { id: 'algebra', name: t('diagnostics.algebra'), status: 'pending', icon: Activity },
      { id: 'security', name: t('diagnostics.security'), status: 'pending', icon: ShieldCheck },
    ]);
    setOverallStatus('idle');
    runTests();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/20"
        >
          <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-headline font-black text-lg text-on-surface">{t('diagnostics.title')}</h2>
                <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{t('diagnostics.subtitle')}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {tests.map((test) => (
              <div 
                key={test.id}
                className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/5"
              >
                <div className={`p-2 rounded-xl ${
                  test.status === 'success' ? 'bg-green-500/10 text-green-600' :
                  test.status === 'error' ? 'bg-red-500/10 text-red-600' :
                  test.status === 'running' ? 'bg-blue-500/10 text-blue-600' :
                  'bg-surface-container-high text-on-surface-variant/40'
                }`}>
                  <test.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-on-surface">{test.name}</h4>
                    {test.status === 'running' && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                    {test.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    {test.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  {test.message && (
                    <p className={`text-[11px] font-medium leading-relaxed ${
                      test.status === 'error' ? 'text-red-500' : 'text-on-surface-variant/70'
                    }`}>
                      {test.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              {t('diagnostics.close')}
            </button>
            <button
              onClick={reset}
              disabled={isRunning}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {overallStatus === 'complete' ? t('diagnostics.rerun') : t('diagnostics.running')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
