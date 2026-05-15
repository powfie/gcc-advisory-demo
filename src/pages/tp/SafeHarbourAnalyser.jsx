import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function SafeHarbourAnalyser({ client }) {
  if (!client) return null;
  const isEligible = client.annual_revenue_cr <= 200;
  const marginStr = client.tp_margin || '';
  const currentMargin = parseFloat(marginStr.replace(/[^0-9.]/g, '')) || 0;
  
  let requiredMargin = 17; // IT Services base
  if (client.sector.includes('R&D')) requiredMargin = 24;

  const isCompliant = currentMargin >= requiredMargin && isEligible;

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Safe Harbour Rule 10TD Assessment</h3>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-4 border rounded-xl border-slate-100 bg-slate-50">
          <p className="text-xs font-bold text-slate-500 uppercase">Annual Revenue limit</p>
          <p className={`text-2xl font-black ${isEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₹{client.annual_revenue_cr} Cr <span className="text-sm font-medium text-slate-500">/ ₹200 Cr</span>
          </p>
        </div>
        <div className="p-4 border rounded-xl border-slate-100 bg-slate-50">
          <p className="text-xs font-bold text-slate-500 uppercase">Declared Operating Margin</p>
          <p className={`text-2xl font-black ${currentMargin >= requiredMargin ? 'text-emerald-600' : 'text-amber-600'}`}>
            {currentMargin}% <span className="text-sm font-medium text-slate-500">/ Min {requiredMargin}%</span>
          </p>
        </div>
      </div>
      
      {isCompliant ? (
        <div className="flex items-center p-4 bg-emerald-50 rounded-xl text-emerald-800 border border-emerald-100">
          <ShieldCheck className="w-5 h-5 mr-3 text-emerald-600" />
          <p className="text-sm font-semibold">Entity is eligible for Safe Harbour protection. Litigation risk is minimized.</p>
        </div>
      ) : (
        <div className="flex items-center p-4 bg-amber-50 rounded-xl text-amber-800 border border-amber-100">
          <AlertCircle className="w-5 h-5 mr-3 text-amber-600" />
          <p className="text-sm font-semibold">Entity does not meet Safe Harbour thresholds. Full TP benchmarking study required.</p>
        </div>
      )}
    </div>
  );
}