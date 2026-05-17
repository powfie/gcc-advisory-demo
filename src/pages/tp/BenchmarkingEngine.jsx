import React, { useState } from 'react';
import { BarChart3, Target, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { TP_COMPARABLES } from '../../lib/data/comparables';
import { calculateArmsLengthRange } from '../../lib/calculations/tp';

export default function BenchmarkingEngine({ client }) {
  const [framework, setFramework] = useState('indian'); // 'indian' or 'oecd'
  
  // 1. Extract inputs
  const category = client?.sector?.includes('R&D') ? 'contract_rnd' : 'it_services';
  const rawComparables = TP_COMPARABLES[category] || [];
  const currentMargin = parseFloat((client?.tp_margin || '').replace(/[^0-9.]/g, '')) || 0;

  // 2. Run the external calculation engine
  const result = calculateArmsLengthRange(currentMargin, rawComparables, framework);

  if (result.error) {
    return <div className="p-6 text-rose-500 font-bold bg-white rounded-2xl">{result.error}</div>;
  }

  // Helper for the visual scale
  const toScale = (margin) => `${((margin - result.chartMin) / (result.chartMax - result.chartMin)) * 100}%`;

  return (
    <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden flex flex-col h-full animate-in fade-in">
      
      {/* Header & Framework Toggle */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" /> Arm's Length Range
          </h3>
          <p className="text-xs text-slate-500 mt-1">Benchmarked against {rawComparables.length} peers.</p>
        </div>
        
        <div className="flex bg-slate-200/50 p-1 rounded-lg border border-slate-200">
          <button onClick={() => setFramework('indian')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${framework === 'indian' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Sec 92C (35-65)
          </button>
          <button onClick={() => setFramework('oecd')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${framework === 'oecd' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            OECD IQR (25-75)
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        
        {/* Visual Distribution Scale */}
        <div className="mb-10 mt-4">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
            <span>{result.chartMin.toFixed(1)}%</span>
            <span>{result.chartMax.toFixed(1)}%</span>
          </div>
          
          <div className="relative h-12 bg-slate-100 rounded-xl overflow-hidden border border-slate-200/80 inset-shadow-sm">
            {/* Safe Range Green Bar */}
            <div 
              className="absolute top-0 bottom-0 bg-emerald-100/60 border-x-2 border-emerald-400 transition-all duration-500"
              style={{ left: toScale(result.lowerBound), width: toScale(result.upperBound - result.chartMin + result.lowerBound) }}
            />

            {/* Peer Ticks */}
            {rawComparables.map((comp) => (
              <div 
                key={comp.id} 
                className="absolute top-0 bottom-0 w-px bg-slate-400/50 z-10 group cursor-pointer hover:w-1 hover:bg-indigo-400 transition-all"
                style={{ left: toScale(comp.median3Yr) }}
              >
                <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                  {comp.companyName}: {comp.median3Yr}%
                </div>
              </div>
            ))}

            {/* Client Marker */}
            <div 
              className="absolute top-0 bottom-0 w-1.5 bg-slate-900 z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-all duration-500"
              style={{ left: toScale(currentMargin) }}
            >
              <div className="absolute top-full mt-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap flex items-center -translate-x-1/2">
                <Target className="w-3 h-3 mr-1 text-indigo-400" /> Client: {currentMargin}%
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Results Table */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lower Bound</span>
            <span className="block text-xl font-black text-slate-900 mt-1 tabular-nums">{result.lowerBound}%</span>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center relative overflow-hidden">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Median</span>
            <span className="block text-2xl font-black text-indigo-900 mt-1 tabular-nums">{result.median}%</span>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upper Bound</span>
            <span className="block text-xl font-black text-slate-900 mt-1 tabular-nums">{result.upperBound}%</span>
          </div>
        </div>

        {/* Advisory Output */}
        <div className={`flex items-start p-4 rounded-xl border ${result.isCompliant ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
          {result.isCompliant ? <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-600 mt-0.5" /> : <AlertTriangle className="w-5 h-5 mr-3 text-rose-600 mt-0.5" />}
          <div>
            <p className="text-sm font-bold">{result.isCompliant ? "Arm's Length Standard Met" : "Deviation Risk Detected"}</p>
            <p className={`text-xs mt-1 leading-relaxed ${result.isCompliant ? 'text-emerald-700' : 'text-rose-700'}`}>
              Margin ({currentMargin}%) is {result.isCompliant ? 'within' : 'outside'} the {result.framework} range. 
              {result.isCompliant ? ' No adjustment required.' : ` High risk of adjustment to median (${result.median}%).`}
            </p>
            
            <div className="mt-3 pt-3 border-t border-black/5 flex items-center gap-2">
              <FileText className="w-4 h-4 opacity-70" />
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                Prep required: {result.documentationRequired.join(', ')}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}