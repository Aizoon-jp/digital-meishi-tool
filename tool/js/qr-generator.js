/**
 * QR Generator - step-by-step customization
 * Step 1: Shape (dots + corners)
 * Step 2: Colors (dots + corners)
 * Background: white (fixed)
 */
import { saveState, getStateValue } from './state-manager.js';

const DOT_SHAPES = [
  { id: 'square',          name: 'スクエア' },
  { id: 'rounded',         name: 'ラウンド' },
  { id: 'dots',            name: 'ドット' },
  { id: 'classy',          name: 'クラシック' },
  { id: 'classy-rounded',  name: 'クラシックR' },
  { id: 'extra-rounded',   name: 'エクストラR' },
];

const CORNER_SHAPES = [
  { id: 'square',         name: 'スクエア' },
  { id: 'dot',            name: 'ドット' },
  { id: 'extra-rounded',  name: 'ラウンド' },
];

const PRESET_COLORS = [
  // ベーシック
  '#000000', '#333333',
  // レッド・オレンジ
  '#e74c3c', '#ff6b35', '#f39c12',
  // ピンク・マゼンタ
  '#e91e8c', '#c0392b', '#d4507e',
  // ブルー
  '#2196f3', '#1a73e8', '#0097a7',
  // パープル
  '#9b59b6', '#673ab7', '#7c4dff',
  // グリーン
  '#27ae60', '#00bfa5', '#4caf50',
  // ブラウン・テラコッタ
  '#c5795a', '#8d6e63', '#795548',
  // ダーク
  '#1a1f2e', '#2c3e50',
];

let qrState = {
  dotShape: 'rounded',
  cornerShape: 'extra-rounded',
  dotColor: '#000000',
  cornerColor: '#000000',
  bgColor: '#ffffff',
};

let qrInstance = null;

export function initQRGenerator() {
  const container = document.getElementById('qr-customizer');
  if (!container) return;

  // Restore from state
  const saved = getStateValue('qrDesign');
  if (saved && typeof saved === 'object') {
    qrState = { ...qrState, ...saved };
  }

  renderSteps(container);
  updateQRPreview();
}

