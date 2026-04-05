/**
 * Complete Page - download generation, share, referral
 */
import { loadState, clearState } from './state-manager.js';
import { generateFinalQR } from './qr-generator.js';

const CARD_BG_COLORS = {
  navy: '#1a1f2e', charcoal: '#1e1e1e', midnight: '#0d1117',
  wine: '#2a1520', forest: '#152a1a', slate: '#2d3748',
  'warm-gray': '#292524', ocean: '#0f2027',
};

const ZOOM_BG_COLORS = {
  minimal: { bg: '#1a1f2e', accent: '#232839' },
  gradient: { bg: '#1a1f2e', accent: '#2a1520' },
  corporate: { bg: '#0d1117', accent: '#1a1f2e' },
};

document.addEventListener('DOMContentLoaded', () => {
  const state = loadState();

  if (!state.cardImage) {
    window.location.href = 'index.html';
    return;
  }

  generateQRDownload(state);
  generateZoomBackground(state);
  setupShare();
  setupReferral();
});

function generateQRDownload(state) {
  const container = document.getElementById('dl-qr-preview');
  const dlBtn = document.getElementById('dl-qr-btn');
  if (!container) return;

  var qd = state.qrDesign || {};
  var qrOpts = {
    dotsOptions: { type: qd.dotShape || 'rounded', color: qd.dotColor || '#000000' },
    cornersSquareOptions: { type: qd.cornerShape || 'extra-rounded', color: qd.cornerColor || '#000000' },
    cornersDotOptions: { color: qd.cornerColor || '#000000' },
    backgroundOptions: { color: qd.bgColor === 'transparent' ? 'rgba(0,0,0,0)' : (qd.bgColor || '#ffffff') },
  };

  var previewQR = new QRCodeStyling({
    width: 160, height: 160,
    data: 'https://dijica.jp/preview', margin: 8,
    ...qrOpts,
  });
  previewQR.append(container);

  if (dlBtn) {
    dlBtn.addEventListener('click', () => {
      var fullQR = generateFinalQR('https://dijica.jp/preview', qd, 1200);
      fullQR.download({ name: 'qr-code', extension: 'png' });
    });
  }
}

function generateZoomBackground(state) {
  const canvas = document.getElementById('bg-canvas');
  const dlBtn = document.getElementById('dl-bg-btn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const colors = ZOOM_BG_COLORS[state.backgroundTemplate] || ZOOM_BG_COLORS.minimal;

  // Draw preview (scaled down)
  drawZoomBg(ctx, canvas.width, canvas.height, colors, state);

  if (dlBtn) {
    dlBtn.addEventListener('click', () => {
      // Generate full-size
      const fullCanvas = document.createElement('canvas');
      fullCanvas.width = 1920;
      fullCanvas.height = 1080;
      const fullCtx = fullCanvas.getContext('2d');

      drawZoomBg(fullCtx, 1920, 1080, colors, state);

      // Draw QR code on the background
      var qr = new QRCodeStyling({
        width: 300, height: 300,
        data: 'https://dijica.jp/preview', margin: 8,
        ...qrOpts,
      });

      qr.getRawData('png').then(blob => {
        const img = new Image();
        img.onload = () => {
          fullCtx.drawImage(img, 1570, 730, 300, 300);
          fullCanvas.toBlob(b => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(b);
            a.download = 'zoom-background.png';
            a.click();
            URL.revokeObjectURL(a.href);
          }, 'image/png');
        };
        img.src = URL.createObjectURL(blob);
      });
    });
  }
}

function drawZoomBg(ctx, w, h, colors, state) {
  // Background fill
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle gradient overlay
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, colors.bg);
  grad.addColorStop(1, colors.accent);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // QR placeholder area (bottom right)
  const qrSize = Math.round(w * 0.156);
  const qrX = w - qrSize - Math.round(w * 0.026);
  const qrY = h - qrSize - Math.round(h * 0.046);

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12);
  ctx.fill();

  // "QR" text placeholder
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = `${Math.round(qrSize * 0.3)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('QR', qrX + qrSize / 2, qrY + qrSize / 2);
}

function setupShare() {
  const text = 'デジタル名刺メーカーで名刺を作りました！ QRコードで届くアニメーション名刺';
  const url = 'https://dijica.jp';

  const xBtn = document.getElementById('share-x');
  if (xBtn) {
    xBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  }

  const lineBtn = document.getElementById('share-line');
  if (lineBtn) {
    lineBtn.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  }
}

function setupReferral() {
  const code = 'DIJICA-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  const codeEl = document.getElementById('referral-code');
  const copyBtn = document.getElementById('copy-referral');

  if (codeEl) codeEl.textContent = code;

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = 'コピー済み';
        setTimeout(() => { copyBtn.textContent = 'コピー'; }, 2000);
      });
    });
  }
}
