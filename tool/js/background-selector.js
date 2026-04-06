/**
 * Background Selector - card page background + Zoom background template
 * Expanded with profession-specific templates
 */
import { saveState } from './state-manager.js';

// --- 名刺ページ背景（QR読み取り先の背景色）---
const CARD_BACKGROUNDS = [
  // ダーク系
  { id: 'navy',        name: 'ネイビー',       css: '#1a1f2e', category: 'dark' },
  { id: 'charcoal',    name: 'チャコール',     css: '#1e1e1e', category: 'dark' },
  { id: 'midnight',    name: 'ミッドナイト',   css: '#0d1117', category: 'dark' },
  { id: 'slate',       name: 'スレート',       css: '#2d3748', category: 'dark' },
  // ライト系
  { id: 'white',       name: 'ホワイト',       css: '#f8f9fa', category: 'light' },
  { id: 'cream',       name: 'クリーム',       css: '#FFF8F0', category: 'light' },
  { id: 'soft-gray',   name: 'ソフトグレー',   css: '#ecf0f1', category: 'light' },
  // ナチュラル系
  { id: 'beige',       name: 'ベージュ',       css: '#f5e6d3', category: 'natural' },
  { id: 'sage',        name: 'セージ',         css: '#d4ddd0', category: 'natural' },
  { id: 'warm-sand',   name: 'サンド',         css: '#e8d5b7', category: 'natural' },
  // カラー系
  { id: 'rose',        name: 'ローズ',         css: '#f4e2d8', category: 'color' },
  { id: 'lavender',    name: 'ラベンダー',     css: '#e8dff5', category: 'color' },
  { id: 'mint',        name: 'ミント',         css: '#e0f2f1', category: 'color' },
  { id: 'sky',         name: 'スカイ',         css: '#e3f2fd', category: 'color' },
];

// --- Zoom背景テンプレート ---
const ZOOM_BACKGROUNDS = [
  // ミニマル
  {
    id: 'minimal-white', name: 'ミニマル・ホワイト',
    category: 'ミニマル',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 50%, #e8ecf1 100%)',
  },
  {
    id: 'minimal-warm', name: 'ミニマル・ウォーム',
    category: 'ミニマル',
    gradient: 'linear-gradient(135deg, #f5f0eb 0%, #ebe4db 50%, #e0d6ca 100%)',
  },
  // 爽やか・希望（コーチング向け）
  {
    id: 'bright-future', name: '明るい未来',
    category: '爽やか',
    gradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 30%, #b3e5fc 70%, #e1f5fe 100%)',
    bokeh: true,
  },
  {
    id: 'fresh-green', name: '木漏れ日',
    category: '爽やか',
    gradient: 'linear-gradient(160deg, #c8e6c9 0%, #a5d6a7 30%, #81d4fa 70%, #b3e5fc 100%)',
    bokeh: true,
  },
  {
    id: 'morning-light', name: '朝の光',
    category: '爽やか',
    gradient: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 30%, #e1f5fe 70%, #b3e5fc 100%)',
    bokeh: true,
  },
  // エレガント
  {
    id: 'rose-gold', name: 'ローズゴールド',
    category: 'エレガント',
    gradient: 'linear-gradient(135deg, #f4e2d8 0%, #e8c4b8 50%, #d4a090 100%)',
  },
  {
    id: 'champagne', name: 'シャンパン',
    category: 'エレガント',
    gradient: 'linear-gradient(135deg, #f7e7ce 0%, #f0d5a8 50%, #e8c68a 100%)',
  },
  {
    id: 'lavender-mist', name: 'ラベンダーミスト',
    category: 'エレガント',
    gradient: 'linear-gradient(135deg, #e8dff5 0%, #d4c5f0 50%, #c0aceb 100%)',
  },
  // ナチュラル
  {
    id: 'natural-beige', name: 'ナチュラルベージュ',
    category: 'ナチュラル',
    gradient: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 50%, #d4c0a0 100%)',
  },
  {
    id: 'forest-green', name: 'フォレスト',
    category: 'ナチュラル',
    gradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
  },
  {
    id: 'wood-warm', name: 'ウッド',
    category: 'ナチュラル',
    gradient: 'linear-gradient(160deg, #d4a574 0%, #c49a6c 30%, #a67c52 60%, #8b6240 100%)',
  },
  // ヒーリング
  {
    id: 'aurora', name: 'オーロラ',
    category: 'ヒーリング',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d4c5f0 100%)',
  },
  {
    id: 'healing-sky', name: 'やすらぎ',
    category: 'ヒーリング',
    gradient: 'linear-gradient(180deg, #89CFF0 0%, #b8d4e3 50%, #d4e6f1 100%)',
  },
  {
    id: 'sage-mist', name: 'セージミスト',
    category: 'ヒーリング',
    gradient: 'linear-gradient(135deg, #c9d6c3 0%, #b5c4ad 50%, #d4ddd0 100%)',
  },
  // プロフェッショナル
  {
    id: 'pro-blue', name: 'プロフェッショナル',
    category: 'ビジネス',
    gradient: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)',
  },
  {
    id: 'executive', name: 'エグゼクティブ',
    category: 'ビジネス',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    id: 'tech-cyber', name: 'テック',
    category: 'ビジネス',
    gradient: 'linear-gradient(135deg, #120136 0%, #2b1055 50%, #5c2d91 100%)',
  },
  // ポップ
  {
    id: 'candy', name: 'キャンディ',
    category: 'ポップ',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
  {
    id: 'sunset', name: 'サンセット',
    category: 'ポップ',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)',
  },
  {
    id: 'tropical', name: 'トロピカル',
    category: 'ポップ',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  // 和モダン
  {
    id: 'indigo', name: '藍',
    category: '和モダン',
    gradient: 'linear-gradient(135deg, #1b3a5c 0%, #264e7a 50%, #2c5f8a 100%)',
  },
  {
    id: 'matcha', name: '抹茶',
    category: '和モダン',
    gradient: 'linear-gradient(135deg, #4a5d23 0%, #6b7b3a 50%, #8a9a56 100%)',
  },
];

