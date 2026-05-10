import { AlertTriangle, Globe, X } from 'lucide-react';

export function PeExpatModal({ open, onClose, expats }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-rose-600" /> Expat PE Risk Tracker
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1.5 transition-colors border border-slate-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <p className="text-sm font-medium text-slate-500 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
            Monitoring days spent in India to prevent triggering Service PE under DTAA guidelines (Threshold: 90 days).
          </p>

          {expats.length === 0 ? (
            <div className="text-center p-10 bg-white border border-slate-200 border-dashed rounded-2xl">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <p className="text-base text-slate-700 font-bold">No Expat Data Found</p>
              <p className="text-sm text-slate-500 mt-1">Connect HR database to populate travel logs.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {expats.map((expat) => {
                const days = expat.days_in_india;
                let textColor = 'text-emerald-700';
                let bgLight = 'bg-emerald-50';
                let warningText = 'Low Risk';
                let barColor = 'bg-emerald-500';
                if (days >= 90) {
                  textColor = 'text-rose-700';
                  bgLight = 'bg-rose-50';
                  warningText = 'CRITICAL: PE TRIGGERED';
                  barColor = 'bg-rose-500';
                } else if (days >= 60) {
                  textColor = 'text-amber-700';
                  bgLight = 'bg-amber-50';
                  warningText = 'Approaching Threshold';
                  barColor = 'bg-amber-500';
                }
                const progressPercent = Math.min((days / 90) * 100, 100);

                return (
                  <div
                    key={expat.id}
                    className={`p-6 rounded-2xl border ${days >= 90 ? 'border-rose-200 shadow-sm' : 'border-slate-200'} ${bgLight} transition-all`}
                  >
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="font-extrabold text-slate-900 text-lg">{expat.director_name}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                          Client ID: {expat.client_id}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg bg-white border border-slate-200/60 shadow-sm uppercase tracking-wider ${textColor}`}
                        >
                          {warningText}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 bg-white p-4 rounded-xl border border-slate-100/50 shadow-sm">
                      <div className="flex justify-between text-xs font-extrabold text-slate-600 mb-2 uppercase tracking-wider">
                        <span className={textColor}>{days} days elapsed</span>
                        <span>90 Day Limit</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/50">
                        <div
                          className={`${barColor} h-full rounded-full transition-all duration-1000 ease-out relative`}
                          style={{ width: `${progressPercent}%` }}
                        >
                          {days >= 60 && (
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
