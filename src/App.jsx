import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';
import { InitialLoader } from './components/ui/InitialLoader.jsx';
import AuthPage from './pages/AuthPage.jsx';
import PaywallPage from './pages/PaywallPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import AuditPage from './pages/AuditPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function RequireAuth({ children }) {
  const { session, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return <InitialLoader />;
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function RequireSubscription({ children }) {
  const { session } = useAuth();
  if (session.subscription !== 'active') {
    return <Navigate to="/subscribe" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/subscribe"
          element={
            <RequireAuth>
              <PaywallPage />
            </RequireAuth>
          }
        />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <RequireSubscription>
                <DashboardLayout />
              </RequireSubscription>
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
      </AppProvider>
    </AuthProvider>
  );
}
