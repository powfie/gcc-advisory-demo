import React, { useState } from 'react';
import { X, FileText, Calendar, Layers, Users, ShieldAlert, Clock10, UploadCloud, Edit, Trash2, Building2, Activity } from 'lucide-react';
import { ComplianceScore } from '../ui/ComplianceScore';

const TABS = [
  { key: 'overview', icon: Layers, label: 'Overview' },
  { key: 'calendar', icon: Calendar, label: 'Calendar' },
  { key: 'tp', icon: FileText, label: 'Transfer Pricing' },
  { key: 'notices', icon: ShieldAlert, label: 'Notices' },
];

export function ClientDossier({ client, onClose }) {
  const [tab, setTab] = useState('overview');
  if (!client) return null;

  // Render the correct tab content
  const renderTabContent = () => {
    switch (tab) {
      case 'overview': return <OverviewTab client={client} />;
      case 'calendar': return <CalendarTab client={client} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <Clock10 className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm font-bold uppercase tracking-widest">Module in Development</p>
        </div>
      );
    }
  };

  return (
    <>
      {/* Dark Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-out Panel */}
      <div className="fixed top-0 right-0 w-full md:w-[45vw] lg:w-[35vw] max-w-2xl h-screen z-50 bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col border-l border-slate-200 animate-in slide-in-from-right-8 duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between pl-8 pr-6 pt-8 pb-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{client.name}</h2>
              <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                {client.entity_type} <span className="mx-2">•</span> {client.parent_country}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-slate-100 bg-slate-50/50">
          {TABS.map((t) => (
            <button 
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
                tab === t.key 
                ? 'border-indigo-600 text-indigo-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          {renderTabContent()}
        </div>

      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---

function OverviewTab({ client }) {
  const riskStyles = {
    Green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Amber: 'bg-amber-50 text-amber-700 border-amber-200',
    Red: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Top KPI Row */}
      <div className="flex items-center gap-8 p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        <ComplianceScore score={client.compliance_score || 85} size={80} />
        <div className="flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Profile</p>
          <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${riskStyles[client.risk_status] || riskStyles.Green}`}>
            {client.risk_status} Exposure
          </span>
          <p className="text-sm text-slate-500 mt-3 font-medium">
            Next audit cycle expected in Q3. Transfer pricing documentation is currently under review.
          </p>
        </div>
      </div>

      {/* Financial & Structural Data */}
      <div>
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-4 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-indigo-500" /> Entity Parameters
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-slate-200/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Revenue</span>
            <div className="text-lg font-black text-slate-900 mt-1 tabular-nums">₹{client.annual_revenue_cr} <span className="text-sm text-slate-500">Cr</span></div>
          </div>
          <div className="p-4 bg-white border border-slate-200/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TP Margin</span>
            <div className="text-lg font-black text-slate-900 mt-1 tabular-nums">{client.tp_margin}</div>
          </div>
          <div className="p-4 bg-white border border-slate-200/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing Method</span>
            <div className="text-sm font-bold text-slate-700 mt-1">{client.tp_method}</div>
          </div>
          <div className="p-4 bg-white border border-slate-200/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sector Focus</span>
            <div className="text-sm font-bold text-slate-700 mt-1">{client.sector}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarTab({ client }) {
  // Safe fallback if client.tasks doesn't exist yet
  const tasks = client.tasks || [
    { text: "Form 3CEB Filing", due: "2026-11-30", done: false, priority: "High" },
    { text: "Advance Tax Q2", due: "2026-09-15", done: true, priority: "Medium" }
  ];

  return (
    <div className="space-y-4 animate-in fade-in">
      {tasks.map((task, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200/60 rounded-xl">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${task.done ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`}></div>
            <div>
              <p className={`text-sm font-bold ${task.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.text}</p>
              <p className="text-xs text-slate-500 mt-0.5">{task.due}</p>
            </div>
          </div>
          {task.priority === 'High' && !task.done && (
            <span className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded">Critical</span>
          )}
        </div>
      ))}
    </div>
  );
}