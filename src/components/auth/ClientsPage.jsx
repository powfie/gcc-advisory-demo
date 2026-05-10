// src/pages/clients/ClientsPage.jsx
import React, { useState, useMemo } from 'react';
import {
  Plus, Search, ChevronRight, MoreVertical, Trash2, Edit3,
  Loader2, Building2, Filter, CheckCircle2, AlertTriangle, AlertOctagon
} from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { useUI } from '../../context/UIContext';
import { useApp } from '../../context/AppContext';
import { RiskBadge, ClientAvatar, EmptyState } from '../../components/ui/shared';
import { SkeletonRow } from '../../components/ui/shared';
import ClientDossier from './ClientDossier';
import AddClientModal from './AddClientModal';

const RISK_FILTERS = ['All', 'Green', 'Amber', 'Red'];
const ENTITY_FILTERS = ['All', 'WOS', 'Branch', 'LLP', 'JV', 'GIFT City'];

export default function ClientsPage() {
  const { clients, isLoading, deleteClient, setSelectedClient, selectedClient } = useClients();
  const { openModal, dossierOpen, openDossier, closeDossier } = useUI();
  const { showToast } = useApp();

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [entityFilter, setEntityFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = useMemo(() => {
    return clients.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.sector?.toLowerCase().includes(search.toLowerCase()) ||
        c.parent_company?.toLowerCase().includes(search.toLowerCase());
      const matchRisk   = riskFilter === 'All' || c.risk_status === riskFilter;
      const matchEntity = entityFilter === 'All' || c.entity_type === entityFilter ||
        (entityFilter === 'GIFT City' && c.gift_city);
      return matchSearch && matchRisk && matchEntity;
    });
  }, [clients, search, riskFilter, entityFilter]);

  const handleRowClick = (client) => {
    setSelectedClient(client);
    openDossier('overview');
  };

  const handleDelete = (e, client) => {
    e.stopPropagation();
    setOpenMenu(null);
    // Uses UIContext.showConfirm — no window.confirm
    const { showConfirm } = require('../../context/UIContext').useUI?.() || {};
    deleteClient(client);
  };

  const scoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients, sectors, parent..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        {/* Risk filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {RISK_FILTERS.map(f => (
            <button key={f}
              onClick={() => setRiskFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                riskFilter === f
                  ? f === 'Green'  ? 'bg-emerald-600 text-white border-emerald-600'
                  : f === 'Amber'  ? 'bg-amber-500 text-white border-amber-500'
                  : f === 'Red'    ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >{f}</button>
          ))}
        </div>

        {/* Entity filter */}
        <select
          value={entityFilter}
          onChange={e => setEntityFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm font-medium text-slate-700"
        >
          {ENTITY_FILTERS.map(f => <option key={f}>{f}</option>)}
        </select>

        {/* Add client */}
        <button
          onClick={() => setAddOpen(true)}
          className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-indigo-500/25 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Onboard Client
        </button>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
        <span>{filtered.length} of {clients.length} clients</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{clients.filter(c => c.risk_status === 'Green').length} Compliant</span>
        <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" />{clients.filter(c => c.risk_status === 'Amber').length} Elevated</span>
        <span className="flex items-center gap-1"><AlertOctagon className="w-3.5 h-3.5 text-rose-500" />{clients.filter(c => c.risk_status === 'Red').length} Critical</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-slate-100">
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No clients found"
            description={search || riskFilter !== 'All' ? 'Try adjusting your search or filters.' : 'Add your first GCC entity to get started.'}
            action={
              <button onClick={() => setAddOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                + Onboard Client
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm text-left">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Client', 'Sector', 'Entity Type', 'TP Method', 'Health', 'Score', 'Tasks', ''].map(h => (
                    <th key={h} className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(client => (
                  <tr
                    key={client.id}
                    onClick={() => handleRowClick(client)}
                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                  >
                    {/* Client name + avatar */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <ClientAvatar name={client.name} size="sm" />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{client.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{client.parent_country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-medium text-xs">{client.sector}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200">
                        {client.entity_type}{client.gift_city ? ' · GIFT' : ''}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-600 font-semibold text-xs">{client.tp_margin}</td>
                    <td className="px-5 py-4 whitespace-nowrap"><RiskBadge risk={client.risk_status} /></td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${scoreColor(client.compliance_score || 70)}`}>
                        {client.compliance_score || 70}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {client.tasks?.filter(t => !t.done).length || 0} open
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleRowClick(client)}
                          className="text-slate-300 group-hover:text-indigo-500 transition-colors p-1.5 hover:bg-indigo-50 rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === client.id ? null : client.id)}
                            className="text-slate-300 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenu === client.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-50 w-40 overflow-hidden">
                              <button
                                onClick={() => { setSelectedClient(client); openDossier('overview'); setOpenMenu(null); }}
                                className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                <Edit3 className="w-4 h-4 mr-2 text-slate-400" /> Open Dossier
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, client)}
                                className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Remove Client
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Client Dossier Drawer */}
      <ClientDossier />

      {/* Add Client Modal */}
      {addOpen && <AddClientModal onClose={() => setAddOpen(false)} />}
    </div>
  );
}