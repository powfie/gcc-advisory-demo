import { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center border border-slate-700">
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-400 mr-3" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
