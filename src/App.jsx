import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Live Pages
import ClientsPage from './pages/ClientsPage';
import TPSuitePage from './pages/tp/TPSuitePage'; 
import EntityStructuringPage from './pages/structuring/EntityStructuringPage';
import ReportsEnginePage from './pages/reports/ReportsEnginePage'; 
import FEMASuitePage from './pages/fema/FEMASuitePage'; // The Treasury & Capital Modeler

// --- TEMPORARY PAGE PLACEHOLDER ---
// We will extract this into an OverviewPage.jsx later
const OverviewPage = () => (
  <div className="p-10 bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] text-center animate-in fade-in zoom-in-95 duration-500">
    <h2 className="text-2xl font-extrabold text-slate-900">Command Centre Active 🟢</h2>
    <p className="mt-3 font-medium text-slate-500">
      Your enterprise infrastructure is completely modular and running perfectly.
    </p>
  </div>
);

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
      case 'overview': return <OverviewPage />;
      case 'clients': return <ClientsPage />;
      case 'tp': return <TPSuitePage />;
      case 'entity': return <EntityStructuringPage />; 
      case 'reports': return <ReportsEnginePage />;   
      case 'fema': return <FEMASuitePage />; // Routing to FEMA Lab
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