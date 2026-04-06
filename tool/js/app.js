/**
 * App - Main orchestrator for the tool page
 */
import { loadState, saveState } from './state-manager.js';
import { initImageUploader } from './image-uploader.js';
import { initAnimationPreviewer } from './animation-previewer.js';
import { initCardBackgroundSelector, initZoomBackgroundSelector, ZOOM_BACKGROUNDS } from './background-selector.js';
import { initQRGenerator } from './qr-generator.js';
import { initQRPosition } from './qr-position.js';

document.addEventListener('DOMContentLoaded', () => {
  initStepIndicator();
  initImageUploader();
  initQRGenerator();
  initZoomBackgroundSelector();
  initLinkConfig();
  initAnimationPreviewer();
  initCardBackgroundSelector();
  initDemoTabs();
  initNavigation();
  initMobileQRPreview();
  initQRPosition();
  initLivePreview();
  restoreState();
});

function initStepIndicator() {
  const sections = document.querySelectorAll('.section');
  const dots = document.querySelectorAll('.step-dot');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...sections].indexOf(entry.target);
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === idx);
          dot.classList.toggle('done', i < idx);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
}

const MAX_LINKS = 5;

const LINK_ICONS = {
  default: '🌐',
  twitter: '𝕏',
  instagram: '📷',
  facebook: 'f',
  youtube: '▶',
  line: 'L',
  tiktok: '♪',
};

function detectIcon(url) {
  if (!url) return LINK_ICONS.default;
  const u = url.toLowerCase();
  if (u.includes('twitter') || u.includes('x.com')) return LINK_ICONS.twitter;
  if (u.includes('instagram')) return LINK_ICONS.instagram;
  if (u.includes('facebook')) return LINK_ICONS.facebook;
  if (u.includes('youtube')) return LINK_ICONS.youtube;
  if (u.includes('line.me')) return LINK_ICONS.line;
  if (u.includes('tiktok')) return LINK_ICONS.tiktok;
  return LINK_ICONS.default;
}

function initLinkConfig() {
  const toggle = document.getElementById('link-toggle');
  const optionsWrap = document.getElementById('link-options-wrap');
  const addBtn = document.getElementById('btn-add-link');
  const colorGrid = document.getElementById('link-color-grid');
  const colorPicker = document.getElementById('link-color-picker');

  if (!toggle) return;

  toggle.addEventListener('change', () => {
    if (optionsWrap) optionsWrap.classList.toggle('visible', toggle.checked);
    saveState({ linkEnabled: toggle.checked });
    if (toggle.checked && getLinks().length === 0) addLink();
    updateLinkPreview();
  });

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (getLinks().length < MAX_LINKS) addLink();
    });
  }

  if (colorGrid) {
    colorGrid.addEventListener('click', (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (!swatch) return;
      colorGrid.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      saveState({ linkColor: swatch.dataset.color });
      if (colorPicker) colorPicker.value = swatch.dataset.color;
      updateLinkPreview();
    });
  }

  if (colorPicker) {
    colorPicker.addEventListener('input', () => {
      saveState({ linkColor: colorPicker.value });
      if (colorGrid) colorGrid.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      updateLinkPreview();
    });
  }
}

function getLinks() {
  const state = loadState();
  return state.links || [];
}

function saveLinks(links) {
  saveState({ links });
  updateAddButton();
  updateLinkPreview();
}

function addLink(label, url) {
  const links = getLinks();
  if (links.length >= MAX_LINKS) return;
  links.push({ label: label || '', url: url || '' });
  saveLinks(links);
  renderLinkList();
}

function removeLink(index) {
  const links = getLinks();
  links.splice(index, 1);
  saveLinks(links);
  renderLinkList();
}

function updateLinkData(index, field, value) {
  const links = getLinks();
  if (links[index]) {
    links[index][field] = value;
    saveLinks(links);
  }
}

function renderLinkList() {
  const list = document.getElementById('link-list');
  if (!list) return;

  const links = getLinks();
  list.innerHTML = links.map((link, i) => `
    <div class="link-entry" data-index="${i}">
      <div class="link-entry-label">
        <input type="text" value="${link.label}" placeholder="表示名"
               data-field="label" data-index="${i}">
      </div>
      <div class="link-entry-url">
        <input type="url" value="${link.url}" placeholder="https://..."
               data-field="url" data-index="${i}">
      </div>
      <button class="btn-remove-link" data-index="${i}" type="button">×</button>
    </div>
  `).join('');

  // Event delegation
  list.addEventListener('input', handleLinkInput);
  list.addEventListener('click', handleLinkRemove);
  updateAddButton();
}

