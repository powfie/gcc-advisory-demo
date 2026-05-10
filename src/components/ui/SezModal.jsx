import { CheckCircle2, Info, MapPin, X } from 'lucide-react';

function SezResults({ sezResult, sezHeadcount }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
        <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">10-Year Cumulative Savings</h4>
        <div className="flex items-baseline">
          <span className="text-5xl font-extrabold text-emerald-600 tracking-tight">
            ${sezResult.savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-emerald-700 font-medium ml-3 border-l border-emerald-200 pl-3">vs. Standard WOS Setup</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Standard Tax Liability</p>
          <p className="text-2xl font-extrabold text-slate-900">
            ${sezResult.standard.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">At 25.17% over 10 years</p>
        </div>
        <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">SEZ / IFSC Corporate Tax</p>
          <p className="text-2xl font-extrabold text-indigo-600">$0</p>
          <p className="text-xs text-indigo-400 mt-1">100% Exemption (Sec 80LA)</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center">
          <Info className="w-4 h-4 mr-2 text-indigo-500" /> Professional Modeling Notes
        </h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-800">Minimum Alternate Tax (MAT)</p>
              <p className="text-xs text-slate-500 mt-0.5">
                IFSC units are subject to a 9% MAT. However, this is fully available as a credit against future standard tax
                liabilities, ensuring net-zero impact during the holiday period.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-800">Projected State Subsidies Included</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculations include estimated PF employer contribution reimbursements based on your headcount of{' '}
                {sezHeadcount} personnel, adding{' '}
                <strong>${sezResult.subsidies.toLocaleString('en-US')}</strong> in savings over 5 years.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-800">FEMA Non-Resident Status</p>
              <p className="text-xs text-slate-500 mt-0.5">
                GIFT City entities are treated as non-residents under FEMA, allowing free repatriation of capital without
                standard RBI approval hurdles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SezModal({
  open,
  onClose,
  sezRevenue,
  setSezRevenue,
  sezMargin,
  setSezMargin,
  sezHeadcount,
  setSezHeadcount,
  sezResult,
  onCalculate,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all border border-slate-200 flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-indigo-600" /> SEZ/IFSC Tax Holiday Optimizer
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Forecast 10-year cumulative tax savings including MAT and state subsidies.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-2 transition-colors border border-slate-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-5 border-b border-slate-200 pb-2">Financial Projections</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Annual Projected Revenue ($)</label>
                    <input
                      type="number"
                      value={sezRevenue}
                      onChange={(e) => setSezRevenue(e.target.value)}
                      className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all shadow-sm font-medium"
                      placeholder="e.g. 5000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Operating Margin (%)</label>
                    <input
                      type="number"
                      value={sezMargin}
                      onChange={(e) => setSezMargin(e.target.value)}
                      className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all shadow-sm font-medium"
                      placeholder="15.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Expected Headcount</label>
                    <input
                      type="number"
                      value={sezHeadcount}
                      onChange={(e) => setSezHeadcount(e.target.value)}
                      className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all shadow-sm font-medium"
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCalculate}
                  disabled={!sezRevenue || !sezMargin}
                  className="w-full mt-6 bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex justify-center items-center transform active:scale-[0.98]"
                >
                  Generate Optimization Model
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              {sezResult ? (
                <SezResults sezResult={sezResult} sezHeadcount={sezHeadcount} />
              ) : (
                <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-10 bg-slate-50/50">
                  <MapPin className="w-12 h-12 text-slate-300 mb-4" />
                  <h4 className="text-lg font-bold text-slate-700">Awaiting Parameters</h4>
                  <p className="text-sm text-slate-500 max-w-sm mt-2">
                    Enter your financial projections on the left to generate a comprehensive 10-year SEZ tax optimization model.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
