import { Loader2, X } from 'lucide-react';

export function EditClientModal({
  open,
  onClose,
  editingClient,
  setEditingClient,
  onSubmit,
  onDelete,
  isSubmitting,
}) {
  if (!open || !editingClient) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200 print:hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-extrabold text-slate-900">Edit Client</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1.5 transition-colors border border-slate-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={onSubmit}
          className="p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
            <input
              required
              type="text"
              value={editingClient.name}
              onChange={(e) => setEditingClient((p) => ({ ...p, name: e.target.value }))}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Entity Type</label>
              <select
                value={editingClient.entity_type}
                onChange={(e) => setEditingClient((p) => ({ ...p, entity_type: e.target.value }))}
                className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white font-medium shadow-sm"
              >
                <option>WOS</option>
                <option>Branch</option>
                <option>LLP</option>
                <option>JV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Risk Status</label>
              <select
                value={editingClient.risk_status}
                onChange={(e) => setEditingClient((p) => ({ ...p, risk_status: e.target.value }))}
                className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white font-medium shadow-sm"
              >
                <option>Green</option>
                <option>Amber</option>
                <option>Red</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">TP Margin</label>
            <input
              type="text"
              value={editingClient.tp_margin}
              onChange={(e) => setEditingClient((p) => ({ ...p, tp_margin: e.target.value }))}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-indigo-500 transition-all flex justify-center items-center"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(editingClient)}
              className="px-4 py-3.5 rounded-xl font-bold border border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
