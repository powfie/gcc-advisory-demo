import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, Plus, Building2, TrendingUp, ShieldAlert, Activity, MoreHorizontal } from 'lucide-react';
import { ClientDossier } from '../components/clients/ClientDossier';

export default function ClientsPage() {
  const { clients } = useApp();
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null); // Manages the Slide-out Dossier

  // Filter logic
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.sector.toLowerCase().includes(search.toLowerCase())
  );

  // Top-level metrics
  const totalRevenue = clients.reduce((sum, c) => sum + (c.annual_revenue_cr || 0), 0);
  const highRiskCount = clients.filter(c => c.risk_status === 'Red').length;
  const avgCompliance = Math.round(clients.reduce((sum, c) => sum + (c.compliance_score || 0), 0) / clients.length);

  // Badge Styles
  const riskStyles = {
    Green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Amber: 'bg-amber-50 text-amber-700 border-amber-200',
    Red: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header & Metrics */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Portfolios</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage global entities, track compliance, and monitor transfer pricing risks.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Onboard Entity
          </button>
        </div>
      </div>

      {/* Mini-KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Building2 className="w-5 h-5"/></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Entities</p>
            <p className="text-xl font-black text-slate-900 mt-0.5 tabular-nums">{clients.length}</p>
          </div>
        </div>
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5"/></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Capital</p>
            <p className="text-xl font-black text-slate-900 mt-0.5 tabular-nums">₹{totalRevenue.toLocaleString()} Cr</p>
          </div>
        </div>
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Activity className="w-5 h-5"/></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Compliance</p>
            <p className="text-xl font-black text-slate-900 mt-0.5 tabular-nums">{avgCompliance}/100</p>
          </div>
        </div>
        <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><ShieldAlert className="w-5 h-5"/></div>
          <div>
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Risk Exposure</p>
            <p className="text-xl font-black text-rose-700 mt-0.5 tabular-nums">{highRiskCount} Critical</p>
          </div>
        </div>
      </div>

      {/* Main Table Data Grid */}
      <div className="bg-white border border-slate-200/80 shadow-sm rounded-xl overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by entity or sector..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{filteredClients.length} Records Found</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-[10px] uppercase tracking-widest font-bold text-slate-400 border-b border-slate-200">
                <th className="px-6 py-4">Legal Entity</th>
                <th className="px-6 py-4">Sector / Method</th>
                <th className="px-6 py-4 text-right">TP Margin</th>
                <th className="px-6 py-4 text-right">Revenue (Cr)</th>
                <th className="px-6 py-4 text-center">Compliance</th>
                <th className="px-6 py-4">Risk Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id} 
                  onClick={() => setSelectedClient(client)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{client.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{client.parent_country} • {client.entity_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-700">{client.sector}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{client.tp_method}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-black text-slate-900 tabular-nums">{client.tp_margin}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-black text-slate-900 tabular-nums">₹{client.annual_revenue_cr}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-100">
                      <span className={`text-xs font-bold ${client.compliance_score >= 80 ? 'text-emerald-600' : client.compliance_score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {client.compliance_score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${riskStyles[client.risk_status]}`}>
                      {client.risk_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300 group-hover:text-indigo-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredClients.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-sm">
              No clients found matching your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* 🚀 THE CLIENT DOSSIER SLIDE-OUT 🚀 */}
      {selectedClient && (
        <ClientDossier 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}

    </div>
  );
}