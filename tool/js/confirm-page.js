/**
 * Confirm Page - render all selections as preview
 */
import { loadState } from './state-manager.js';
import { ANIMATIONS, playAnimation } from './animation-previewer.js';
import { CARD_BACKGROUNDS, ZOOM_BACKGROUNDS } from './background-selector.js';

const DOT_SHAPE_NAMES = {
  square: 'スクエア', rounded: 'ラウンド', dots: 'ドット',
  classy: 'クラシック', 'classy-rounded': 'クラシックR', 'extra-rounded': 'エクストラR',
};

const CARD_BG_COLORS = {
  navy: '#1a1f2e', charcoal: '#1e1e1e', midnight: '#0d1117',
  slate: '#2d3748', white: '#f8f9fa', cream: '#FFF8F0',
  'soft-gray': '#ecf0f1', beige: '#f5e6d3', sage: '#d4ddd0',
  'warm-sand': '#e8d5b7', rose: '#f4e2d8', lavender: '#e8dff5',
  mint: '#e0f2f1', sky: '#e3f2fd',
};

document.addEventListener('DOMContentLoaded', () => {
  const state = loadState();

  if (!state.cardImage) {
    window.location.href = 'index.html';
    return;
  }

  // Card preview image
  const img = document.getElementById('preview-card-img');
  if (img) img.src = state.cardImage;

  // Card preview background
  const wrap = document.getElementById('card-preview-wrap');
  if (wrap) {
    wrap.style.backgroundColor = CARD_BG_COLORS[state.cardBackground] || '#1a1f2e';
  }

  // Summary values
  if (state.qrDesign && typeof state.qrDesign === 'object') {
    var shapeName = DOT_SHAPE_NAMES[state.qrDesign.dotShape] || state.qrDesign.dotShape;
    setText('sum-qr', shapeName + ' / ' + state.qrDesign.dotColor);
  } else {
    setText('sum-qr', 'カスタム');
  }
  var zoomBg = ZOOM_BACKGROUNDS.find(function(b) { return b.id === state.backgroundTemplate; });
  setText('sum-bg', zoomBg ? zoomBg.name : state.backgroundTemplate);
  var cardBg = CARD_BACKGROUNDS.find(function(b) { return b.id === state.cardBackground; });
  setText('sum-card-bg', cardBg ? cardBg.name : state.cardBackground);
  setText('sum-link', state.linkEnabled ? state.linkUrl || '（URL未入力）' : 'なし');

  const anim = ANIMATIONS.find(a => a.id === state.animationType);
  setText('sum-anim', anim ? anim.name : state.animationType);

  // Play animation on card preview
  const card = document.getElementById('card-preview');
  const playBtn = document.getElementById('preview-play-btn');

  if (playBtn && card) {
    playBtn.addEventListener('click', () => {
      // Reset
      ANIMATIONS.forEach(a => card.classList.remove(a.class));
      card.classList.add('anim-reset');
      void card.offsetWidth;
      card.classList.remove('anim-reset');

      // Play
      if (anim) card.classList.add(anim.class);
    });

    // Auto-play on load
    setTimeout(() => {
      if (anim) card.classList.add(anim.class);
    }, 300);
  }

  // Agreement + Pay button
  const agreeBtn = document.getElementById('btn-agree');
  const check1 = document.getElementById('agree-terms');
  const check2 = document.getElementById('agree-tokushoho');

  if (agreeBtn) {
    agreeBtn.disabled = true;
    agreeBtn.style.opacity = '0.4';

    const updateBtn = () => {
      const agreed = check1?.checked && check2?.checked;
      agreeBtn.disabled = !agreed;
      agreeBtn.style.opacity = agreed ? '1' : '0.4';
    };

    check1?.addEventListener('change', updateBtn);
    check2?.addEventListener('change', updateBtn);

    agreeBtn.addEventListener('click', () => {
      if (agreeBtn.disabled) return;
      // Stripe決済 or 完了画面へ（Phase 4で実装）
      window.location.href = 'complete.html';
    });
  }
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
