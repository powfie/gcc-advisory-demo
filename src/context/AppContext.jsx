import React, { createContext, useContext, useState } from 'react';
import { INITIAL_CLIENTS, INITIAL_EXPATS, INITIAL_TEAM } from '../lib/constants';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Global State
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [expats, setExpats] = useState(INITIAL_EXPATS);
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [auditLogs, setAuditLogs] = useState([]);
  const [toast, setToast] = useState(null);

  // Global Actions
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const addLog = (userEmail, action, target) => {
    setAuditLogs(prev => [{ 
      id: Date.now(), 
      user: userEmail, 
      action, 
      target, 
      time: 'Just now' 
    }, ...prev]);
  };

  const value = {
    clients, setClients,
    expats, setExpats,
    team, setTeam,
    auditLogs, setAuditLogs,
    toast, setToast,
    showToast,
    addLog
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);