import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { newId } from '../lib/newId.js';
import { supabase } from '../lib/supabase.js';
import { useApp } from './AppContext.jsx';
import { useCompliance } from './ComplianceContext.jsx';
import { MODAL_KEYS, useUI } from './UIContext.jsx';
import { clientReducer, DEFAULT_NEW_CLIENT, initialClientState } from './clientReducer.js';

const ClientContext = createContext(null);

export function ClientProvider({ session, children }) {
  const { showToast, showConfirm } = useApp();
  const { addAuditLog } = useCompliance();
  const ui = useUI();

  const [state, dispatch] = useReducer(clientReducer, initialClientState);

  const fetchClients = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase.from('clients').select('*');
      if (error) throw error;
      dispatch({ type: 'SET_CLIENTS', payload: data ?? [] });
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const setNewClient = useCallback((updater) => {
    dispatch({ type: 'PATCH_NEW_CLIENT', payload: updater });
  }, []);

  const setEditingClient = useCallback((updater) => {
    dispatch({ type: 'PATCH_EDITING_CLIENT', payload: updater });
  }, []);

  const handleAddClient = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch({ type: 'SET_SUBMITTING', payload: true });
      const snapshot = state.newClient;
      try {
        const clientWithUserId = { ...snapshot, user_id: session?.user?.id };
        const { data, error } = await supabase.from('clients').insert([clientWithUserId]).select();
        if (error) throw error;

        ui.closeModal(MODAL_KEYS.addClient);
        const inserted =
          data && data.length > 0 ? data[0] : { ...clientWithUserId, id: newId(), tasks: [] };
        dispatch({ type: 'ADD_CLIENT', payload: inserted });
        addAuditLog('Added New Client', snapshot.name);
        dispatch({ type: 'RESET_NEW_CLIENT' });
        showToast(`${snapshot.name} successfully onboarded.`);
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ type: 'SET_SUBMITTING', payload: false });
      }
    },
    [state.newClient, session?.user?.id, ui, addAuditLog, showToast],
  );

  const requestEditClient = useCallback(
    (client) => {
      dispatch({ type: 'SET_EDITING_CLIENT', payload: { ...client } });
      ui.openModal(MODAL_KEYS.editClient);
    },
    [ui],
  );

  const handleUpdateClient = useCallback(
    async (e) => {
      e.preventDefault();
      if (!state.editingClient) return;
      dispatch({ type: 'SET_SUBMITTING', payload: true });
      const ec = state.editingClient;
      try {
        const { error } = await supabase
          .from('clients')
          .update({
            name: ec.name,
            entity_type: ec.entity_type,
            tp_margin: ec.tp_margin,
            risk_status: ec.risk_status,
          })
          .eq('id', ec.id);
        if (error) throw error;

        dispatch({ type: 'UPDATE_CLIENT', payload: ec });
        if (ui.dossier.client?.id === ec.id) {
          ui.replaceDossierClient(ec);
        }
        addAuditLog('Updated Client Details', ec.name);
        ui.closeModal(MODAL_KEYS.editClient);
        showToast(`${ec.name} successfully updated.`);
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ type: 'SET_SUBMITTING', payload: false });
      }
    },
    [state.editingClient, ui, addAuditLog, showToast],
  );

  const handleDeleteClient = useCallback(
    async (client) => {
      const ok = await showConfirm({
        title: 'Remove client',
        message: `Are you sure you want to completely remove ${client.name}? This action cannot be undone.`,
        confirmLabel: 'Remove',
        cancelLabel: 'Cancel',
      });
      if (!ok) return;

      try {
        const { error } = await supabase.from('clients').delete().eq('id', client.id);
        if (error) throw error;

        dispatch({ type: 'DELETE_CLIENT', payload: client.id });
        if (ui.dossier.client?.id === client.id) {
          ui.closeDossier();
        }
        addAuditLog('Deleted Client', client.name);
        ui.closeModal(MODAL_KEYS.editClient);
        showToast(`${client.name} removed from database.`);
      } catch (err) {
        console.error(err);
      }
    },
    [showConfirm, ui, addAuditLog, showToast],
  );

  const value = {
    clients: state.clients,
    isLoading: state.isLoading,
    newClient: state.newClient,
    setNewClient,
    editingClient: state.editingClient,
    setEditingClient,
    isSubmitting: state.isSubmitting,
    fetchClients,
    handleAddClient,
    requestEditClient,
    handleUpdateClient,
    handleDeleteClient,
  };

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
}

export function useClient() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error('useClient must be used within ClientProvider');
  return ctx;
}
