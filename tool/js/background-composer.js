/**
 * Background Composer - Canvas API for Zoom background + QR composition
 */

export function composeBackground(bgTemplate, qrDataUrl, options = {}) {
  const {
    width = 1920,
    height = 1080,
    qrSize = 300,
    qrMargin = 50,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  return new Promise((resolve) => {
    // Draw background
    drawBackground(ctx, width, height, bgTemplate);

    // Draw QR code if provided
    if (qrDataUrl) {
      const qrImg = new Image();
      qrImg.onload = () => {
        const x = width - qrSize - qrMargin;
        const y = height - qrSize - qrMargin;

        // White background behind QR
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.roundRect(x - 8, y - 8, qrSize + 16, qrSize + 16, 8);
        ctx.fill();

        ctx.drawImage(qrImg, x, y, qrSize, qrSize);
        resolve(canvas);
      };
      qrImg.src = qrDataUrl;
    } else {
      resolve(canvas);
    }
  });
}

function drawBackground(ctx, w, h, template) {
  const templates = {
    minimal: () => {
      ctx.fillStyle = '#1a1f2e';
      ctx.fillRect(0, 0, w, h);
    },
    gradient: () => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#1a1f2e');
      grad.addColorStop(1, '#2a1520');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    },
    corporate: () => {
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, w, h);
      // Subtle line accent
      ctx.strokeStyle = 'rgba(197, 121, 90, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.85);
      ctx.lineTo(w, h * 0.85);
      ctx.stroke();
    },
  };

  (templates[template] || templates.minimal)();
}

export function downloadCanvas(canvas, filename = 'zoom-background.png') {
  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }, 'image/png');
}
