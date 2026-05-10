import { Check, Plus, Settings, Trash2, X } from 'lucide-react';
import { RiskBadge } from './RiskBadge.jsx';

export function ClientDossierDrawer({
  open,
  selectedClient,
  dossierTab,
  setDossierTab,
  onClose,
  onOpenEdit,
  onDeleteClient,
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity duration-300 print:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[110] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col border-l border-slate-200 print:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedClient && (
          <>
            <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-none">{selectedClient.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">ID: GCC-{selectedClient.id}</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <RiskBadge risk={selectedClient.risk_status} />
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                    {selectedClient.entity_type}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full p-2 transition-colors border border-slate-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-100 px-6">
              {['overview', 'actions', 'vault'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDossierTab(tab)}
                  className={`py-4 px-4 text-sm font-bold capitalize tracking-wide transition-colors relative ${
                    dossierTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'actions' ? 'Action Items' : tab}
                  {dossierTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {dossierTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tax Parameters</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Transfer Pricing Margin</p>
                        <p className="font-semibold text-slate-900">{selectedClient.tp_margin}</p>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-500 mb-1">Entity Structure</p>
                        <p className="font-semibold text-slate-900">{selectedClient.entity_type}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenEdit(selectedClient)}
                    className="w-full flex items-center justify-center py-3.5 bg-white border border-slate-200/80 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition-all shadow-sm"
                  >
                    <Settings className="w-4 h-4 mr-2" /> Edit Client Parameters
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteClient(selectedClient)}
                    className="w-full flex items-center justify-center py-3.5 bg-rose-50 border border-rose-100/80 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove from Database
                  </button>
                </div>
              )}
              {dossierTab === 'actions' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Compliance</h4>
                    <button type="button" className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center">
                      <Plus className="w-4 h-4 mr-1" /> Task
                    </button>
                  </div>
                  {selectedClient.tasks && selectedClient.tasks.length > 0 ? (
                    selectedClient.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border flex items-start cursor-pointer transition-colors ${
                          task.done
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : 'bg-white border-indigo-100 shadow-sm hover:border-indigo-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 transition-colors ${
                            task.done ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {task.done && <Check className="w-3 h-3" />}
                        </div>
                        <p
                          className={`text-sm font-medium ${task.done ? 'text-slate-500 line-through' : 'text-slate-900'}`}
                        >
                          {task.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 bg-white border border-slate-200 border-dashed rounded-xl">
                      <p className="text-sm text-slate-500 font-medium">No active tasks for this client.</p>
                    </div>
                  )}
                </div>
              )}
              {dossierTab === 'vault' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button
                    type="button"
                    className="w-full border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300 rounded-xl p-6 text-center transition-all group shadow-sm"
                  >
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Upload Document</p>
                    <p className="text-xs text-slate-400 mt-1">TP Studies, Form 3CEFA, Incorporation Docs</p>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
