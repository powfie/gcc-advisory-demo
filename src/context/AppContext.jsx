import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { Toast } from '../components/ui/Toast.jsx';

const AppContext = createContext(null);

const initialConfirm = {
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  resolve: null,
};

export function AppProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(initialConfirm);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const showConfirm = useCallback(
    ({
      title = 'Confirm',
      message = '',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
    } = {}) =>
      new Promise((resolve) => {
        setConfirm({
          open: true,
          title,
          message,
          confirmLabel,
          cancelLabel,
          resolve,
        });
      }),
    [],
  );

  const resolveConfirm = useCallback((value) => {
    setConfirm((c) => {
      const { resolve } = c;
      if (resolve) resolve(value);
      return { ...initialConfirm };
    });
  }, []);

  const value = useMemo(
    () => ({
      toast,
      setToast,
      showToast,
      dismissToast,
      showConfirm,
    }),
    [toast, showToast, dismissToast, showConfirm],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onClose={dismissToast} />}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        cancelLabel={confirm.cancelLabel}
        onConfirm={() => resolveConfirm(true)}
        onCancel={() => resolveConfirm(false)}
      />
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
