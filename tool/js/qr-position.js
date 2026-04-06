/**
 * QR Position - drag to place QR code on Zoom background
 */
import { saveState, loadState } from './state-manager.js';
import { ZOOM_BACKGROUNDS } from './background-selector.js';

// QR position as percentage (0-100) of background
let qrPos = { x: 82, y: 78 }; // default: bottom-right

export function initQRPosition() {
  const wrap = document.querySelector('.qr-position-canvas-wrap');
  const handle = document.getElementById('qr-drag-handle');
  const canvas = document.getElementById('qr-position-canvas');
  if (!wrap || !handle || !canvas) return;

  // Restore saved position
  const saved = loadState().qrPosition;
  if (saved) qrPos = saved;

  drawPositionPreview();
  positionHandle();

  // Drag logic (mouse + touch)
  let dragging = false;

  function startDrag(e) {
    e.preventDefault();
    dragging = true;
    handle.style.cursor = 'grabbing';
  }

  function moveDrag(e) {
    if (!dragging) return;
    e.preventDefault();

    const rect = wrap.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;

    // Clamp within bounds (keep QR fully visible)
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    qrPos = { x, y };
    positionHandle();
    drawPositionPreview();
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    handle.style.cursor = 'grab';
    saveState({ qrPosition: { ...qrPos } });
    if (window._updateLivePreview) window._updateLivePreview();
  }

  // Mouse events
  handle.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', moveDrag);
  document.addEventListener('mouseup', endDrag);

  // Touch events
  handle.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', moveDrag, { passive: false });
  document.addEventListener('touchend', endDrag);

  // Click on canvas to move QR there
  wrap.addEventListener('click', (e) => {
    if (e.target === handle || handle.contains(e.target)) return;
    const rect = wrap.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));
    qrPos = { x, y };
    positionHandle();
    drawPositionPreview();
    saveState({ qrPosition: { ...qrPos } });
    if (window._updateLivePreview) window._updateLivePreview();
  });
}

function positionHandle() {
  const handle = document.getElementById('qr-drag-handle');
  if (!handle) return;
  handle.style.left = `calc(${qrPos.x}% - 30px)`;
  handle.style.top = `calc(${qrPos.y}% - 30px)`;
}

function drawPositionPreview() {
  const canvas = document.getElementById('qr-position-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const state = loadState();

  // Draw background
  const bgId = state.backgroundTemplate || 'bright-future';
  const bg = ZOOM_BACKGROUNDS.find(b => b.id === bgId);

  ctx.clearRect(0, 0, w, h);

  if (bg && bg.gradient) {
    const colorMatch = bg.gradient.match(/#[0-9a-fA-F]{6}/g);
    if (colorMatch && colorMatch.length >= 2) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      colorMatch.forEach((c, i) => {
        grad.addColorStop(i / (colorMatch.length - 1), c);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  } else {
    ctx.fillStyle = '#e8ecf1';
    ctx.fillRect(0, 0, w, h);
  }

  // Bokeh
  if (bg && bg.bokeh) {
    const circles = [
      { x: 0.15, y: 0.2, r: 30, a: 0.15 },
      { x: 0.75, y: 0.15, r: 18, a: 0.12 },
      { x: 0.45, y: 0.6, r: 35, a: 0.1 },
      { x: 0.85, y: 0.45, r: 22, a: 0.12 },
      { x: 0.25, y: 0.8, r: 26, a: 0.08 },
    ];
    circles.forEach(c => {
      const grad = ctx.createRadialGradient(
        w * c.x, h * c.y, 0, w * c.x, h * c.y, c.r
      );
      grad.addColorStop(0, `rgba(255,255,255,${c.a})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w * c.x, h * c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // QR position indicator
  const qrSize = 48;
  const qx = (qrPos.x / 100) * w - qrSize / 2;
  const qy = (qrPos.y / 100) * h - qrSize / 2;

  // White background for QR
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.roundRect(qx - 3, qy - 3, qrSize + 6, qrSize + 6, 4);
  ctx.fill();

  // QR mini icon
  const qd = state.qrDesign || {};
  ctx.fillStyle = qd.dotColor || '#000';

  const fp = 12;
  drawMiniFinderPattern(ctx, qx + 2, qy + 2, fp, qd.dotColor || '#000');
  drawMiniFinderPattern(ctx, qx + qrSize - fp - 2, qy + 2, fp, qd.cornerColor || '#000');
  drawMiniFinderPattern(ctx, qx + 2, qy + qrSize - fp - 2, fp, qd.cornerColor || '#000');

  // Guide text
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ドラッグでQRの位置を調整', w / 2, h - 10);
}

function drawMiniFinderPattern(ctx, x, y, size, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, size, size);
  ctx.fillStyle = color;
  const inner = Math.round(size * 0.4);
  const offset = Math.round((size - inner) / 2);
  ctx.fillRect(x + offset, y + offset, inner, inner);
}

export function getQRPosition() {
  return { ...qrPos };
}
