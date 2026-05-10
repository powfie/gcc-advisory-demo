// src/pages/overview/OverviewPage.jsx
import React from 'react';
import {
  Building2, AlertTriangle, Globe, Activity, Clock,
  Calculator, Shield, ChevronRight, FileText, ShieldAlert, Plus
} from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { useUI } from '../../context/UIContext';
import { RiskBadge } from '../../components/ui/shared';
import { MOCK_DEADLINES } from '../../lib/data/mockData';

// ─── KPI Card ────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, icon: Icon, color, onClick, trend }) => {
  const colors = {
    indigo:  { bg: 'bg-indigo-50',   text: 'text-indigo-600',   glow: 'bg-indigo-50'  },
    rose:    { bg: 'bg-rose-50',     text: 'text-rose-600',     glow: 'bg-rose-50'    },
    amber:   { bg: 'bg-amber-50',    text: 'text-amber-600',    glow: 'bg-amber-50'   },
    emerald: { bg: 'bg-emerald-50',  text: 'text-emerald-600',  glow: 'bg-emerald-50' },
    violet:  { bg: 'bg-violet-50',   text: 'text-violet-600',   glow: 'bg-violet-50'  },
  };
  const c = colors[color] || colors.indigo;
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center relative overflow-hidden group w-full text-left"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 ${c.glow} rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />
      <div className={`w-12 h-12 ${c.bg} ${c.text} rounded-xl flex items-center justify-center mr-4 ring-1 ring-black/5 flex-shrink-0 z-10`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="z-10 min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 truncate">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        {trend && <p className="text-xs text-slate-400 font-medium mt-0.5">{trend}</p>}
      </div>
    </button>
  );
};

// ─── Tool Card ───────────────────────────────────────────────────────────────
const ToolCard = ({ icon: Icon, title, description, badge, badgeColor, onClick, accentColor }) => {
  const accent = accentColor === 'emerald' ? 'group-hover:bg-emerald-600' : 'group-hover:bg-indigo-600';
  const link = accentColor === 'emerald' ? 'text-emerald-600' : 'text-indigo-600';
  return (
    <button
      onClick={onClick}
      className="bg-white p-7 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between text-left relative overflow-hidden w-full"
    >
      {badge && (
        <div className={`absolute top-0 right-0 ${badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider`}>
          {badge}
        </div>
      )}
      <div>
        <div className={`w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center mb-5 ${accent} transition-colors duration-300`}>
          <Icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="font-bold text-base text-slate-900 mb-1.5">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
      <div className={`flex items-center ${link} font-semibold text-sm mt-5 group-hover:translate-x-1 transition-transform`}>
        Launch Module <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </button>
  );
};

