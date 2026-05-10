import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Calculator,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Layers,
  MapPin,
  ShieldAlert,
  Plus,
  Landmark,
} from 'lucide-react';
import { useClient } from '../context/ClientContext.jsx';
import { useCompliance } from '../context/ComplianceContext.jsx';
import { MODAL_KEYS, useUI } from '../context/UIContext.jsx';

const deadlines = [
  { id: 1, date: 'May 10', task: 'HealthAI Innovation Labs - TP Study Review', status: 'Pending' },
  { id: 2, date: 'May 15', task: 'TechNova India - Form 3CEFA Filing', status: 'Urgent' },
  { id: 3, date: 'May 30', task: 'Quantum Logistics - Master File Prep', status: 'Scheduled' },
];

export default function OverviewPage() {
  const { clients } = useClient();
  const { expats } = useCompliance();
  const ui = useUI();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active GCCs', val: clients.length, icon: Building2, color: 'indigo' },
          {
            label: 'High Risk Entities',
            val: clients.filter((cl) => cl.risk_status !== 'Green').length,
            icon: AlertTriangle,
            color: 'rose',
          },
          {
            label: 'Expat PE Watchlist',
            val: expats.filter((e) => e.days_in_india >= 60).length,
            icon: Globe,
            color: 'amber',
          },
          { label: 'Firm Health', val: '100%', icon: Activity, color: 'emerald' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex items-center relative overflow-hidden group"
          >
            <div
              className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-50 rounded-full blur-2xl group-hover:bg-${stat.color}-100 transition-colors`}
            />
            <div
              className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center mr-5 ring-1 ring-${stat.color}-100 z-10`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="z-10">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-extrabold text-slate-900">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        <div className="xl:col-span-2 flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-indigo-600" /> Proprietary Advisory Engines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            <button
              type="button"
              onClick={() => ui.openModal(MODAL_KEYS.entity)}
              className="text-left bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Layers className="w-6 h-6 text-slate-600 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Entity Structuring Simulator</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Model WOS, BOT, JV, and LLP scenarios to find the optimal tax structure for inbound GCCs.
                </p>
              </div>
              <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Launch Module <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => ui.openModal(MODAL_KEYS.tpEngine)}
              className="text-left bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Calculator className="w-6 h-6 text-slate-600 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Budget 2026 TP Engine</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Click to calculate the new 15.5% unified Safe Harbour margin.
                </p>
              </div>
              <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Launch Module <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => ui.openModal(MODAL_KEYS.peExpat)}
              className="text-left bg-white p-8 rounded-2xl border border-indigo-200/60 shadow-sm hover:shadow-xl hover:border-indigo-400 hover:ring-1 hover:ring-indigo-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider animate-pulse">
                Live Risk
              </div>
              <div>
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                  <Globe className="w-6 h-6 text-rose-600 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">PE Risk & Expat Tracker</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Real-time monitoring of Fixed-place Establishment triggers.
                </p>
              </div>
              <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Launch Module <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => ui.openModal(MODAL_KEYS.etr)}
              className="text-left bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <BarChart3 className="w-6 h-6 text-slate-600 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Advanced ETR Modeling</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">Pillar Two Effective Tax Rate analysis for MNCs.</p>
              </div>
              <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Launch Module <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => ui.openModal(MODAL_KEYS.dtaa)}
              className="text-left bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Landmark className="w-6 h-6 text-slate-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">DTAA Analyzer</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-md">
                    Calculate exact withholding tax liabilities for cross-border dividend transfers under treaties.
                  </p>
                </div>
              </div>
              <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Launch Module <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => ui.openModal(MODAL_KEYS.sez)}
              className="text-left bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
                High ROI
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-slate-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">GIFT City / SEZ Optimizer</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-md">
                    Forecast 10-year tax holidays (100% exemption) incorporating MAT credits and state subsidies.
                  </p>
                </div>
              </div>
              <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Launch Module <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" /> Compliance Deadlines
          </h2>
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm flex-none p-0 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="font-bold text-slate-700 text-sm">FY 2026-27 Routine</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative pl-5">
                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50" />
                <div className="absolute left-1 top-4 bottom-[-24px] w-[2px] bg-slate-100" />
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">May 2026</h4>
                <div className="space-y-4">
                  {deadlines.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-900 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {item.date}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                            item.status === 'Urgent'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200/50'
                              : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-snug">{item.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm flex-1 p-6 mt-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/50 rounded-bl-full -z-10 blur-2xl transition-all group-hover:bg-rose-100/50" />
            <h2 className="text-sm font-extrabold text-slate-900 mb-5 flex items-center uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 mr-2 text-rose-600" /> TP & CbCR Thresholds
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-300 transition-all cursor-default">
                <div className="flex justify-between items-start mb-1.5">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center">
                    <FileText className="w-3 h-3 mr-1" /> Local File (Form 3CEB)
                  </p>
                  <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded shadow-sm">
                    Penalty: 2% Txn Val
                  </span>
                </div>
                <p className="text-sm font-extrabold text-slate-900">Int&apos;l Txns &gt; ₹1 Crore</p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-300 transition-all cursor-default">
                <div className="flex justify-between items-start mb-1.5">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center">
                    <FileText className="w-3 h-3 mr-1" /> Master File (Form 3CEAA)
                  </p>
                  <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded shadow-sm border border-rose-200/50">
                    Penalty: ₹5 Lakhs
                  </span>
                </div>
                <p className="text-sm font-extrabold text-slate-900">Cons. Rev &gt; ₹500 Cr</p>
                <p className="text-[11px] font-bold text-slate-500 mt-1.5 flex items-center">
                  <Plus className="w-3 h-3 mr-1 text-slate-400" /> Int&apos;l Txns &gt; ₹50 Cr
                </p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-300 transition-all cursor-default">
                <div className="flex justify-between items-start mb-1.5">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center">
                    <Globe className="w-3 h-3 mr-1" /> CbCR (Form 3CEAD)
                  </p>
                  <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded shadow-sm border border-rose-200/50">
                    Penalty: ₹5K/Day
                  </span>
                </div>
                <p className="text-sm font-extrabold text-slate-900">Global Rev &gt; ₹6,400 Cr</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