// --- ボケ玉エフェクト生成 ---
function createBokehCSS() {
  const colors = [
    'rgba(255,255,255,0.4)',
    'rgba(255,255,255,0.25)',
    'rgba(200,230,201,0.3)',
    'rgba(179,229,252,0.25)',
    'rgba(255,249,196,0.2)',
    'rgba(255,255,255,0.35)',
    'rgba(200,230,201,0.2)',
    'rgba(255,255,255,0.15)',
  ];
  const positions = [
    { x: 15, y: 20, r: 40 }, { x: 75, y: 15, r: 25 },
    { x: 45, y: 60, r: 50 }, { x: 85, y: 45, r: 30 },
    { x: 25, y: 80, r: 35 }, { x: 60, y: 30, r: 20 },
    { x: 10, y: 50, r: 45 }, { x: 90, y: 75, r: 28 },
  ];
  return positions.map((p, i) =>
    `radial-gradient(circle at ${p.x}% ${p.y}%, ${colors[i]} 0%, transparent ${p.r}px)`
  ).join(',');
}

export function initCardBackgroundSelector() {
  const grid = document.getElementById('card-bg-grid');
  if (!grid) return;

  // カテゴリ別に表示
  const categories = [...new Set(CARD_BACKGROUNDS.map(b => b.category))];
  let html = '';

  categories.forEach(cat => {
    const catName = { dark: 'ダーク', light: 'ライト', natural: 'ナチュラル', color: 'カラー' }[cat];
    html += `<div class="card-bg-category-label">${catName}</div>`;
    html += '<div class="card-bg-row">';
    CARD_BACKGROUNDS.filter(b => b.category === cat).forEach(bg => {
      html += `
        <div class="card-bg-item${bg.id === 'cream' ? ' active' : ''}"
             data-bg="${bg.id}" style="background: ${bg.css}"
             title="${bg.name}">
        </div>`;
    });
    html += '</div>';
  });

  grid.innerHTML = html;

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.card-bg-item');
    if (!item) return;

    document.querySelectorAll('.card-bg-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    saveState({ cardBackground: item.dataset.bg });

    const bg = CARD_BACKGROUNDS.find(b => b.id === item.dataset.bg);
    const screen = document.querySelector('.phone-screen');
    if (screen && bg) screen.style.backgroundColor = bg.css;
  });
}

export function initZoomBackgroundSelector() {
  const grid = document.getElementById('zoom-bg-grid');
  if (!grid) return;

  // カテゴリ別に表示
  const categories = [...new Set(ZOOM_BACKGROUNDS.map(b => b.category))];
  let html = '';

  categories.forEach(cat => {
    html += `<div class="zoom-bg-category-label">${cat}</div>`;
    html += '<div class="zoom-bg-row">';
    ZOOM_BACKGROUNDS.filter(b => b.category === cat).forEach(bg => {
      const bokehStyle = bg.bokeh
        ? `background: ${createBokehCSS()}, ${bg.gradient};`
        : `background: ${bg.gradient};`;
      html += `
        <div class="bg-template-item${bg.id === 'bright-future' ? ' active' : ''}"
             data-bg="${bg.id}">
          <div class="bg-template-preview" style="${bokehStyle}"></div>
          <div class="bg-template-label">${bg.name}</div>
        </div>`;
    });
    html += '</div>';
  });

  grid.innerHTML = html;

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.bg-template-item');
    if (!item) return;

    document.querySelectorAll('.bg-template-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    saveState({ backgroundTemplate: item.dataset.bg });
    if (window._updateLivePreview) window._updateLivePreview();
  });
}

export { CARD_BACKGROUNDS, ZOOM_BACKGROUNDS };
