import React from 'react';
import { 
  Building2, BarChart3, Newspaper, Layers, AlertOctagon, 
  Calculator, Globe, FileText, Users, FolderOpen, BookOpen, 
  Activity, Settings, X, LogOut, CalendarDays 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const NAV = [
  { group: 'Intelligence', items: [{ id: 'overview', icon: BarChart3, label: 'Command Centre' }, { id: 'regulatory', icon: Newspaper, label: 'Regulatory Feed' }] },
  { group: 'Client Management', items: [{ id: 'clients', icon: Layers, label: 'Client Portfolios' }, { id: 'notices', icon: AlertOctagon, label: 'Notice Manager' }] },
  { group: 'Tax Tools', items: [{ id: 'tp', icon: Calculator, label: 'Transfer Pricing' }, { id: 'fema', icon: Globe, label: 'FEMA & RBI' }, { id: 'gst', icon: FileText, label: 'GST Intelligence' }, { id: 'entity', icon: Building2, label: 'Entity Structuring' }] },
  { group: 'Advisory', items: [{ id: 'expat', icon: Users, label: 'Expat & Payroll' }, { id: 'documents', icon: FolderOpen, label: 'Document Vault' }, { id: 'ica', icon: BookOpen, label: 'ICA Builder' }, { id: 'reports', icon: FileText, label: 'Strategy Reports' }] },
  // 👇 Updated this line to use id: 'calendar' and the CalendarDays icon
  { group: 'Operations', items: [{ id: 'calendar', icon: CalendarDays, label: 'Compliance Calendar' }, { id: 'audit', icon: Activity, label: 'Audit Trail' }, { id: 'settings', icon: Settings, label: 'Firm Settings' }] },
];

export function Sidebar({ currentView, onNav, sidebarOpen, setSidebarOpen }) {
  const { session } = useAuth();
  const userName = session?.user?.email?.split('@')[0] || 'Partner';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0B132B] text-slate-300 flex flex-col transition-transform duration-300 z-50 print:hidden flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center h-20 px-6 border-b shrink-0 border-white/5 bg-[#070D1F]">
        <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-extrabold tracking-tight text-white truncate">GCC Advisory Pro</h1>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Enterprise</p>
        </div>
        <button className="ml-2 text-slate-400 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-5">
        {NAV.map(group => (
          <div key={group.group}>
            <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">{group.group}</p>
            {group.items.map(item => (
              <button 
                key={item.id} 
                onClick={() => onNav(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl mb-0.5 transition-all group relative ${currentView === item.id ? 'bg-indigo-600/15 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
              >
                {currentView === item.id && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-500 rounded-r-full" />}
                <item.icon className={`flex-shrink-0 w-4 h-4 mr-3 ${currentView === item.id ? 'scale-110' : ''}`} />
                <span className="text-sm font-semibold truncate">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t shrink-0 border-white/5">
        <div className="flex items-center px-3 py-2.5 mb-2 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center justify-center shrink-0 w-8 h-8 mr-3 text-sm font-bold rounded-full bg-indigo-500/30 text-indigo-300">
            {userName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Partner · Admin</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="flex items-center justify-center w-full py-2 text-sm font-semibold transition-colors rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10">
          <LogOut className="w-4 h-4 mr-2" />Sign Out
        </button>
      </div>
    </aside>
  );
}