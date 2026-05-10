import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { initialUIState, MODAL_KEYS, uiReducer } from './uiReducer.js';

const UIContext = createContext(null);

export { MODAL_KEYS };

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);

  const openModal = useCallback((key) => {
    if (!(key in MODAL_KEYS)) {
      console.warn(`Unknown modal key: ${key}`);
      return;
    }
    dispatch({ type: 'OPEN_MODAL', key });
  }, []);

  const closeModal = useCallback((key) => {
    dispatch({ type: 'CLOSE_MODAL', key });
  }, []);

  const isModalOpen = useCallback((key) => state.modals[key] === true, [state.modals]);

  const openDossier = useCallback((client) => {
    dispatch({ type: 'OPEN_DOSSIER', client });
  }, []);

  const setDossierTab = useCallback((tab) => {
    dispatch({ type: 'SET_DOSSIER_TAB', tab });
  }, []);

  const closeDossier = useCallback(() => {
    dispatch({ type: 'CLOSE_DOSSIER' });
    setTimeout(() => dispatch({ type: 'CLEAR_DOSSIER_CLIENT' }), 300);
  }, []);

  const replaceDossierClient = useCallback((client) => {
    dispatch({ type: 'REPLACE_DOSSIER_CLIENT', client });
  }, []);

  const setNotificationCenterOpen = useCallback((open) => {
    dispatch({ type: 'SET_NOTIFICATION_CENTER', open });
  }, []);

  const setMobileSidebarOpen = useCallback((open) => {
    dispatch({ type: 'SET_MOBILE_SIDEBAR', open });
  }, []);

  const value = useMemo(
    () => ({
      modals: state.modals,
      openModal,
      closeModal,
      isModalOpen,
      dossier: state.dossier,
      openDossier,
      closeDossier,
      replaceDossierClient,
      setDossierTab,
      notificationCenterOpen: state.notificationCenterOpen,
      setNotificationCenterOpen,
      mobileSidebarOpen: state.mobileSidebarOpen,
      setMobileSidebarOpen,
    }),
    [
      state.modals,
      state.dossier,
      state.notificationCenterOpen,
      state.mobileSidebarOpen,
      openModal,
      closeModal,
      isModalOpen,
      openDossier,
      closeDossier,
      replaceDossierClient,
      setDossierTab,
      setNotificationCenterOpen,
      setMobileSidebarOpen,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
