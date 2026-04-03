import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { KEYBOARD_SHORTCUTS } from '../../constants/shortcuts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tab: 'general' | 'howto';
  setTab: (tab: 'general' | 'howto') => void;
  isAdvanced: boolean;
  setIsAdvanced: (val: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isGraphingEnabled: boolean;
  setIsGraphingEnabled: (val: boolean) => void;
  isTutorMode: boolean;
  setIsTutorMode: (val: boolean) => void;
  showHelp: boolean;
  setShowHelp: (val: boolean) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  tab,
  setTab,
  isAdvanced,
  setIsAdvanced,
  theme,
  setTheme,
  isGraphingEnabled,
  setIsGraphingEnabled,
  isTutorMode,
  setIsTutorMode,
  showHelp,
  setShowHelp
}: SettingsModalProps) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-surface rounded-2xl w-full ${tab === 'howto' ? 'max-w-md' : 'max-w-xs'} p-6 shadow-2xl border border-outline-variant/20`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-bold text-lg">{t('settings.title')}</h3>
            <button onClick={onClose} aria-label="Close settings"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex gap-4 mb-6 border-b border-outline-variant/10">
            <button 
              onClick={() => setTab('general')}
              className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'general' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant/40'}`}
              aria-label="General settings"
            >
              {t('settings.general')}
            </button>
            <button 
              onClick={() => setTab('howto')}
              className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'howto' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant/40'}`}
              aria-label="Keyboard shortcuts guide"
            >
              {t('settings.shortcuts')}
            </button>
          </div>

          <div className="space-y-4">
            {tab === 'howto' ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar" id="printable-shortcuts">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary">{t('settings.shortcuts')}</h4>
                  <button 
                    onClick={() => {
                      const windowUrl = window.location.href;
                      const uniqueName = new Date();
                      const windowName = 'Print' + uniqueName.getTime();
                      const printWindow = window.open(windowUrl, windowName, 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
                      
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Calculadora - ${t('settings.shortcuts')}</title>
                              <style>
                                body { font-family: sans-serif; padding: 40px; color: #333; }
                                h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
                                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                th { background-color: #f4f4f4; }
                                .key { font-family: monospace; background: #eee; padding: 2px 6px; border-radius: 4px; border: 1px solid #ccc; }
                              </style>
                            </head>
                            <body>
                              <h1>${t('settings.keyboard_guide_title')}</h1>
                              <table>
                                <thead>
                                  <tr>
                                    <th>${t('settings.pc_key')}</th>
                                    <th>${t('settings.calc_function')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${KEYBOARD_SHORTCUTS.map(s => `
                                    <tr>
                                      <td><span class="key">${s.key}</span></td>
                                      <td>${t(s.action)}</td>
                                    </tr>
                                  `).join('')}
                                </tbody>
                              </table>
                              <p style="margin-top: 40px; font-size: 10px; color: #666;">${t('settings.generated_by')}</p>
                              <script>
                                window.onload = function() { window.print(); window.close(); }
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }
                    }}
                    className="p-1.5 hover:bg-primary/10 text-on-surface-variant/60 hover:text-primary rounded-md transition-colors"
                    title={t('settings.print')}
                    aria-label="Print shortcuts guide"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {KEYBOARD_SHORTCUTS.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-surface-container-low rounded-lg border border-outline-variant/5">
                      <code className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">{s.key}</code>
                      <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">{t(s.action)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-widest">{t('settings.advanced_mode')}</span>
                    <span className="text-[9px] text-on-surface-variant opacity-60 uppercase tracking-widest">{t('settings.pristine_lab')}</span>
                  </div>
                  <button 
                    onClick={() => setIsAdvanced(!isAdvanced)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${isAdvanced ? 'bg-primary' : 'bg-outline-variant/30'}`}
                    aria-label={`Toggle advanced mode. Currently ${isAdvanced ? 'enabled' : 'disabled'}`}
                  >
                    <motion.div 
                      animate={{ x: isAdvanced ? 26 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('settings.dark_mode')}</span>
                  <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-outline-variant/30'}`}
                    aria-label={`Toggle dark mode. Currently ${theme === 'dark' ? 'enabled' : 'disabled'}`}
                  >
                    <motion.div 
                      animate={{ x: theme === 'dark' ? 22 : 4 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t('settings.graphing_mode')}</span>
                    <span className="text-[9px] text-on-surface-variant opacity-60 uppercase tracking-widest">{t('settings.enable_graphing')}</span>
                  </div>
                  <button 
                    onClick={() => setIsGraphingEnabled(!isGraphingEnabled)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${isGraphingEnabled ? 'bg-primary' : 'bg-outline-variant/30'}`}
                    aria-label={`Toggle graphing mode. Currently ${isGraphingEnabled ? 'enabled' : 'disabled'}`}
                  >
                    <motion.div 
                      animate={{ x: isGraphingEnabled ? 22 : 4 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t('settings.tutor_mode')}</span>
                    <span className="text-[9px] text-on-surface-variant opacity-60 uppercase tracking-widest">{t('settings.tutor_mode_desc')}</span>
                  </div>
                  <button 
                    onClick={() => setIsTutorMode(!isTutorMode)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${isTutorMode ? 'bg-primary' : 'bg-outline-variant/30'}`}
                    aria-label={`Toggle tutor mode. Currently ${isTutorMode ? 'enabled' : 'disabled'}`}
                  >
                    <motion.div 
                      animate={{ x: isTutorMode ? 22 : 4 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('settings.haptic_feedback')}</span>
                  <div className="w-10 h-5 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t('settings.contextual_help')}</span>
                    <span className="text-[9px] text-on-surface-variant opacity-60 uppercase tracking-widest">{t('settings.show_button_info')}</span>
                  </div>
                  <button 
                    onClick={() => setShowHelp(!showHelp)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${showHelp ? 'bg-primary' : 'bg-outline-variant/30'}`}
                    aria-label={`Toggle contextual help. Currently ${showHelp ? 'enabled' : 'disabled'}`}
                  >
                    <motion.div 
                      animate={{ x: showHelp ? 22 : 4 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
                <div className="pt-4 border-t border-outline-variant/10">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60 mb-2">Kernel Version</p>
                  <p className="text-xs font-mono">SK-1.0.4-STABLE</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
