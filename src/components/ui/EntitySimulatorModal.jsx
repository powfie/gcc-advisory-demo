import { Layers, X } from 'lucide-react';

export function EntitySimulatorModal({
  open,
  onClose,
  headcount,
  setHeadcount,
  opCost,
  setOpCost,
  showEntityResults,
  setShowEntityResults,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Layers className="w-6 h-6 mr-2 text-indigo-600" /> Entity Structuring Simulator
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
          <p className="text-sm text-slate-600">
            Capture scale inputs for strategy reports and WOS vs. branch comparisons.
          </p>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Planned headcount</label>
            <input
              type="number"
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white font-medium shadow-sm"
              placeholder="e.g. 250"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Annual operating cost (USD)</label>
            <input
              type="number"
              value={opCost}
              onChange={(e) => setOpCost(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white font-medium shadow-sm"
              placeholder="e.g. 12000000"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowEntityResults(true)}
            className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-indigo-500 transition-all"
          >
            Save inputs for reports
          </button>
          {showEntityResults && (headcount || opCost) && (
            <p className="text-sm text-emerald-700 font-medium">
              Inputs saved. They will appear in the Strategy Reports preview.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