// ─── TP Threshold Card ────────────────────────────────────────────────────────
const ThresholdCard = ({ icon: Icon, label, threshold, sub, penalty, penaltyType }) => (
  <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-300 transition-all cursor-default">
    <div className="flex justify-between items-start mb-1.5">
      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center">
        <Icon className="w-3 h-3 mr-1" /> {label}
      </p>
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm ${penaltyType === 'severe' ? 'bg-rose-100 text-rose-700 border border-rose-200/50' : 'bg-slate-200 text-slate-600'}`}>
        {penalty}
      </span>
    </div>
    <p className="text-sm font-extrabold text-slate-900">{threshold}</p>
    {sub && <p className="text-[11px] font-bold text-slate-500 mt-1 flex items-center"><Plus className="w-3 h-3 mr-1 text-slate-400" />{sub}</p>}
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OverviewPage() {
  const { clients, expats, isLoading } = useClients();
  const { navigate, openModal } = useUI();

  const kpis = [
    { label: 'Active GCCs',         value: clients.length,                                         icon: Building2,    color: 'indigo',  onClick: () => navigate('clients') },
    { label: 'High Risk Entities',  value: clients.filter(c => c.risk_status !== 'Green').length,  icon: AlertTriangle,color: 'rose',    onClick: () => navigate('clients') },
    { label: 'Expat PE Watchlist',  value: expats.filter(e => e.days_in_india >= 60).length,       icon: Globe,        color: 'amber',   onClick: () => navigate('expat')   },
    { label: 'Filings Due (30d)',   value: MOCK_DEADLINES.filter(d => {
        const days = Math.ceil((new Date(d.date) - new Date()) / 86400000);
        return days >= 0 && days <= 30;
      }).length,                                                                                     icon: Clock,        color: 'violet',  onClick: () => navigate('compliance') },
  ];

  const tools = [
    { id: 'entity', icon: Building2,  title: 'Entity Structuring Lab',      description: 'Compare WOS, Branch, LLP, JV structures. Model setup cost and incorporation timeline.' },
    { id: 'tp',     icon: Calculator, title: 'Transfer Pricing Suite',       description: 'Safe Harbour analyser, TNMM benchmarking engine and TP documentation generator.' },
    { id: 'expat',  icon: Globe,      title: 'PE Risk & Expat Tracker',      description: 'Real-time monitoring of Fixed-place Establishment and Service PE triggers.', badge: 'Live Risk', badgeColor: 'bg-rose-500' },
    { id: 'fema',   icon: Shield,     title: 'Advanced ETR / Pillar Two',    description: 'GloBE income, SBIE exclusion, QDMTT offset — full Pillar Two modelling.' },
    { id: 'clients',icon: Activity,   title: 'DTAA Analyzer',                description: 'Withholding rates for 96 treaties — dividends, interest, royalties and FTS.', },
    { id: 'entity', icon: Globe,      title: 'GIFT City / SEZ Optimizer',    description: '10-year tax holiday model with MAT credits and state subsidies.', badge: 'High ROI', badgeColor: 'bg-emerald-500', accentColor: 'emerald' },
  ];

  return (
    <div className="space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => <KpiCard key={i} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Advisory Tools */}
        <div className="xl:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-indigo-600" /> Proprietary Advisory Engines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tools.map((t, i) => (
              <ToolCard key={i} {...t} onClick={() => navigate(t.id)} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Deadlines */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" /> Upcoming Deadlines
            </h2>
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">FY 2025-26</span>
                <button onClick={() => navigate('compliance')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                  View All →
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {MOCK_DEADLINES.slice(0, 5).map(d => {
                  const daysLeft = Math.ceil((new Date(d.date) - new Date()) / 86400000);
                  const isUrgent = daysLeft <= 7;
                  const isOverdue = daysLeft < 0;
                  return (
                    <div key={d.id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => navigate('compliance')}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isOverdue ? 'bg-rose-100 text-rose-700' :
                          isUrgent  ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {isOverdue ? 'Overdue' : isUrgent ? `${daysLeft}d left` : d.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium leading-snug">{d.task}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TP & CbCR Thresholds */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-5">
            <h3 className="text-xs font-extrabold text-slate-900 mb-4 flex items-center uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 mr-2 text-rose-600" /> TP & CbCR Thresholds
            </h3>
            <div className="space-y-3">
              <ThresholdCard
                icon={FileText}
                label="Local File (Form 3CEB)"
                threshold="Int'l Txns > ₹1 Crore"
                penalty="Penalty: 2% Txn Val"
                penaltyType="normal"
              />
              <ThresholdCard
                icon={FileText}
                label="Master File (Form 3CEAA)"
                threshold="Cons. Rev > ₹500 Cr"
                sub="Int'l Txns > ₹50 Cr"
                penalty="Penalty: ₹5 Lakhs"
                penaltyType="severe"
              />
              <ThresholdCard
                icon={Globe}
                label="CbCR (Form 3CEAD)"
                threshold="Global Rev > ₹6,400 Cr"
                penalty="Penalty: ₹5K/Day"
                penaltyType="severe"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}