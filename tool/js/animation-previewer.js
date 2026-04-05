/**
 * Animation Previewer - selection + live preview playback
 */
import { saveState } from './state-manager.js';

const ANIMATIONS = [
  { id: 'slide-down',  name: 'スライドダウン', class: 'anim-slide-down' },
  { id: 'fade-in',     name: 'フェードイン',   class: 'anim-fade-in' },
  { id: 'scale-in',    name: 'スケールイン',   class: 'anim-scale-in' },
  { id: 'flip-in',     name: 'フリップイン',   class: 'anim-flip-in' },
  { id: 'bounce-in',   name: 'バウンスイン',   class: 'anim-bounce-in' },
  { id: 'slide-up',    name: 'スライドアップ', class: 'anim-slide-up' },
  { id: 'rotate-in',   name: 'ローテートイン', class: 'anim-rotate-in' },
  { id: 'blur-fade',   name: 'ブラーフェード', class: 'anim-blur-fade' },
  { id: 'shine',       name: 'シャイン',       class: 'anim-shine' },
  { id: 'cascade',     name: 'カスケード',     class: 'anim-cascade' },
  { id: 'sparkle',     name: 'キラキラ',       class: 'anim-sparkle' },
  { id: 'transform',   name: '変身',           class: 'anim-transform' },
  { id: 'dramatic',    name: 'ドラマチック',   class: 'anim-dramatic' },
  { id: 'bishoujo',    name: '美少女戦士',     class: 'anim-bishoujo' },
];

let currentAnim = 'slide-down';

export function initAnimationPreviewer() {
  const grid = document.getElementById('anim-grid');
  if (!grid) return;

  grid.innerHTML = ANIMATIONS.map(a => `
    <div class="anim-item${a.id === currentAnim ? ' active' : ''}" data-anim="${a.id}">
      <div class="anim-thumb"><div class="anim-thumb-inner"></div></div>
      <span class="anim-name">${a.name}</span>
    </div>
  `).join('');

  grid.addEventListener('click', handleSelect);

  const playBtn = document.getElementById('play-anim-btn');
  if (playBtn) playBtn.addEventListener('click', () => playAnimation(currentAnim));
}

function handleSelect(e) {
  const item = e.target.closest('.anim-item');
  if (!item) return;

  const animId = item.dataset.anim;
  currentAnim = animId;
  saveState({ animationType: animId });

  document.querySelectorAll('.anim-item').forEach(el => el.classList.remove('active'));
  item.classList.add('active');

  playAnimation(animId);
}

export function playAnimation(animId) {
  const anim = ANIMATIONS.find(a => a.id === animId);
  if (!anim) return;

  const container = document.getElementById('anim-preview');
  const card = document.getElementById('anim-preview-card');
  if (!container || !card) return;

  // Remove all animation classes
  ANIMATIONS.forEach(a => card.classList.remove(a.class));
  card.classList.remove('anim-reset');

  // Reset: hide the card
  card.classList.add('anim-reset');

  // Handle shine overlay
  let shineEl = card.querySelector('.shine-overlay');
  if (animId === 'shine') {
    if (!shineEl) {
      shineEl = document.createElement('div');
      shineEl.className = 'shine-overlay';
      card.appendChild(shineEl);
    }
    shineEl.style.left = '-100%';
  } else if (shineEl) {
    shineEl.remove();
  }

  // Force reflow then apply animation
  void card.offsetWidth;
  card.classList.remove('anim-reset');
  card.classList.add(anim.class);

  card.addEventListener('animationend', function onEnd() {
    card.removeEventListener('animationend', onEnd);
  });
}

export { ANIMATIONS };
