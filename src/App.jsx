import React, { useState } from 'react';

// Context Providers
import { useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { ClientProvider } from './context/ClientContext';
import { ComplianceProvider } from './context/ComplianceContext';
import { AppProvider } from './context/AppContext';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardModals } from './components/layout/DashboardModals';
// Top-Level Screens
import AuthPage from './pages/AuthPage';
import PaywallPage from './pages/PaywallPage';

// Dashboard Pages
import OverviewPage from './pages/OverviewPage';
import ClientsPage from './pages/ClientsPage';
import ReportsPage from './pages/ReportsPage';
import AuditPage from './pages/AuditPage';
import SettingsPage from './pages/SettingsPage';

function DashboardRouter() {
  const [currentView, setCurrentView] = useState('overview');

  const renderView = () => {
    switch (currentView) {
      case 'overview': return <OverviewPage />;
      case 'clients': return <ClientsPage />;
      case 'reports': return <ReportsPage />;
      case 'audit': return <AuditPage />;
      case 'settings': return <SettingsPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div className="flex min-h-screen font-sans text-slate-900 bg-[#F8FAFC] selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar activeView={currentView} onViewChange={setCurrentView} />
      
      <main className="relative flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header activeViewLabel={currentView.charAt(0).toUpperCase() + currentView.slice(1)} />
        
        <div className="flex-1 p-6 overflow-auto lg:p-10 pb-24 scroll-smooth print:p-0 print:overflow-visible">
          {renderView()}
        </div>
      </main>

      {/* Renders all floating modals globally */}
      <DashboardModals />
    </div>
  );
}

// Separate component so we can use the Auth hook inside AppProvider
function AppContent() {
  const { session, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) return <AuthPage />;
  
  if (session.subscription !== 'active') {
    return <PaywallPage />;
  }

  return (
    <UIProvider>
      <ComplianceProvider>
        <ClientProvider>
          <DashboardRouter />
        </ClientProvider>
      </ComplianceProvider>
    </UIProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}