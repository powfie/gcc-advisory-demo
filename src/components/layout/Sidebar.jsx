import React, { useState } from 'react';
import { 
  LayoutDashboard, Rss, Building2, MailWarning, 
  Calculator, Landmark, Receipt, FlaskConical, 
  PlaneTakeoff, FolderLock, FileSignature, FileBarChart,
  CalendarCheck, History, Settings, ChevronLeft, ChevronRight,
  Check, Edit2, X
} from 'lucide-react';
import { useUI } from '../../context/UIContext';

const NAVIGATION_GROUPS = [
  {
    label: 'Intelligence',
    items: [
      { id: 'command-centre', label: 'Command Centre', icon: LayoutDashboard, shortcut: 'G O' },
      { id: 'regulatory-feed', label: 'Regulatory Feed', icon: Rss, shortcut: 'G R' },
    ]
  },
  {
    label: 'Client Mgmt',
    items: [
      { id: 'clients', label: 'Client Portfolios', icon: Building2, shortcut: 'G C' },
      { id: 'notices', label: 'Notice Manager', icon: MailWarning, shortcut: 'G N' },
    ]
  },
  {
    label: 'Tax Tools',
    items: [
      { id: 'tp-suite', label: 'Transfer Pricing', icon: Calculator, shortcut: 'G T' },
      { id: 'fema', label: 'FEMA & RBI', icon: Landmark, shortcut: 'G F' },
      { id: 'gst', label: 'GST Intelligence', icon: Receipt, shortcut: 'G G' },
      { id: 'entity-lab', label: 'Entity Lab', icon: FlaskConical, shortcut: 'G E' },
    ]
  },
  {
    label: 'Advisory',
    items: [
      { id: 'expat', label: 'Expat & Payroll', icon: PlaneTakeoff, shortcut: 'G X' },
      { id: 'vault', label: 'Document Vault', icon: FolderLock, shortcut: 'G D' },
      { id: 'ica-builder', label: 'ICA Builder', icon: FileSignature, shortcut: 'G I' },
      { id: 'reports', label: 'Reports', icon: FileBarChart, shortcut: 'G P' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'calendar', label: 'Compliance Calendar', icon: CalendarCheck, shortcut: 'G K' },
      { id: 'audit', label: 'Audit Trail', icon: History, shortcut: 'G A' },
      { id: 'settings', label: 'Settings', icon: Settings, shortcut: 'G S' },
    ]
  }
];

export function Sidebar({ activeView = 'command-centre', onViewChange }) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUI();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [firmName, setFirmName] = useState('GCC Advisory Pro');
  const [isEditingFirm, setIsEditingFirm] = useState(false);
  const [tempFirmName, setTempFirmName] = useState('');

  const handleEditFirm = () => {
    setTempFirmName(firmName);
    setIsEditingFirm(true);
  };

  const saveFirmName = () => {
    if (tempFirmName.trim()) setFirmName(tempFirmName.trim());
    setIsEditingFirm(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out
          flex flex-col bg-slate-900 border-r border-slate-800
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header / Firm Name */}
        <div className="flex items-center h-16 px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600 shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center flex-1 min-w-0 ml-3">
              {isEditingFirm ? (
                <div className="flex items-center w-full gap-1">
                  <input
                    type="text"
                    value={tempFirmName}
                    onChange={(e) => setTempFirmName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveFirmName()}
                    className="w-full px-2 py-1 text-sm text-white bg-slate-800 border border-slate-700 rounded outline-none focus:border-indigo-500"
                    autoFocus
                  />
                  <button onClick={saveFirmName} className="p-1 text-emerald-400 hover:bg-slate-800 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditingFirm(false)} className="p-1 text-rose-400 hover:bg-slate-800 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center w-full group">
                  <span className="text-sm font-semibold text-white truncate">{firmName}</span>
                  <button 
                    onClick={handleEditFirm}
                    className="p-1 ml-auto opacity-0 text-slate-400 group-hover:opacity-100 hover:text-white transition-opacity"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-800">
          <nav className="px-3 py-6 space-y-8">
            {NAVIGATION_GROUPS.map((group, idx) => (
              <div key={idx}>
                {!isCollapsed && (
                  <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider uppercase text-slate-500">
                    {group.label}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeView === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (onViewChange) onViewChange(item.id);
                          if (window.innerWidth < 1024) setMobileSidebarOpen(false);
                        }}
                        className={`
                          group relative flex items-center w-full rounded-lg transition-colors
                          ${isCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2'}
                          ${isActive 
                            ? 'bg-indigo-500/10 text-indigo-400' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          }
                        `}
                        title={isCollapsed ? item.label : undefined}
                      >
                        {/* Active Accent Line */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                        )}
                        
                        <Icon className={`shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        
                        {!isCollapsed && (
                          <>
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="ml-auto text-[10px] font-medium tracking-widest text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.shortcut}
                            </span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full p-2 text-slate-400 transition-colors rounded-lg hover:bg-slate-800 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
              <>
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}