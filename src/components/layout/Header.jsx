import React from 'react';
import { Search, Bell, HelpCircle, ChevronRight, User, Menu } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export function Header({ activeViewLabel = 'Command Centre' }) {
  const { setMobileSidebarOpen, setNotificationCenterOpen } = useUI();

  // Format today's date dynamically: e.g., "Friday, 9 May 2026"
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      
      {/* Left side: Mobile Toggle, Breadcrumb & Search */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Mobile menu button (hidden on large screens) */}
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb (hidden on mobile) */}
        <div className="items-center text-sm text-slate-500 hidden md:flex">
          <span className="truncate max-w-[120px]">GCC Advisory</span>
          <ChevronRight className="w-4 h-4 mx-1 shrink-0" />
          <span className="font-semibold text-slate-900 truncate">{activeViewLabel}</span>
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={() => {
            // We'll hook this up to your CommandPalette state later
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
          }}
          className="flex items-center px-3 py-1.5 text-sm text-slate-400 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors w-40 sm:w-64 border border-transparent hover:border-slate-300"
        >
          <Search className="w-4 h-4 mr-2 shrink-0" />
          <span className="truncate text-left flex-1">Search...</span>
          <span className="hidden sm:inline-block ml-auto text-[10px] font-semibold border border-slate-300 rounded px-1.5 py-0.5 bg-white">⌘K</span>
        </button>
      </div>

      {/* Right side: Date, Notifications, Help, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-sm font-medium text-slate-500 hidden lg:block">
          {today}
        </span>

        <div className="w-px h-6 bg-slate-200 hidden lg:block mx-1"></div>

        <button 
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors hidden sm:block"
          title="Help & Support"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setNotificationCenterOpen(true)}
          className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification Badge indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
        </button>

        {/* User Avatar */}
        <button 
          className="flex items-center justify-center w-8 h-8 sm:ml-2 bg-indigo-100 rounded-full text-indigo-700 hover:bg-indigo-200 transition-colors border border-indigo-200"
          title="Profile & Settings"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}