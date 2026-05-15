import React from 'react';

export default function MethodSelector({ client }) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Methodology Validation</h3>
      <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100">
        <p className="text-sm font-semibold mb-2">Most Appropriate Method (MAM): <span className="font-black text-indigo-700">TNMM</span></p>
        <p className="text-xs text-indigo-700/80">Based on the functional profile of {client?.sector || 'services'}, the Transactional Net Margin Method is selected. CUP is rejected due to lack of strict product comparability.</p>
      </div>
    </div>
  );
}