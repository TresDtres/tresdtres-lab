import React from 'react';
import { CODATA_2022 } from '../constants/codata';

export const ConstantsTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="py-3 px-4 font-mono text-zinc-500 uppercase tracking-wider">Symbol</th>
            <th className="py-3 px-4 font-mono text-zinc-500 uppercase tracking-wider">Name</th>
            <th className="py-3 px-4 font-mono text-zinc-500 uppercase tracking-wider">Value</th>
            <th className="py-3 px-4 font-mono text-zinc-500 uppercase tracking-wider">Unit</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(CODATA_2022).map(([symbol, data]) => (
            <tr key={symbol} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
              <td className="py-3 px-4 font-mono font-bold text-orange-500">{symbol}</td>
              <td className="py-3 px-4 text-zinc-300">{data.name}</td>
              <td className="py-3 px-4 font-mono text-white">
                {data.value.toExponential ? data.value.toExponential(10).replace(/e\+?/, ' × 10^') : data.value}
              </td>
              <td className="py-3 px-4 text-zinc-500 font-mono text-xs">{data.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
