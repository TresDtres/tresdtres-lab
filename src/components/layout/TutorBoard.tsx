import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Info, Lightbulb } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Latex } from '../Latex';

interface TutorBoardProps {
  data: {
    title?: string;
    explanation?: string;
    steps?: { label: string; formula?: string; desc: string }[];
    tip?: string;
  } | null;
}

export const TutorBoard = ({ data }: TutorBoardProps) => {
  const { t } = useI18n();

  return (
    <div className="flex-1 flex flex-col bg-surface-container-low border border-outline-variant/20 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
      {/* Blackboard Header */}
      <div className="bg-surface-container-highest px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">{t('tutor.title')}</h3>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-tighter">{t('tutor.subtitle')}</p>
          </div>
        </div>
        <div className="px-2 py-1 rounded bg-primary/10 text-[10px] font-black text-primary uppercase animate-pulse">
          Live Analysis
        </div>
      </div>

      {/* Blackboard Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar relative">
        {/* Chalkboard Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {!data ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <BookOpen className="w-12 h-12" />
            <p className="text-sm font-bold uppercase tracking-widest">{t('tutor.waiting')}</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 relative z-10"
          >
            {/* Main Explanation */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-widest">{data.title || t('tutor.explanation')}</h4>
              </div>
              <p className="text-base font-medium text-on-surface leading-relaxed">
                {data.explanation}
              </p>
            </section>

            {/* Steps */}
            {data.steps && data.steps.length > 0 && (
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">{t('tutor.steps')}</h4>
                <div className="space-y-4">
                  {data.steps.map((step, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant/10 flex items-center justify-center text-[10px] font-black text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <div className="space-y-2 flex-1">
                        <p className="text-sm font-bold text-on-surface">{step.label}</p>
                        {step.formula && (
                          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/5 flex justify-center">
                            <Latex formula={step.formula} className="text-primary text-lg" />
                          </div>
                        )}
                        <p className="text-xs text-on-surface-variant leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Pro Tip */}
            {data.tip && (
              <section className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex gap-4">
                <Lightbulb className="w-5 h-5 text-primary shrink-0" />
                <div className="space-y-1">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">Pro Tip</h5>
                  <p className="text-xs text-on-surface font-medium leading-relaxed italic">
                    "{data.tip}"
                  </p>
                </div>
              </section>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="px-6 py-3 bg-surface-container-highest/50 border-t border-outline-variant/10 flex justify-between items-center">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-30">Tutor Module SK-1</span>
        <span className="text-[8px] font-mono text-on-surface-variant opacity-30">v1.0.2-BETA</span>
      </div>
    </div>
  );
};
