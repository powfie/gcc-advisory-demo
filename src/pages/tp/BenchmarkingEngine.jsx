import React from 'react';
import { BarChart3 } from 'lucide-react';
import { QUARTILES, TP_COMPARABLES } from '../../lib/data/comparables';

export default function BenchmarkingEngine({ client }) {
  const category = client?.sector?.includes('R&D') ? 'contract_rnd' : 'it_services';
  const q = QUARTILES[category];
  const currentMargin = parseFloat((client?.tp_margin || '').replace(/[^0-9.]/g, '')) || 0;

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Arm's Length Range (FY 2024-25)</h3>
        <span className="px-3 py-1 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-lg">TNMM Applied</span>
      </div>
      
      <div className="relative h-8 mb-8 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
        <div className="absolute top-0 bottom-0 bg-emerald-100/50 border-x-2 border-emerald-400" 
             style={{ left: `${q.lower}%`, right: `${100 - q.upper}%` }}>
        </div>
        <div className="absolute top-0 bottom-0 w-1 bg-rose-500 z-10" 
             style={{ left: `${currentMargin}%` }} title={`Client Margin: ${currentMargin}%`}>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs text-slate-500 uppercase font-bold">35th Percentile</p><p className="text-lg font-black text-slate-800">{q.lower}%</p></div>
        <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs text-slate-500 uppercase font-bold">Median</p><p className="text-lg font-black text-slate-800">{q.median}%</p></div>
        <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs text-slate-500 uppercase font-bold">65th Percentile</p><p className="text-lg font-black text-slate-800">{q.upper}%</p></div>
      </div>
    </div>
  );
}