import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { applySubscriptionStatus } from '../lib/subscription.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(applySubscriptionStatus(s));
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(applySubscriptionStatus(newSession));
    });

    return () => subscription.unsubscribe();
  }, []);

  const simulateStripePayment = useCallback(() => {
    localStorage.setItem('gcc_sub_status', 'active');
    setSession((prev) => (prev ? { ...prev, subscription: 'active' } : prev));
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('gcc_sub_status');
  }, []);

  const value = useMemo(
    () => ({
      session,
      isInitializing,
      simulateStripePayment,
      signOut,
    }),
    [session, isInitializing, simulateStripePayment, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
