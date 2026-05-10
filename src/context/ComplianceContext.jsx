import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAdvisoryEngineState } from '../hooks/useAdvisoryEngineState.js';
import { newId } from '../lib/newId.js';
import { supabase } from '../lib/supabase.js';
import { useApp } from './AppContext.jsx';

const ComplianceContext = createContext(null);

export function ComplianceProvider({ session, children }) {
  const { showToast } = useApp();
  const advisory = useAdvisoryEngineState();

  const [expats, setExpats] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  const [reportType, setReportType] = useState('entity');
  const [selectedClientForReport, setSelectedClientForReport] = useState('');
  const reportRef = useRef(null);

  const fetchComplianceData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: expatsData } = await supabase.from('expat_travel').select('*');
      if (expatsData) setExpats(expatsData);

      const { data: teamData } = await supabase.from('team_members').select('*');
      if (teamData) setTeamMembers(teamData);

      const { data: logsData } = await supabase.from('audit_logs').select('*');
      if (logsData) setAuditLogs(logsData);
    } catch (err) {
      console.error('Failed to fetch compliance data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplianceData();
  }, [fetchComplianceData]);

  const addAuditLog = useCallback(
    async (action, target) => {
      const entry = {
        id: newId(),
        user: session.user.email,
        action,
        target,
        time: 'Just now',
      };
      try {
        await supabase.from('audit_logs').insert([entry]);
      } catch (e) {
        /* mock */
      }
      setAuditLogs((prev) => [entry, ...prev]);
    },
    [session.user.email],
  );

  const handleDownloadReport = useCallback(() => {
    addAuditLog('Exported PDF Report', selectedClientForReport);
    setTimeout(() => window.print(), 100);
  }, [addAuditLog, selectedClientForReport]);

  const sendInvite = useCallback(() => {
    setTeamMembers((prev) => [
      ...prev,
      { id: newId(), email: inviteEmail, role: inviteRole, status: 'Pending' },
    ]);
    addAuditLog('Invited Team Member', inviteEmail);
    showToast(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  }, [inviteEmail, inviteRole, addAuditLog, showToast]);

  const revokeMember = useCallback(
    (member) => {
      setTeamMembers((prev) => prev.filter((m) => m.id !== member.id));
      addAuditLog('Revoked Team Access', member.email);
      showToast(`Access revoked for ${member.email}`);
    },
    [addAuditLog, showToast],
  );

  const value = {
    ...advisory,
    expats,
    teamMembers,
    auditLogs,
    isLoading,
    fetchComplianceData,
    addAuditLog,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    sendInvite,
    revokeMember,
    reportType,
    setReportType,
    selectedClientForReport,
    setSelectedClientForReport,
    reportRef,
    handleDownloadReport,
  };

  return <ComplianceContext.Provider value={value}>{children}</ComplianceContext.Provider>;
}

export function useCompliance() {
  const ctx = useContext(ComplianceContext);
  if (!ctx) throw new Error('useCompliance must be used within ComplianceProvider');
  return ctx;
}
