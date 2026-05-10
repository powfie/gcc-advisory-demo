import { Landmark, X } from 'lucide-react';

export function DtaaModal({
  open,
  onClose,
  dtaaCountry,
  setDtaaCountry,
  dtaaAmount,
  setDtaaAmount,
  dtaaResult,
  onCalculate,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Landmark className="w-6 h-6 mr-2 text-indigo-600" /> DTAA Analyzer
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
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Residence / Treaty</label>
            <select
              value={dtaaCountry}
              onChange={(e) => setDtaaCountry(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white font-medium shadow-sm"
            >
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="UAE">UAE</option>
              <option value="Singapore">Singapore</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Other">Other (20% default)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Cross-border amount (₹)</label>
            <input
              type="number"
              value={dtaaAmount}
              onChange={(e) => setDtaaAmount(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium"
              placeholder="e.g. 10000000"
            />
          </div>
          <button
            type="button"
            onClick={onCalculate}
            disabled={!dtaaAmount}
            className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-50"
          >
            Calculate withholding
          </button>
          {dtaaResult && (
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-2">
              <p className="text-sm font-bold text-indigo-900">
                Treaty rate: {dtaaResult.rate.toFixed(1)}%
              </p>
              <p className="text-sm text-slate-700">
                Tax: ₹{dtaaResult.tax.toLocaleString('en-IN')} · Net: ₹{dtaaResult.net.toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
