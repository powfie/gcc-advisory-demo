import React from 'react';
import { Globe } from 'lucide-react';

export default function PillarTwoModel({ client }) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl opacity-75">
      <div className="flex items-center mb-4">
        <Globe className="w-5 h-5 mr-2 text-indigo-500" />
        <h3 className="text-lg font-bold text-slate-900">GloBE Pillar Two ETR Model</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4">This module calculates Effective Tax Rate to ensure compliance with the 15% global minimum tax.</p>
      <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Awaiting Financial Data Integration</p>
      </div>
    </div>
  );
}