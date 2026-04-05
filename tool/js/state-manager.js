/**
 * State Manager - sessionStorage-based state persistence across pages
 */

const STATE_KEY = 'dijica_tool_state';

const defaultState = {
  qrDesign: 'simple',
  backgroundTemplate: 'minimal',
  cardImage: null,
  cardImageName: null,
  linkEnabled: false,
  linkUrl: '',
  animationType: 'slide-down',
  cardBackground: 'navy',
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
