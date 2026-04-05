/**
 * Confirm Page - render all selections as preview
 */
import { loadState } from './state-manager.js';
import { ANIMATIONS, playAnimation } from './animation-previewer.js';

const DOT_SHAPE_NAMES = {
  square: 'スクエア', rounded: 'ラウンド', dots: 'ドット',
  classy: 'クラシック', 'classy-rounded': 'クラシックR', 'extra-rounded': 'エクストラR',
};

const BG_NAMES = {
  minimal: 'ミニマル', gradient: 'グラデーション', corporate: 'コーポレート',
};

const CARD_BG_NAMES = {
  navy: 'ネイビー', charcoal: 'チャコール', midnight: 'ミッドナイト',
  wine: 'ワイン', forest: 'フォレスト', slate: 'スレート',
  'warm-gray': 'ウォームグレー', ocean: 'オーシャン',
};

const CARD_BG_COLORS = {
  navy: '#1a1f2e', charcoal: '#1e1e1e', midnight: '#0d1117',
  wine: '#2a1520', forest: '#152a1a', slate: '#2d3748',
  'warm-gray': '#292524', ocean: '#0f2027',
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
  setText('sum-bg', BG_NAMES[state.backgroundTemplate] || state.backgroundTemplate);
  setText('sum-card-bg', CARD_BG_NAMES[state.cardBackground] || state.cardBackground);
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
