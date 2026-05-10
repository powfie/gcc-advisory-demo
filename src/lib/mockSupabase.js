const MOCK_CLIENTS = [
  {
    id: 1,
    name: 'TechNova India Pvt Ltd',
    entity_type: 'WOS',
    tp_margin: '15.5% Safe Harbour',
    risk_status: 'Green',
    tasks: [{ id: 1, text: 'File Form 3CEFA', done: false }],
  },
  {
    id: 2,
    name: 'FinServe Global Services',
    entity_type: 'Branch',
    tp_margin: 'Cost Plus 10%',
    risk_status: 'Amber',
    tasks: [{ id: 2, text: 'Review PE exposure', done: true }],
  },
  {
    id: 3,
    name: 'HealthAI Innovation Labs',
    entity_type: 'LLP',
    tp_margin: 'N/A (Pending)',
    risk_status: 'Red',
    tasks: [{ id: 3, text: 'Draft TP Study', done: false }],
  },
  {
    id: 4,
    name: 'Quantum Logistics GCC',
    entity_type: 'JV',
    tp_margin: 'CUP Method',
    risk_status: 'Green',
    tasks: [],
  },
];

export function createMockSupabase() {
  let mockSession = JSON.parse(localStorage.getItem('gcc_mock_session')) || null;
  const authListeners = [];

  return {
    auth: {
      getSession: async () => ({ data: { session: mockSession } }),
      onAuthStateChange: (listener) => {
        authListeners.push(listener);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                const i = authListeners.indexOf(listener);
                if (i !== -1) authListeners.splice(i, 1);
              },
            },
          },
        };
      },
      signUp: async () => ({ error: null }),
      signInWithPassword: async ({ email }) => {
        mockSession = {
          user: { id: 'mock-user-123', email },
          subscription: 'active',
        };
        localStorage.setItem('gcc_mock_session', JSON.stringify(mockSession));
        authListeners.forEach((listener) => listener('SIGNED_IN', mockSession));
        return { error: null };
      },
      signOut: async () => {
        mockSession = null;
        localStorage.removeItem('gcc_mock_session');
        localStorage.removeItem('gcc_sub_status');
        authListeners.forEach((listener) => listener('SIGNED_OUT', null));
      },
    },
    from: (table) => ({
      select: async () => {
        if (table === 'clients') return { data: MOCK_CLIENTS, error: null };
        if (table === 'expat_travel')
          return {
            data: [
              { id: 1, client_id: 1, director_name: 'James Wilson', days_in_india: 94 },
              { id: 2, client_id: 2, director_name: 'Sarah Jenkins', days_in_india: 75 },
            ],
            error: null,
          };
        if (table === 'team_members')
          return {
            data: [
              { id: 1, email: 'partner@big4.com', role: 'Admin', status: 'Active' },
              { id: 2, email: 'associate@big4.com', role: 'Editor', status: 'Active' },
            ],
            error: null,
          };
        if (table === 'audit_logs')
          return {
            data: [
              {
                id: 1,
                user: 'partner@big4.com',
                action: 'Updated TP Margin',
                target: 'FinServe Global Services',
                time: '1 hour ago',
              },
              {
                id: 2,
                user: 'associate@big4.com',
                action: 'Generated Tax Report',
                target: 'TechNova India Pvt Ltd',
                time: '3 hours ago',
              },
              {
                id: 3,
                user: 'partner@big4.com',
                action: 'Added New Client',
                target: 'Quantum Logistics GCC',
                time: 'Yesterday',
              },
            ],
            error: null,
          };
        return { data: [], error: null };
      },
      insert: async () => ({ error: null }),
      update: () => ({ eq: async () => ({ error: null }) }),
      delete: () => ({ eq: async () => ({ error: null }) }),
    }),
  };
}
