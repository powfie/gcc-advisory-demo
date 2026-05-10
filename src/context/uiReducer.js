export const MODAL_KEYS = {
  entity: 'entity',
  tpEngine: 'tpEngine',
  peExpat: 'peExpat',
  etr: 'etr',
  dtaa: 'dtaa',
  sez: 'sez',
  addClient: 'addClient',
  editClient: 'editClient',
  invite: 'invite',
};

const emptyModals = Object.fromEntries(Object.keys(MODAL_KEYS).map((k) => [k, false]));

export const initialUIState = {
  modals: { ...emptyModals },
  dossier: {
    open: false,
    tab: 'overview',
    client: null,
  },
  notificationCenterOpen: false,
  mobileSidebarOpen: false,
};

export function uiReducer(state, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.key]: true },
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.key]: false },
      };
    case 'OPEN_DOSSIER':
      return {
        ...state,
        dossier: { open: true, tab: 'overview', client: action.client },
      };
    case 'SET_DOSSIER_TAB':
      return {
        ...state,
        dossier: { ...state.dossier, tab: action.tab },
      };
    case 'CLOSE_DOSSIER':
      return {
        ...state,
        dossier: { ...state.dossier, open: false },
      };
    case 'CLEAR_DOSSIER_CLIENT':
      return {
        ...state,
        dossier: { ...state.dossier, client: null },
      };
    case 'REPLACE_DOSSIER_CLIENT':
      return {
        ...state,
        dossier: { ...state.dossier, client: action.client },
      };
    case 'SET_NOTIFICATION_CENTER':
      return { ...state, notificationCenterOpen: action.open };
    case 'SET_MOBILE_SIDEBAR':
      return { ...state, mobileSidebarOpen: action.open };
    default:
      return state;
  }
}
