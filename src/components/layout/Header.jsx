import React, { useState } from 'react';
import { Menu, ChevronRight, Search, Bell } from 'lucide-react';
import { PAGE_META } from '../../lib/constants';

export function Header({ currentView, setSidebarOpen, onNav }) {
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'James Wilson — PE Triggered (94 days)', time: 'Critical', type: 'critical', link: 'expat' },
  ]);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const title = PAGE_META[currentView]?.title || currentView;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-white/80 backdrop-blur-xl border-slate-200/80 lg:px-8 print:hidden">
      <div className="flex items-center min-w-0 gap-3">
        <button className="text-slate-500 hover:text-indigo-600 lg:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center min-w-0 text-sm">
          <span className="shrink-0 hidden font-medium text-slate-400 sm:block">GCC Advisory Pro</span>
          <ChevronRight className="shrink-0 hidden mx-1.5 w-3.5 h-3.5 text-slate-300 sm:block" />
          <span className="font-bold truncate text-slate-800">{title}</span>
        </div>
      </div>

      <div className="items-center flex-1 hidden max-w-xs mx-4 md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={() => onNav('clients')}
            placeholder="Search clients… (⌘K)"
            className="w-full py-2 pl-9 pr-4 text-sm transition-shadow border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden text-xs font-medium text-slate-400 xl:block">{today}</span>
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 transition-colors rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && <span className="absolute flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white border-2 border-white rounded-full bg-rose-500 top-1 right-1">{notifications.length}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}