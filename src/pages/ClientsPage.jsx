import { AlertTriangle, ChevronRight, Loader2, Plus } from 'lucide-react';
import { RiskBadge } from '../components/ui/RiskBadge.jsx';
import { useClient } from '../context/ClientContext.jsx';
import { MODAL_KEYS, useUI } from '../context/UIContext.jsx';

export default function ClientsPage() {
  const { clients, isLoading } = useClient();
  const ui = useUI();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Master Database</h2>
        <button
          type="button"
          onClick={() => ui.openModal(MODAL_KEYS.addClient)}
          className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-indigo-500/25 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Onboard Client
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden min-h-[300px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
            <p className="text-sm text-slate-500 font-medium">Loading live data...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
            <p className="text-sm text-slate-700 font-bold mb-1">No clients found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-sm text-left">
              <thead className="bg-slate-50/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                    Client Identity
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Structure</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                    Pricing Margin
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Health</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">
                    Dossier
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50">
                {clients.map((client) => (
                  <tr
                    key={client.id || client.name}
                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    onClick={() => ui.openDossier(client)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mr-3 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">{client.entity_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-semibold">{client.tp_margin}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RiskBadge risk={client.risk_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        className="text-slate-400 group-hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