function renderSteps(container) {
  container.innerHTML = `
    <!-- Step 1: Shape -->
    <div class="qr-step">
      <h3 class="qr-step-title">形を選ぶ</h3>

      <div class="qr-sub-label">本体のドット</div>
      <div class="shape-grid" id="dot-shape-grid">
        ${DOT_SHAPES.map(s => `
          <div class="shape-item${s.id === qrState.dotShape ? ' active' : ''}"
               data-type="dot" data-shape="${s.id}">
            <div class="shape-preview shape-preview--${s.id}"></div>
            <span class="selection-label">${s.name}</span>
          </div>
        `).join('')}
      </div>

      <div class="qr-sub-label" style="margin-top:1rem">隅の四角（3つ）</div>
      <div class="shape-grid" id="corner-shape-grid">
        ${CORNER_SHAPES.map(s => `
          <div class="shape-item${s.id === qrState.cornerShape ? ' active' : ''}"
               data-type="corner" data-shape="${s.id}">
            <div class="shape-preview shape-preview--corner-${s.id}"></div>
            <span class="selection-label">${s.name}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Step 2: Colors -->
    <div class="qr-step">
      <h3 class="qr-step-title">色を選ぶ</h3>

      <div class="qr-sub-label">本体の色</div>
      <div class="color-row">
        <div class="color-grid" id="dot-color-grid">
          ${PRESET_COLORS.map(c => `
            <div class="color-swatch${c === qrState.dotColor ? ' active' : ''}"
                 data-type="dot" data-color="${c}"
                 style="background:${c}${c === '#ffffff' ? ';border:1px solid var(--color-border)' : ''}">
            </div>
          `).join('')}
        </div>
        <input type="color" class="color-picker" id="dot-color-picker"
               value="${qrState.dotColor}" data-type="dot">
      </div>

      <div class="qr-sub-label" style="margin-top:1rem">隅の四角の色</div>
      <div class="color-row">
        <div class="color-grid" id="corner-color-grid">
          ${PRESET_COLORS.map(c => `
            <div class="color-swatch${c === qrState.cornerColor ? ' active' : ''}"
                 data-type="corner" data-color="${c}"
                 style="background:${c}${c === '#ffffff' ? ';border:1px solid var(--color-border)' : ''}">
            </div>
          `).join('')}
        </div>
        <input type="color" class="color-picker" id="corner-color-picker"
               value="${qrState.cornerColor}" data-type="corner">
      </div>
    </div>

    <!-- Background is white (fixed) -->

  `;

  // Event listeners
  bindShapeGrids();
  bindColorGrids();
  bindColorPickers();
}

function bindShapeGrids() {
  document.querySelectorAll('.shape-item').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.type;
      const shape = item.dataset.shape;

      // Update active state
      const grid = item.parentElement;
      grid.querySelectorAll('.shape-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      if (type === 'dot') qrState.dotShape = shape;
      else qrState.cornerShape = shape;

      save();
      updateQRPreview();
    });
  });
}

function bindColorGrids() {
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const type = swatch.dataset.type;
      const color = swatch.dataset.color;

      // Update active state
      const grid = swatch.parentElement;
      grid.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('active'));
      swatch.classList.add('active');

      if (type === 'dot') qrState.dotColor = color;
      else if (type === 'corner') qrState.cornerColor = color;
      else qrState.bgColor = color;

      // Sync color picker
      const picker = document.getElementById(`${type === 'bg' ? 'bg' : type}-color-picker`);
      if (picker && color !== 'transparent') picker.value = color;

      save();
      updateQRPreview();
    });
  });
}

function bindColorPickers() {
  document.querySelectorAll('.color-picker').forEach(picker => {
    picker.addEventListener('input', () => {
      const type = picker.dataset.type;
      const color = picker.value;

      if (type === 'dot') qrState.dotColor = color;
      else if (type === 'corner') qrState.cornerColor = color;
      else qrState.bgColor = color;

      // Clear active on swatches
      const gridId = `${type === 'bg' ? 'bg' : type}-color-grid`;
      const grid = document.getElementById(gridId);
      if (grid) {
        grid.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('active'));
      }

      save();
      updateQRPreview();
    });
  });
}

function save() {
  saveState({ qrDesign: { ...qrState } });
  if (window._updateLivePreview) window._updateLivePreview();
}

function updateQRPreview() {
  const container = document.getElementById('qr-preview');
  if (!container || typeof QRCodeStyling === 'undefined') return;

  container.innerHTML = '';

  qrInstance = new QRCodeStyling({
    width: 220,
    height: 220,
    data: 'https://example.com/preview',
    margin: 10,
    dotsOptions: { type: qrState.dotShape, color: qrState.dotColor },
    cornersSquareOptions: { type: qrState.cornerShape, color: qrState.cornerColor },
    cornersDotOptions: { color: qrState.cornerColor },
    backgroundOptions: {
      color: qrState.bgColor === 'transparent' ? 'rgba(0,0,0,0)' : qrState.bgColor,
    },
  });

  qrInstance.append(container);
  checkContrast();
}

function checkContrast() {
  const warn = document.getElementById('qr-contrast-warning');
  if (!warn) return;

  const bgColor = qrState.bgColor === 'transparent' ? '#ffffff' : qrState.bgColor;
  const dotRatio = getContrastRatio(qrState.dotColor, bgColor);
  const cornerRatio = getContrastRatio(qrState.cornerColor, bgColor);
  const minRatio = Math.min(dotRatio, cornerRatio);

  if (minRatio < 2.5) {
    warn.textContent = 'コントラストが低く、読み取れない可能性があります';
    warn.className = 'qr-warning qr-warning--error';
  } else if (minRatio < 4) {
    warn.textContent = '読み取りできますが、コントラストを上げるとより確実です';
    warn.className = 'qr-warning qr-warning--caution';
  } else {
    warn.textContent = '';
    warn.className = 'qr-warning';
  }
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function generateFinalQR(url, qrDesignState, size = 1200) {
  const s = qrDesignState || qrState;

  return new QRCodeStyling({
    width: size,
    height: size,
    data: url,
    margin: 16,
    dotsOptions: { type: s.dotShape, color: s.dotColor },
    cornersSquareOptions: { type: s.cornerShape, color: s.cornerColor },
    cornersDotOptions: { color: s.cornerColor },
    backgroundOptions: {
      color: s.bgColor === 'transparent' ? 'rgba(0,0,0,0)' : s.bgColor,
    },
  });
}

export { qrState };
