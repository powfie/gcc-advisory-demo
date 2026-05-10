// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, Menu, ChevronRight, AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useUI } from '../../context/UIContext';
import { useClients } from '../../context/ClientContext';
import { MOCK_NOTIFICATIONS } from '../../lib/data/mockData';

const PAGE_LABELS = {
  overview:    'Command Centre',
  regulatory:  'Regulatory Feed',
  clients:     'Client Portfolios',
  notices:     'Notice Manager',
  tp:          'Transfer Pricing Suite',
  fema:        'FEMA & RBI Compliance',
  gst:         'GST Intelligence',
  entity:      'Entity Structuring Lab',
  expat:       'Expat & Shadow Payroll',
  documents:   'Document Vault',
  ica:         'ICA Builder',
  reports:     'Strategy Reports',
  compliance:  'Compliance Calendar',
  audit:       'Audit Trail',
  settings:    'Firm Settings',
};

const NotifIcon = ({ type }) => {
  if (type === 'critical') return <AlertOctagon className="w-4 h-4 text-rose-500" />;
  if (type === 'warning')  return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  return <Info className="w-4 h-4 text-indigo-500" />;
};

export default function Header() {
  const { setSidebarOpen } = useApp();
  const { currentView, navigate, setCommandPaletteOpen } = useUI();
  const { clients } = useClients();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const unreadCount = notifications.length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Live search
  useEffect(() => {
    if (!searchValue.trim()) { setSearchResults([]); return; }
    const q = searchValue.toLowerCase();
    const results = clients
      .filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.entity_type.toLowerCase().includes(q) ||
        c.sector?.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(c => ({ type: 'client', label: c.name, sub: c.entity_type, id: c.id }));
    setSearchResults(results);
  }, [searchValue, clients]);

  const dismissNotif = (e, id) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotifClick = (notif) => {
    navigate(notif.link);
    setNotifOpen(false);
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 print:hidden flex-shrink-0">

      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="lg:hidden text-slate-500 hover:text-indigo-600 transition-colors flex-shrink-0"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm min-w-0">
          <span className="text-slate-400 font-medium hidden sm:block flex-shrink-0">GCC Advisory Pro</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1.5 hidden sm:block flex-shrink-0" />
          <span className="font-bold text-slate-800 truncate">{PAGE_LABELS[currentView] || currentView}</span>
        </div>
      </div>

      {/* Center: search bar */}
      <div ref={searchRef} className="relative hidden md:block w-72 lg:w-96 mx-4">
        <div className="flex items-center">
          <div className="absolute left-3.5 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={e => { setSearchValue(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search clients, tools… (⌘K)"
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm cursor-text"
            onClick={() => setCommandPaletteOpen(true)}
            readOnly
          />
        </div>

        {/* Search dropdown */}
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
            {searchResults.map((r) => (
              <button key={r.id}
                onClick={() => { navigate('clients'); setSearchOpen(false); setSearchValue(''); }}
                className="w-full flex items-center px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                  {r.label.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{r.label}</p>
                  <p className="text-xs text-slate-400">{r.sub}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: date + notifications */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Date */}
        <span className="hidden xl:block text-xs text-slate-400 font-medium mr-2">{today}</span>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-xl hover:bg-indigo-50"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/80">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                  <p className="text-xs text-slate-500">{unreadCount} unread alerts</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 font-medium">All caught up</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className="flex items-start p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex-shrink-0 mr-3 mt-0.5">
                        <NotifIcon type={n.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">
                          {n.text}
                        </p>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          n.type === 'critical' ? 'bg-rose-100 text-rose-700' :
                          n.type === 'warning'  ? 'bg-amber-100 text-amber-700' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>{n.time}</span>
                      </div>
                      <button
                        onClick={(e) => dismissNotif(e, n.id)}
                        className="flex-shrink-0 ml-2 text-slate-300 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}