import React from 'react';
import { History, Download, FileText, Trash2 } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { exportToCSV, exportToPDF } from '../../lib/exportUtils';

interface DesktopHistorySidebarProps {
  history: string[];
}

export const DesktopHistorySidebar = ({ history }: DesktopHistorySidebarProps) => {
  const { t } = useI18n();
  const handleExportCSV = () => {
    const data = history.map(h => {
      const [expr, res] = h.split(' = ');
      return [expr, res];
    });
    exportToCSV('calculation_history', [['Expression', 'Result'], ...data]);
  };

  const handleExportPDF = () => {
    const rows = history.map(h => {
      const [expr, res] = h.split(' = ');
      return [expr, res];
    });
    exportToPDF('Calculation History', 'calculation_history', ['Expression', 'Result'], rows);
  };

  return (
    <aside className="hidden xl:flex flex-col w-80 bg-surface-container-low/30 border-l border-outline-variant/10 p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline font-bold text-xs tracking-widest uppercase text-on-surface-variant/60">{t('common.history')}</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            title={t('history.export_csv')}
            className="p-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:text-primary transition-all"
            aria-label="Export history to CSV"
          >
            <Download className="w-3 h-3" />
          </button>
          <button 
            onClick={handleExportPDF}
            title={t('history.export_pdf')}
            className="p-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:text-primary transition-all"
            aria-label="Export history to PDF"
          >
            <FileText className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
        {history.length > 0 ? history.map((h, i) => {
          const [expr, res] = h.split(' = ');
          return (
            <div key={i} className="flex flex-col items-end gap-1">
              <span className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest">12:44:02 PM</span>
              <div className="w-full bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 shadow-sm">
                <div className="text-right text-[10px] font-mono text-on-surface-variant/60 mb-1">{expr}</div>
                <div className="text-right text-lg font-black text-on-surface">{res}</div>
              </div>
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center h-full opacity-20">
            <History className="w-12 h-12 mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">{t('history.no_history')}</p>
          </div>
        )}
      </div>

      <button 
        className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 hover:text-error transition-colors"
        aria-label="Clear all calculation logs"
      >
        <Trash2 className="w-3 h-3" />
        {t('history.clear_logs')}
      </button>
    </aside>
  );
};
