// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import {
  Building2, BarChart3, Layers, FileText, Activity, Settings,
  Globe, Calculator, Shield, Users, FolderOpen, Newspaper,
  AlertCircle, BookOpen, X, LogOut, ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useUI } from '../../context/UIContext';

const NAV_GROUPS = [
  {
    label: 'Intelligence',
    items: [
      { id: 'overview',    icon: BarChart3,   label: 'Command Centre',       shortcut: 'G O' },
      { id: 'regulatory',  icon: Newspaper,   label: 'Regulatory Feed',      shortcut: 'G R' },
    ],
  },
  {
    label: 'Client Management',
    items: [
      { id: 'clients',     icon: Layers,      label: 'Client Portfolios',    shortcut: 'G C' },
      { id: 'notices',     icon: AlertCircle, label: 'Notice Manager',       shortcut: 'G N' },
    ],
  },
  {
    label: 'Tax Tools',
    items: [
      { id: 'tp',          icon: Calculator,  label: 'Transfer Pricing',     shortcut: 'G T' },
      { id: 'fema',        icon: Globe,       label: 'FEMA & RBI',           shortcut: 'G F' },
      { id: 'gst',         icon: FileText,    label: 'GST Intelligence',     shortcut: 'G G' },
      { id: 'entity',      icon: Building2,   label: 'Entity Structuring',   shortcut: 'G E' },
    ],
  },
  {
    label: 'Advisory',
    items: [
      { id: 'expat',       icon: Users,       label: 'Expat & Payroll',      shortcut: 'G X' },
      { id: 'documents',   icon: FolderOpen,  label: 'Document Vault',       shortcut: 'G D' },
      { id: 'ica',         icon: BookOpen,    label: 'ICA Builder',          shortcut: ''    },
      { id: 'reports',     icon: FileText,    label: 'Strategy Reports',     shortcut: 'G S' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'compliance',  icon: Shield,      label: 'Compliance Calendar',  shortcut: 'G K' },
      { id: 'audit',       icon: Activity,    label: 'Audit Trail',          shortcut: ''    },
      { id: 'settings',    icon: Settings,    label: 'Firm Settings',        shortcut: ''    },
    ],
  },
];

export default function Sidebar() {
  const { session, sidebarOpen, setSidebarOpen, handleSignOut } = useApp();
  const { currentView, navigate } = useUI();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const userEmail = session?.user?.email || '';
  const userName = userEmail.split('@')[0];
  const userInitial = userName.charAt(0).toUpperCase();

  const handleNav = (id) => {
    navigate(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen bg-[#0B132B] text-slate-300 flex flex-col
        transition-all duration-300 ease-in-out z-50 print:hidden
        ${collapsed ? 'w-[72px]' : 'w-72'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Logo */}
        <div className="h-20 flex items-center px-5 border-b border-white/5 bg-[#070D1F] flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden flex-1">
              <h1 className="text-white font-extrabold text-base tracking-tight leading-tight truncate">GCC Advisory Pro</h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Enterprise</p>
            </div>
          )}
          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex ml-auto text-slate-600 hover:text-slate-300 transition-colors p-1"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${collapsed ? '-rotate-90' : 'rotate-90'}`} />
          </button>
          {/* Mobile close */}
          <button className="lg:hidden ml-auto text-slate-400 hover:text-white p-1" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-hide">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => handleNav(item.id)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`
                          w-full flex items-center rounded-xl transition-all duration-150 group
                          ${collapsed ? 'px-0 py-3 justify-center' : 'px-3 py-2.5'}
                          ${isActive
                            ? 'bg-indigo-600/15 text-indigo-300'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                        `}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-500 rounded-r-full" />
                        )}
                        <item.icon className={`flex-shrink-0 transition-transform duration-150 ${collapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                        {!collapsed && (
                          <span className="font-semibold text-sm flex-1 text-left truncate">{item.label}</span>
                        )}
                        {/* Shortcut hint */}
                        {!collapsed && item.shortcut && hoveredItem === item.id && (
                          <span className="text-[10px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                            {item.shortcut}
                          </span>
                        )}
                      </button>

                      {/* Collapsed tooltip */}
                      {collapsed && hoveredItem === item.id && (
                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 pointer-events-none">
                          {item.label}
                          {item.shortcut && <span className="ml-2 text-slate-500 font-mono">{item.shortcut}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-white/5 bg-gradient-to-t from-[#070D1F] to-transparent flex-shrink-0">
          {!collapsed ? (
            <>
              <div className="flex items-center px-3 py-2.5 mb-2 bg-white/5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-sm mr-3 flex-shrink-0">
                  {userInitial}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-bold text-white truncate">{userName}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Partner · Admin</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center px-3 py-2 text-sm font-semibold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className="w-full flex justify-center py-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}