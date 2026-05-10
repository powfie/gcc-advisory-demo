export function applySubscriptionStatus(currentSession) {
  if (!currentSession) return null;
  const savedSubStatus = localStorage.getItem('gcc_sub_status');
  if (savedSubStatus === 'active') {
    return { ...currentSession, subscription: 'active' };
  }
  return currentSession;
}
