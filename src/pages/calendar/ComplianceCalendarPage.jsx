import React, { useState } from 'react';
import { 
  CalendarDays, Globe, ShieldAlert, CheckCircle2, 
  Clock, AlertTriangle, Filter, Search, Building2, 
  FileText, ArrowUpRight
} from 'lucide-react';

// --- MOCK GCC REGULATORY DATA ---
const REGULATORY_TASKS = [
  { id: 1, entity: 'NovaPharma R&D', jurisdiction: 'KSA', regulator: 'ZATCA', task: 'Corporate Income Tax Return', dueDate: '2026-04-30', status: 'Overdue', penaltyRisk: 2500000, type: 'Tax' },
  { id: 2, entity: 'TechNova India Pvt Ltd', jurisdiction: 'UAE', regulator: 'FTA', task: 'VAT Return Q1', dueDate: '2026-05-28', status: 'Due Soon', penaltyRisk: 500000, type: 'Tax' },
  { id: 3, entity: 'Gulf Capital Partners', jurisdiction: 'DIFC', regulator: 'DFSA', task: 'Annual AML Return', dueDate: '2026-06-15', status: 'Upcoming', penaltyRisk: 1200000, type: 'Compliance' },
  { id: 4, entity: 'NovaPharma R&D', jurisdiction: 'KSA', regulator: 'HRSD', task: 'Nitaqat Saudization Update', dueDate: '2026-06-30', status: 'Upcoming', penaltyRisk: 800000, type: 'Labor' },
  { id: 5, entity: 'TechNova India Pvt Ltd', jurisdiction: 'UAE', regulator: 'MoE', task: 'ESR Notification (Economic Substance)', dueDate: '2026-06-30', status: 'Upcoming', penaltyRisk: 400000, type: 'Compliance' },
  { id: 6, entity: 'Oman Energy Solutions', jurisdiction: 'Oman', regulator: 'OTA', task: 'Withholding Tax Filing', dueDate: '2026-05-14', status: 'Compliant', penaltyRisk: 0, type: 'Tax' },
];

export default function ComplianceCalendarPage() {
  const [filterJur, setFilterJur] = useState('All');
  const [search, setSearch] = useState('');

  // Derived Analytics
  const filteredTasks = REGULATORY_TASKS.filter(t => 
    (filterJur === 'All' || t.jurisdiction === filterJur) &&
    (t.entity.toLowerCase().includes(search.toLowerCase()) || t.task.toLowerCase().includes(search.toLowerCase()))
  );

  const capitalAtRisk = filteredTasks
    .filter(t => t.status === 'Overdue' || t.status === 'Due Soon')
    .reduce((sum, t) => sum + t.penaltyRisk, 0);

  const overdueCount = filteredTasks.filter(t => t.status === 'Overdue').length;
  const activeJurisdictions = [...new Set(filteredTasks.map(t => t.jurisdiction))].length;

  // Group tasks by Month for the Ledger View
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const month = new Date(task.dueDate).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(task);
    return acc;
  }, {});

  // Sort months chronologically
  const sortedMonths = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));

  // Semantic UI Maps
  const statusConfig = {
    'Compliant': { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
    'Upcoming': { color: 'text-slate-700 bg-slate-100 border-slate-200', icon: Clock },
    'Due Soon': { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle },
    'Overdue': { color: 'text-rose-700 bg-rose-50 border-rose-200', icon: ShieldAlert },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* HEADER: Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-slate-200/80 shadow-sm rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
        <div className="p-5 flex flex-col justify-between bg-rose-50/30">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Capital at Risk (Penalties)</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-light text-rose-400">₹</span>
            <span className="text-3xl font-black text-rose-700 tracking-tight tabular-nums">{(capitalAtRisk / 100000).toFixed(1)}</span>
            <span className="text-sm font-semibold text-rose-500">Lakhs</span>
          </div>
          <div className="mt-2 text-[10px] font-bold text-rose-600 flex items-center">
            Across {overdueCount} critical / due-soon filings
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Jurisdictions</span>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{activeJurisdictions}</span>
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-500 flex items-center">
            KSA, UAE, DIFC, Oman
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Approaching</span>
            <CalendarDays className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{filteredTasks.length}</span>
            <span className="text-sm font-semibold text-slate-500">Filings</span>
          </div>
          <div className="mt-2 text-[10px] font-bold text-indigo-600 flex items-center bg-indigo-50 w-max px-2 py-0.5 rounded">
            Next 90 Days
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: Ledger & Filters */}
      <div className="bg-white border border-slate-200/80 shadow-sm rounded-xl overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search entity or filing..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            {['All', 'KSA', 'UAE', 'DIFC'].map(jur => (
              <button 
                key={jur}
                onClick={() => setFilterJur(jur)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors border ${
                  filterJur === jur 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {jur}
              </button>
            ))}
          </div>
        </div>

        {/* Chronological Ledger */}
        <div className="p-6 space-y-8 bg-slate-50/30">
          {sortedMonths.length === 0 ? (
            <div className="text-center p-12 text-slate-500 text-sm font-medium">No deadlines match your criteria.</div>
          ) : (
            sortedMonths.map(month => (
              <div key={month} className="relative">
                {/* Month Separator */}
                <div className="flex items-center mb-4 sticky top-0 bg-white/80 backdrop-blur py-2 z-10 -mx-6 px-6 border-y border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{month}</h3>
                  <div className="ml-4 h-px flex-1 bg-slate-200/60"></div>
                </div>

                {/* Task Rows */}
                <div className="space-y-3">
                  {groupedTasks[month].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map(task => {
                    const StatusIcon = statusConfig[task.status].icon;
                    return (
                      <div 
                        key={task.id} 
                        className={`flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all group ${
                          task.status === 'Overdue' ? 'border-rose-200 shadow-sm' : 'border-slate-200/60'
                        }`}
                      >
                        {/* Left: Date & Entity */}
                        <div className="flex items-center gap-5 md:w-2/5">
                          <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 border border-slate-100 rounded-lg shrink-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(task.dueDate).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-lg font-black text-slate-900 leading-none tabular-nums mt-0.5">{new Date(task.dueDate).getDate()}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.task}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-600">{task.entity}</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle: Jurisdiction & Regulator */}
                        <div className="mt-4 md:mt-0 flex items-center gap-3 md:w-1/4">
                          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 rounded border border-slate-200">
                            {task.jurisdiction}
                          </span>
                          <span className="flex items-center text-xs font-bold text-slate-700">
                            <FileText className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> {task.regulator}
                          </span>
                        </div>

                        {/* Right: Status & Penalty Risk */}
                        <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                          {task.penaltyRisk > 0 && (
                            <div className="text-right">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Est. Penalty</p>
                              <p className="text-sm font-black text-rose-600 tabular-nums">₹{(task.penaltyRisk / 100000).toFixed(1)}L</p>
                            </div>
                          )}
                          <div className={`flex items-center px-3 py-1.5 rounded-lg border ${statusConfig[task.status].color}`}>
                            <StatusIcon className="w-3.5 h-3.5 mr-2 shrink-0" />
                            <span className="text-xs font-bold tracking-wide">{task.status}</span>
                          </div>
                          <button className="hidden md:flex p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}