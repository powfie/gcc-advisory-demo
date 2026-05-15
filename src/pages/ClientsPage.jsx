import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, MoreVertical, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

export default function ClientsPage() {
  const { clients } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskBadge = (status) => {
    switch(status) {
      case 'Green': return <span className="flex items-center px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-lg"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Compliant</span>;
      case 'Amber': return <span className="flex items-center px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-100 rounded-lg"><Shield className="w-3.5 h-3.5 mr-1" /> Monitor</span>;
      case 'Red': return <span className="flex items-center px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-100 rounded-lg"><ShieldAlert className="w-3.5 h-3.5 mr-1" /> High Risk</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 bg-white border shadow-sm border-slate-200/80 rounded-2xl">
        <div className="relative w-full max-w-md">
          <Search className="absolute w-5 h-5 left-3 top-2.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by entity name or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 text-sm font-medium transition-colors border rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button className="flex items-center px-4 py-2.5 text-sm font-bold transition-colors bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border shadow-sm border-slate-200/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                <th className="px-6 py-4">Entity Details</th>
                <th className="px-6 py-4">Structure</th>
                <th className="px-6 py-4">TP Method</th>
                <th className="px-6 py-4">Risk Profile</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-slate-50/80 group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{client.name}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{client.parent_company} ({client.parent_country})</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-700">{client.entity_type}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{client.sector}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60">
                      {client.tp_method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getRiskBadge(client.risk_status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 transition-colors rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}