function handleLinkInput(e) {
  const input = e.target;
  if (!input.dataset.field) return;
  updateLinkData(parseInt(input.dataset.index), input.dataset.field, input.value);
}

function handleLinkRemove(e) {
  const btn = e.target.closest('.btn-remove-link');
  if (!btn) return;
  removeLink(parseInt(btn.dataset.index));
}

function updateAddButton() {
  const btn = document.getElementById('btn-add-link');
  if (!btn) return;
  const count = getLinks().length;
  btn.disabled = count >= MAX_LINKS;
  btn.textContent = count >= MAX_LINKS
    ? '上限に達しました'
    : `+ リンクを追加（${count}/${MAX_LINKS}）`;
}

function updateLinkPreview() {
  const state = loadState();
  const container = document.getElementById('preview-links');
  if (!container) return;

  const links = state.links || [];
  const color = state.linkColor || '#c5795a';

  if (!state.linkEnabled || links.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = links.filter(l => l.label || l.url).map(link => {
    const icon = detectIcon(link.url);
    const display = link.label || (() => {
      try { return new URL(link.url).hostname; } catch { return link.url || '...'; }
    })();
    return `
      <div class="preview-link" style="color:${color};border-color:${color}66">
        <span class="preview-link-icon">${icon}</span>
        <span>${display}</span>
      </div>`;
  }).join('');
}

function initNavigation() {
  const btn = document.getElementById('btn-next');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const state = loadState();

    if (!state.cardImage) {
      const upload = document.getElementById('section-upload');
      if (upload) {
        upload.scrollIntoView({ behavior: 'smooth' });
        upload.querySelector('.section-card').style.borderColor = 'var(--color-error)';
        setTimeout(() => {
          upload.querySelector('.section-card').style.borderColor = '';
        }, 2000);
      }
      return;
    }

    window.location.href = 'confirm.html';
  });
}

function initDemoTabs() {
  const tabs = document.querySelectorAll('.demo-tab');
  const panels = document.querySelectorAll('.demo-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('demo-' + tab.dataset.demo);
      if (panel) panel.classList.add('active');
    });
  });
}

function initMobileQRPreview() {
  const qrSection = document.getElementById('section-qr');
  const stickyPreview = document.querySelector('.qr-sticky-preview');
  if (!qrSection || !stickyPreview) return;

  const isMobile = () => window.innerWidth <= 600;

  const observer = new IntersectionObserver((entries) => {
    if (!isMobile()) {
      stickyPreview.classList.remove('visible');
      return;
    }
    entries.forEach(entry => {
      stickyPreview.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0.05 });

  observer.observe(qrSection);

  window.addEventListener('resize', () => {
    if (!isMobile()) stickyPreview.classList.remove('visible');
  });
}

// --- Live Preview: 背景+QR合成プレビュー ---
function initLivePreview() {
  const canvas = document.getElementById('live-preview-canvas');
  if (!canvas) return;

  updateLivePreview();
  window._updateLivePreview = updateLivePreview;
}

function updateLivePreview() {
  const canvas = document.getElementById('live-preview-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const state = loadState();

  // 背景描画
  const bgId = state.backgroundTemplate || 'bright-future';
  const bg = ZOOM_BACKGROUNDS.find(b => b.id === bgId);

  // グラデーション解析・描画
  ctx.clearRect(0, 0, w, h);

  if (bg && bg.gradient) {
    // CSSグラデーションをCanvas用に簡易変換
    drawGradientBg(ctx, w, h, bg);
  } else {
    ctx.fillStyle = '#e8ecf1';
    ctx.fillRect(0, 0, w, h);
  }

  // ボケ玉エフェクト
  if (bg && bg.bokeh) {
    drawBokeh(ctx, w, h);
  }

  // QRコード配置（ユーザー設定位置+サイズ）
  const qrSizePct = state.qrSize || 15;
  const qrSize = Math.round(w * qrSizePct / 100);
  const qrPosition = state.qrPosition || { x: 82, y: 78 };
  const qrX = (qrPosition.x / 100) * w - qrSize / 2;
  const qrY = (qrPosition.y / 100) * h - qrSize / 2;

  // QR白背景
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.roundRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 4);
  ctx.fill();

  // QRっぽいパターン描画
  const qd = state.qrDesign || {};
  ctx.fillStyle = qd.dotColor || '#000000';

  // ファインダーパターン（3つの角）
  const fp = Math.round(qrSize * 0.25);
  drawFinderPattern(ctx, qrX + 2, qrY + 2, fp, qd.dotColor || '#000');
  drawFinderPattern(ctx, qrX + qrSize - fp - 2, qrY + 2, fp, qd.cornerColor || '#000');
  drawFinderPattern(ctx, qrX + 2, qrY + qrSize - fp - 2, fp, qd.cornerColor || '#000');

  // データドット
  const dotSize = 2;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (Math.sin(r * 7 + c * 13) > -0.3) {
        const dx = qrX + fp + 4 + c * (qrSize - fp * 2 - 8) / 8;
        const dy = qrY + fp + 4 + r * (qrSize - fp * 2 - 8) / 8;
        ctx.fillStyle = qd.dotColor || '#000';
        ctx.fillRect(dx, dy, dotSize, dotSize);
      }
    }
  }
}

