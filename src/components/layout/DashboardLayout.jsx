import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  FileText,
  Layers,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { DashboardProviders } from '../../context/DashboardProviders.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { DashboardModals } from './DashboardModals.jsx';

const navCore = [
  { to: '/app/overview', id: 'overview', icon: BarChart3, label: 'Executive Overview' },
  { to: '/app/clients', id: 'clients', icon: Layers, label: 'Client Portfolios' },
  { to: '/app/reports', id: 'reports', icon: FileText, label: 'Strategy Reports' },
  { to: '/app/audit', id: 'audit', icon: Activity, label: 'Audit & Compliance' },
];

const titles = {
  overview: {
    title: 'Executive Overview',
    subtitle: 'High-level metrics and proprietary advisory modules.',
  },
  clients: {
    title: 'Client Portfolios',
    subtitle: 'Secure, master database of all active GCC entity structures.',
  },
  reports: {
    title: 'Strategy Reports',
    subtitle: 'Generate branded, partner-ready strategy memos.',
  },
  audit: {
    title: 'Audit & Compliance',
    subtitle: 'Immutable ledger of all firm-wide data access and modifications.',
  },
  settings: {
    title: 'Firm Settings & Security',
    subtitle: 'Manage your advisory firm profile, team access, and subscription preferences.',
  },
};

function pathToSection(pathname) {
  if (pathname.includes('/settings')) return 'settings';
  if (pathname.includes('/clients')) return 'clients';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/audit')) return 'audit';
  return 'overview';
}

function PageHeader() {
  const { pathname } = useLocation();
  const section = pathToSection(pathname);
  const meta = titles[section];

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500 print:hidden">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{meta.title}</h1>
      <p className="text-slate-500 mt-2 text-sm font-medium">{meta.subtitle}</p>
    </div>
  );
}

function DashboardShell() {
  const { session, signOut } = useAuth();
  const ui = useUI();

  const notifications = [
    { id: 1, text: 'TechNova Form 3CEFA Due', time: '2 Days', type: 'warning' },
    { id: 2, text: 'FinServe PE Risk Alert', time: 'Now', type: 'critical' },
    { id: 3, text: 'HealthAI TP Study Pending', time: '1 Week', type: 'info' },
  ];

  const userEmailName = session.user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 print:bg-white">
      {ui.mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => ui.setMobileSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0B132B] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out z-50 print:hidden ${
          ui.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#070D1F]">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-lg tracking-tight leading-tight">GCC Advisory</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Enterprise</p>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => ui.setMobileSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Core Platform</p>
          {navCore.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={() => ui.setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center px-4 py-3 rounded-xl group transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="font-semibold text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <NavLink
              to="/app/settings"
              onClick={() => ui.setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center px-4 py-3 rounded-xl group transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Settings
                    className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="font-semibold text-sm">Firm Settings</span>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        <div className="p-5 border-t border-white/5 bg-gradient-to-t from-[#070D1F] to-transparent">
          <div className="flex items-center px-4 py-3 mb-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-sm mr-3">
              {userEmailName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{userEmailName}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Partner</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0 supports-[backdrop-filter]:bg-white/60 print:hidden">
          <div className="flex items-center flex-1">
            <button
              type="button"
              className="lg:hidden mr-4 text-slate-500 hover:text-indigo-600 transition-colors"
              onClick={() => ui.setMobileSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="max-w-md w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                placeholder="Search clients, entities, or DTAA guidelines..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => ui.setNotificationCenterOpen(!ui.notificationCenterOpen)}
                className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
              </button>

              {ui.notificationCenterOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h4 className="font-bold text-slate-900">Alert Center</h4>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                      {notifications.length} New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {notif.text}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              notif.type === 'critical'
                                ? 'bg-rose-100 text-rose-700'
                                : notif.type === 'warning'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Click to view details</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/app/settings"
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
            >
              <Settings className="w-5 h-5" />
            </NavLink>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-10 pb-24 scroll-smooth print:p-0 print:overflow-visible">
          <PageHeader />
          <Outlet />
        </div>
      </main>

      <DashboardModals />
    </div>
  );
}

export function DashboardLayout() {
  const { session } = useAuth();

  return (
    <DashboardProviders session={session}>
      <DashboardShell />
    </DashboardProviders>
  );
}
