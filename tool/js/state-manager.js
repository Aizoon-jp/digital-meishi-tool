/**
 * State Manager - sessionStorage-based state persistence across pages
 */

const STATE_KEY = 'dijica_tool_state';

const defaultState = {
  qrDesign: 'simple',
  backgroundTemplate: 'bright-future',
  cardImage: null,
  cardImageName: null,
  linkEnabled: false,
  linkUrl: '',
  linkColor: '#c5795a',
  animationType: 'slide-down',
  cardBackground: 'cream',
  qrPosition: { x: 82, y: 78 },
};

export function loadState() {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(updates) {
  const current = loadState();
  const merged = { ...current, ...updates };
  sessionStorage.setItem(STATE_KEY, JSON.stringify(merged));
  return merged;
}

export function getStateValue(key) {
  return loadState()[key];
}

export function clearState() {
  sessionStorage.removeItem(STATE_KEY);
}