function drawFinderPattern(ctx, x, y, size, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, size, size);
  ctx.fillStyle = color;
  const inner = Math.round(size * 0.35);
  const offset = Math.round((size - inner) / 2);
  ctx.fillRect(x + offset, y + offset, inner, inner);
}

function drawGradientBg(ctx, w, h, bg) {
  // 簡易的にCSSグラデーションの色を抽出して描画
  const colorMatch = bg.gradient.match(/#[0-9a-fA-F]{6}/g);
  if (colorMatch && colorMatch.length >= 2) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    colorMatch.forEach((c, i) => {
      grad.addColorStop(i / (colorMatch.length - 1), c);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.fillStyle = '#e8ecf1';
    ctx.fillRect(0, 0, w, h);
  }
}

function drawBokeh(ctx, w, h) {
  const circles = [
    { x: 0.15, y: 0.2, r: 20, a: 0.15 },
    { x: 0.75, y: 0.15, r: 12, a: 0.12 },
    { x: 0.45, y: 0.6, r: 25, a: 0.1 },
    { x: 0.85, y: 0.45, r: 15, a: 0.12 },
    { x: 0.25, y: 0.8, r: 18, a: 0.08 },
    { x: 0.6, y: 0.3, r: 10, a: 0.15 },
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

// saveStateをラップしてライブプレビューを自動更新
const _originalSaveState = saveState;
const patchedSaveState = (updates) => {
  const result = _originalSaveState(updates);
  updateLivePreview();
  return result;
};

// グローバルに更新関数を公開（他のモジュールから呼べるように）
window._updateLivePreview = updateLivePreview;

function restoreState() {
  const state = loadState();

  // Restore link toggle
  const toggle = document.getElementById('link-toggle');
  const optionsWrap = document.getElementById('link-options-wrap');
  if (toggle && state.linkEnabled) {
    toggle.checked = true;
    if (optionsWrap) optionsWrap.classList.add('visible');
  }
  // Restore link list
  if (state.links && state.links.length > 0) {
    renderLinkList();
  }
  // Restore link color
  if (state.linkColor) {
    const grid = document.getElementById('link-color-grid');
    const picker = document.getElementById('link-color-picker');
    if (grid) {
      grid.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.color === state.linkColor);
      });
    }
    if (picker) picker.value = state.linkColor;
  }
  updateLinkPreview();

  // Restore uploaded image
  if (state.cardImage) {
    const area = document.getElementById('upload-area');
    if (area) {
      area.classList.add('has-file');
      area.innerHTML = `
        <div class="upload-preview">
          <img src="${state.cardImage}" alt="${state.cardImageName || '名刺'}">
        </div>
        <p class="upload-text" style="margin-top: 0.75rem">
          <strong>${state.cardImageName || '名刺画像'}</strong>
        </p>
        <p class="upload-hint">クリックで変更</p>
      `;
    }
    const previewImg = document.getElementById('anim-preview-img');
    if (previewImg) previewImg.src = state.cardImage;
  }

  // 初回ライブプレビュー更新
  updateLivePreview();
}
