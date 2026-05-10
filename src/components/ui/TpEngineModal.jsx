import { Calculator, X } from 'lucide-react';

export function TpEngineModal({
  open,
  onClose,
  revenue,
  setRevenue,
  calculatedProfit,
  onCalculate,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-indigo-600" /> Budget 2026 TP Engine
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1.5 transition-colors border border-slate-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Total IT Service Revenue (₹)</label>
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium"
              placeholder="e.g. 50000000"
            />
          </div>
          <button
            type="button"
            onClick={onCalculate}
            disabled={!revenue}
            className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex justify-center items-center transform active:scale-[0.98]"
          >
            Calculate Safe Harbour
          </button>
          {calculatedProfit !== null && (
            <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200/60 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm font-bold text-emerald-800 mb-1 uppercase tracking-wider">
                Required Operating Profit (15.5%)
              </p>
              <p className="text-4xl font-extrabold text-emerald-600 tracking-tight">
                ₹{calculatedProfit.toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
