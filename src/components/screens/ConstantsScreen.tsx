import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Info, Copy, Check } from 'lucide-react';
import { CODATA_2022 } from '../../constants/codata';

export const ConstantsScreen: React.FC<{ isAdvanced?: boolean }> = ({ isAdvanced }) => {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filteredConstants = Object.entries(CODATA_2022).filter(([symbol, data]) => {
    const term = search.toLowerCase();
    return (
      symbol.toLowerCase().includes(term) ||
      data.name.toLowerCase().includes(term) ||
      data.unit.toLowerCase().includes(term)
    );
  });

  const handleCopy = (value: number, symbol: string) => {
    navigator.clipboard.writeText(value.toString());
    setCopied(symbol);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Search Header */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search constants (e.g., 'Planck', 'speed', 'kg')..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Grid of Constants */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredConstants.map(([symbol, data]) => (
            <motion.div
              key={symbol}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-5 hover:border-primary/30 transition-all group relative"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-mono font-bold text-primary">{symbol}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                      {data.unit}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-tight text-on-surface-variant/80">
                    {data.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleCopy(data.value, symbol)}
                  className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-on-surface-variant/40 hover:text-primary"
                  title="Copy value"
                >
                  {copied === symbol ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-surface-container-low/50 rounded-xl p-3 font-mono text-sm break-all">
                {data.value.toExponential ? data.value.toExponential(10).replace(/e\+?/, ' × 10^') : data.value}
              </div>

              {/* Hover Info Overlay */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info className="w-3 h-3 text-on-surface-variant/20" />
              </div>
            </motion.div>
          ))}
        </div>

        {filteredConstants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant/40 space-y-4">
            <Search className="w-12 h-12 opacity-20" />
            <p className="font-mono text-xs uppercase tracking-widest">No constants found for "{search}"</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">CODATA 2022 Adjustment</p>
          <p className="text-[10px] text-on-surface-variant/60 leading-relaxed uppercase tracking-tight">
            These values are the latest recommended by the Committee on Data for Science and Technology.
            Values marked as "exact" have no uncertainty.
          </p>
        </div>
      </div>
    </div>
  );
};
