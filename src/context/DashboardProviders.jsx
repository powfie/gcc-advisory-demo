import { ClientProvider } from './ClientContext.jsx';
import { ComplianceProvider } from './ComplianceContext.jsx';
import { UIProvider } from './UIContext.jsx';

export function DashboardProviders({ session, children }) {
  return (
    <UIProvider>
      <ComplianceProvider session={session}>
        <ClientProvider session={session}>{children}</ClientProvider>
      </ComplianceProvider>
    </UIProvider>
  );
}
