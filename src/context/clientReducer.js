export const DEFAULT_NEW_CLIENT = {
  name: '',
  entity_type: 'WOS',
  tp_margin: '15.5% Safe Harbour',
  risk_status: 'Green',
  next_action: 'Pending Review',
};

export const initialClientState = {
  clients: [],
  isLoading: true,
  newClient: { ...DEFAULT_NEW_CLIENT },
  editingClient: null,
  isSubmitting: false,
};

export function clientReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload, isLoading: false };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'DELETE_CLIENT':
      return { ...state, clients: state.clients.filter((c) => c.id !== action.payload) };
    case 'SET_NEW_CLIENT':
      return { ...state, newClient: action.payload };
    case 'PATCH_NEW_CLIENT': {
      const next =
        typeof action.payload === 'function'
          ? action.payload(state.newClient)
          : { ...state.newClient, ...action.payload };
      return { ...state, newClient: next };
    }
    case 'RESET_NEW_CLIENT':
      return { ...state, newClient: { ...DEFAULT_NEW_CLIENT } };
    case 'SET_EDITING_CLIENT':
      return { ...state, editingClient: action.payload };
    case 'PATCH_EDITING_CLIENT': {
      if (!state.editingClient) return state;
      const next =
        typeof action.payload === 'function'
          ? action.payload(state.editingClient)
          : { ...state.editingClient, ...action.payload };
      return { ...state, editingClient: next };
    }
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    default:
      return state;
  }
}
