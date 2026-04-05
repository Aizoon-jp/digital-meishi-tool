/**
 * Background Selector - card page background + Zoom background template
 */
import { saveState } from './state-manager.js';

const CARD_BACKGROUNDS = [
  { id: 'navy',        name: 'ネイビー',     css: '#1a1f2e' },
  { id: 'charcoal',    name: 'チャコール',   css: '#1e1e1e' },
  { id: 'midnight',    name: 'ミッドナイト', css: '#0d1117' },
  { id: 'wine',        name: 'ワイン',       css: '#2a1520' },
  { id: 'forest',      name: 'フォレスト',   css: '#152a1a' },
  { id: 'slate',       name: 'スレート',     css: '#2d3748' },
  { id: 'warm-gray',   name: 'ウォームグレー', css: '#292524' },
  { id: 'ocean',       name: 'オーシャン',   css: '#0f2027' },
];

const ZOOM_BACKGROUNDS = [
  { id: 'minimal',    name: 'ミニマル',     desc: 'シンプルな単色' },
  { id: 'gradient',   name: 'グラデーション', desc: '上品なグラデ' },
  { id: 'corporate',  name: 'コーポレート', desc: 'ビジネス向け' },
];

export function initCardBackgroundSelector() {
  const grid = document.getElementById('card-bg-grid');
  if (!grid) return;

  grid.innerHTML = CARD_BACKGROUNDS.map(bg => `
    <div class="card-bg-item${bg.id === 'navy' ? ' active' : ''}"
         data-bg="${bg.id}" style="background: ${bg.css}"
         title="${bg.name}">
    </div>
  `).join('');

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.card-bg-item');
    if (!item) return;

    document.querySelectorAll('.card-bg-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    saveState({ cardBackground: item.dataset.bg });

    // Update preview container background
    const preview = document.getElementById('anim-preview');
    const bg = CARD_BACKGROUNDS.find(b => b.id === item.dataset.bg);
    if (preview && bg) preview.style.backgroundColor = bg.css;
  });
}

export function initZoomBackgroundSelector() {
  const grid = document.getElementById('zoom-bg-grid');
  if (!grid) return;

  grid.innerHTML = ZOOM_BACKGROUNDS.map(bg => `
    <div class="bg-template-item${bg.id === 'minimal' ? ' active' : ''}"
         data-bg="${bg.id}">
      <div style="width:100%;height:100%;background:var(--color-bg-input);
           display:flex;align-items:center;justify-content:center;">
        <span style="color:var(--color-text-subtle);font-size:0.8rem">${bg.name}</span>
      </div>
      <div class="bg-template-label">${bg.desc}</div>
    </div>
  `).join('');

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.bg-template-item');
    if (!item) return;

    document.querySelectorAll('.bg-template-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    saveState({ backgroundTemplate: item.dataset.bg });
  });
}

export { CARD_BACKGROUNDS, ZOOM_BACKGROUNDS };
