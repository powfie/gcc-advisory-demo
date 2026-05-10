import { BarChart3, CheckCircle2, X } from 'lucide-react';

export function EtrModal({
  open,
  onClose,
  globalRevenue,
  setGlobalRevenue,
  indianProfit,
  setIndianProfit,
  indianTax,
  setIndianTax,
  etrResult,
  onCalculate,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" /> Pillar Two ETR Model
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1.5 transition-colors border border-slate-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Global Revenue (€)</label>
            <input
              type="number"
              value={globalRevenue}
              onChange={(e) => setGlobalRevenue(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium"
              placeholder="e.g. 800000000"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Indian Profit (€)</label>
            <input
              type="number"
              value={indianProfit}
              onChange={(e) => setIndianProfit(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium"
              placeholder="e.g. 5000000"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Current Indian Tax Paid (€)</label>
            <input
              type="number"
              value={indianTax}
              onChange={(e) => setIndianTax(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium"
              placeholder="e.g. 500000"
            />
          </div>
          <div className="pt-4">
            <button
              type="button"
              onClick={onCalculate}
              disabled={!globalRevenue || !indianProfit || !indianTax}
              className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex justify-center items-center transform active:scale-[0.98]"
            >
              Calculate Pillar Two Impact
            </button>
          </div>

          {etrResult && (
            <div
              className={`mt-6 p-6 border rounded-2xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                !etrResult.isSubject
                  ? 'bg-slate-50 border-slate-200'
                  : etrResult.topUpTax > 0
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              {!etrResult.isSubject ? (
                <div className="text-center">
                  <p className="text-base font-extrabold text-slate-800">Out of Scope</p>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Global revenue is under the €750M threshold.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Calculated ETR:</span>
                    <span
                      className={`text-2xl font-extrabold ${
                        parseFloat(etrResult.etr) < 15 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {etrResult.etr}%
                    </span>
                  </div>
                  {etrResult.topUpTax > 0 ? (
                    <div className="pt-4 mt-2 border-t border-rose-200/60">
                      <p className="text-sm font-bold text-rose-800 mb-1 uppercase tracking-wider">Required Top-up Tax</p>
                      <p className="text-3xl font-extrabold text-rose-600">
                        €{etrResult.topUpTax.toLocaleString('en-EU')}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-4 mt-2 border-t border-emerald-200/60 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" />
                      <p className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider">
                        Compliant (ETR ≥ 15%)
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
