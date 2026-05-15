import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PAGE_META } from '../../lib/constants';

export function DashboardLayout({ children, currentView, onNav }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 backdrop-blur-sm bg-slate-900/40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <Sidebar 
        currentView={currentView} 
        onNav={onNav} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          currentView={currentView} 
          setSidebarOpen={setSidebarOpen} 
          onNav={onNav} 
        />

        <main className="flex-1 overflow-auto">
          <div className="px-6 pt-8 pb-4 lg:px-10 print:hidden">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {PAGE_META[currentView]?.title || currentView}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {PAGE_META[currentView]?.sub}
            </p>
          </div>
          
          {/* The active page content is injected here */}
          <div className="px-6 pb-16 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}