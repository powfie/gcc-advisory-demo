import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Live Pages
import OverviewPage from './pages/OverviewPage'; // The new Command Centre!
import ClientsPage from './pages/ClientsPage';
import TPSuitePage from './pages/tp/TPSuitePage'; 
import EntityStructuringPage from './pages/structuring/EntityStructuringPage';
import ReportsEnginePage from './pages/reports/ReportsEnginePage'; 
import FEMASuitePage from './pages/fema/FEMASuitePage'; 

function AppRouter() {
  const { session, loading } = useAuth();
  const [currentView, setCurrentView] = useState('overview');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-sm font-bold tracking-widest text-indigo-600 uppercase animate-pulse">
          Initializing Workspace...
        </div>
      </div>
    );
  }

  // Bypassing the strict login wall for local development so you can see the UI immediately.
  /*
  if (!session) {
    return <AuthPage />; 
  }
  */

  const renderView = () => {
    switch (currentView) {
      case 'overview': return <OverviewPage />; // Now pointing to your live dashboard
      case 'clients': return <ClientsPage />;
      case 'tp': return <TPSuitePage />;
      case 'entity': return <EntityStructuringPage />; 
      case 'reports': return <ReportsEnginePage />;   
      case 'fema': return <FEMASuitePage />;
      default: return (
        <div className="p-10 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
          <p className="text-lg font-bold text-slate-400">🚧 Module Under Construction</p>
        </div>
      );
    }
  };

  return (
    <DashboardLayout currentView={currentView} onNav={setCurrentView}>
      {renderView()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AuthProvider>
  );
}