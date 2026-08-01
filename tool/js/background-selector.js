/**
 * Background Selector - card page background + Zoom background template
 * Expanded with profession-specific templates
 */
import { saveState } from './state-manager.js';

// --- 名刺ページ背景（QR読み取り先の背景色）---
// ライト → ナチュラル → カラー → ダーク の順（薄→濃）
const CARD_BACKGROUNDS = [
  // ライト系
  { id: 'white',       name: 'ホワイト',       css: '#f8f9fa',   category: 'light' },
  { id: 'cream',       name: 'クリーム',       css: '#FFF8F0',   category: 'light' },
  { id: 'milk',        name: 'ミルク',         css: '#fefcf3',   category: 'light' },
  { id: 'pearl',       name: 'パール',         css: '#f0eff4',   category: 'light' },
  { id: 'ice-blue',    name: 'アイスブルー',   css: '#eef3f7',   category: 'light' },
  { id: 'soft-gray',   name: 'ソフトグレー',   css: '#ecf0f1',   category: 'light' },
  // ナチュラル系
  { id: 'beige',       name: 'ベージュ',       css: '#f5e6d3',   category: 'natural' },
  { id: 'warm-sand',   name: 'サンド',         css: '#e8d5b7',   category: 'natural' },
  { id: 'terracotta-l',name: 'テラコッタ',     css: '#f0d9c8',   category: 'natural' },
  { id: 'sage',        name: 'セージ',         css: '#d4ddd0',   category: 'natural' },
  { id: 'moss',        name: 'モス',           css: '#c5ceb5',   category: 'natural' },
  { id: 'linen',       name: 'リネン',         css: '#e8ddd3',   category: 'natural' },
  // カラー系
  { id: 'rose',        name: 'ローズ',         css: '#f4e2d8',   category: 'color' },
  { id: 'blush',       name: 'ブラッシュ',     css: '#fce4ec',   category: 'color' },
  { id: 'peach',       name: 'ピーチ',         css: '#fde8d8',   category: 'color' },
  { id: 'lavender',    name: 'ラベンダー',     css: '#e8dff5',   category: 'color' },
  { id: 'mint',        name: 'ミント',         css: '#e0f2f1',   category: 'color' },
  { id: 'sky',         name: 'スカイ',         css: '#e3f2fd',   category: 'color' },
  { id: 'aqua',        name: 'アクア',         css: '#e0f7fa',   category: 'color' },
  { id: 'lilac',       name: 'ライラック',     css: '#ede7f6',   category: 'color' },
  // ダーク系
  { id: 'slate',       name: 'スレート',       css: '#4a5568',   category: 'dark' },
  { id: 'dark-teal',   name: 'ティール',       css: '#2c6e6f',   category: 'dark' },
  { id: 'navy',        name: 'ネイビー',       css: '#2b3a5e',   category: 'dark' },
  { id: 'forest',      name: 'フォレスト',     css: '#2d5a2d',   category: 'dark' },
  { id: 'wine',        name: 'ワイン',         css: '#5c2340',   category: 'dark' },
  { id: 'charcoal',    name: 'チャコール',     css: '#3a3a3a',   category: 'dark' },
  { id: 'midnight',    name: 'ミッドナイト',   css: '#1a2030',   category: 'dark' },
];

// --- グラデーション背景 ---
const CARD_GRADIENTS = [
  // ライト系グラデーション
  { id: 'g-sunrise',     name: 'サンライズ',     css: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',          category: 'g-light' },
  { id: 'g-morning',     name: 'モーニング',     css: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',          category: 'g-light' },
  { id: 'g-cotton',      name: 'コットン',       css: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',          category: 'g-light' },
  { id: 'g-peach-warm',  name: 'ピーチウォーム', css: 'linear-gradient(135deg, #fff5ee 0%, #fde2d4 50%, #f8c4b4 100%)', category: 'g-light' },
  // カラー系グラデーション
  { id: 'g-lavender',    name: 'ラベンダー',     css: 'linear-gradient(135deg, #e8dff5 0%, #d4c5f0 50%, #c0aceb 100%)', category: 'g-color' },
  { id: 'g-ocean',       name: 'オーシャン',     css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',          category: 'g-color' },
  { id: 'g-aurora',      name: 'オーロラ',       css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d4c5f0 100%)', category: 'g-color' },
  { id: 'g-candy',       name: 'キャンディ',     css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',          category: 'g-color' },
  { id: 'g-mint-fresh',  name: 'ミントフレッシュ',css: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',         category: 'g-color' },
  { id: 'g-sunset',      name: 'サンセット',     css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',          category: 'g-color' },
  // ダーク系グラデーション
  { id: 'g-deep-blue',   name: 'ディープブルー', css: 'linear-gradient(135deg, #0c3547 0%, #1a1f2e 100%)',          category: 'g-dark' },
  { id: 'g-dark-wine',   name: 'ダークワイン',   css: 'linear-gradient(135deg, #3c1053 0%, #ad5389 100%)',          category: 'g-dark' },
  { id: 'g-night-sky',   name: 'ナイトスカイ',   css: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', category: 'g-dark' },
  { id: 'g-forest-d',    name: 'ディープフォレスト',css: 'linear-gradient(135deg, #0b3d0b 0%, #1a3c2a 50%, #2d4a3e 100%)', category: 'g-dark' },
];

// --- パターン背景 ---
const CARD_PATTERNS = [
  {
    id: 'p-wave',      name: 'ウェーブ',
    css: `#eef3f7`,
    pattern: `radial-gradient(circle at 100% 150%, #eef3f7 24%, #d4e4f0 24%, #d4e4f0 28%, #eef3f7 28%, #eef3f7 36%, #d4e4f0 36%, #d4e4f0 40%, transparent 40%), radial-gradient(circle at 0% 150%, #eef3f7 24%, #d4e4f0 24%, #d4e4f0 28%, #eef3f7 28%, #eef3f7 36%, #d4e4f0 36%, #d4e4f0 40%, transparent 40%)`,
    patternSize: '50px 25px',
    category: 'pattern',
  },
  {
    id: 'p-wave-warm', name: 'ウェーブウォーム',
    css: `#fff5ee`,
    pattern: `radial-gradient(circle at 100% 150%, #fff5ee 24%, #f0d9c8 24%, #f0d9c8 28%, #fff5ee 28%, #fff5ee 36%, #f0d9c8 36%, #f0d9c8 40%, transparent 40%), radial-gradient(circle at 0% 150%, #fff5ee 24%, #f0d9c8 24%, #f0d9c8 28%, #fff5ee 28%, #fff5ee 36%, #f0d9c8 36%, #f0d9c8 40%, transparent 40%)`,
    patternSize: '50px 25px',
    category: 'pattern',
  },
  {
    id: 'p-dots',      name: 'ドット',
    css: `#f8f9fa`,
    pattern: `radial-gradient(circle, #ddd 1px, transparent 1px)`,
    patternSize: '20px 20px',
    category: 'pattern',
  },
  {
    id: 'p-dots-warm', name: 'ドットウォーム',
    css: `#FFF8F0`,
    pattern: `radial-gradient(circle, #e8d5b7 1.2px, transparent 1.2px)`,
    patternSize: '18px 18px',
    category: 'pattern',
  },
  {
    id: 'p-stripe',    name: 'ストライプ',
    css: `#f8f9fa`,
    pattern: `repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(0,0,0,0.03) 12px, rgba(0,0,0,0.03) 24px)`,
    category: 'pattern',
  },
  {
    id: 'p-stripe-color', name: 'ストライプカラー',
    css: `#ede7f6`,
    pattern: `repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(149,117,205,0.08) 12px, rgba(149,117,205,0.08) 24px)`,
    category: 'pattern',
  },
  {
    id: 'p-grid',      name: 'グリッド',
    css: `#f0eff4`,
    pattern: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
    patternSize: '24px 24px',
    category: 'pattern',
  },
  {
    id: 'p-diamond',   name: 'ダイヤモンド',
    css: `#eef3f7`,
    pattern: `linear-gradient(45deg, rgba(0,0,0,0.03) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.03) 75%), linear-gradient(45deg, rgba(0,0,0,0.03) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.03) 75%)`,
    patternSize: '30px 30px',
    patternPosition: '0 0, 15px 15px',
    category: 'pattern',
  },
];

// 全背景を統合検索するヘルパー
function findBackground(id) {
  return CARD_BACKGROUNDS.find(b => b.id === id)
    || CARD_GRADIENTS.find(b => b.id === id)
    || CARD_PATTERNS.find(b => b.id === id);
}

// 背景CSSをphone-screenに適用
function applyBackgroundToScreen(screen, bg) {
  if (!screen || !bg) return;
  // リセット
  screen.style.background = '';
  screen.style.backgroundSize = '';
  screen.style.backgroundPosition = '';

  if (bg.pattern) {
    // パターン背景
    screen.style.backgroundColor = bg.css;
    if (bg.pattern.startsWith('url(')) {
      // SVG波形: 背景色 + 下部にSVG
      screen.style.background = `${bg.pattern} no-repeat bottom / 100% auto, ${bg.css}`;
    } else {
      screen.style.background = `${bg.pattern}, ${bg.css}`;
      if (bg.patternSize) screen.style.backgroundSize = bg.patternSize;
      if (bg.patternPosition) screen.style.backgroundPosition = bg.patternPosition;
    }
  } else if (bg.css.startsWith('linear-gradient') || bg.css.startsWith('radial-gradient')) {
    // グラデーション
    screen.style.background = bg.css;
  } else {
    // ソリッドカラー
    screen.style.backgroundColor = bg.css;
  }
}

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
  {
    id: 'minimal-gray', name: 'ミニマル・グレー',
    category: 'ミニマル',
    gradient: 'linear-gradient(135deg, #fafafa 0%, #f2f3f5 50%, #ecedef 100%)',
  },
  {
    id: 'minimal-pink', name: 'ミニマル・ピンク',
    category: 'ミニマル',
    gradient: 'linear-gradient(135deg, #fffafa 0%, #fdf2f4 50%, #fae8ec 100%)',
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

  let currentTab = 'solid';

  function render(tab) {
    currentTab = tab;
    let html = '';

    // タブUI
    html += '<div class="card-bg-tabs">';
    html += `<button class="card-bg-tab${tab === 'solid' ? ' active' : ''}" data-tab="solid">ソリッド</button>`;
    html += `<button class="card-bg-tab${tab === 'gradient' ? ' active' : ''}" data-tab="gradient">グラデーション</button>`;
    html += `<button class="card-bg-tab${tab === 'pattern' ? ' active' : ''}" data-tab="pattern">パターン</button>`;
    html += '</div>';

    if (tab === 'solid') {
      const catOrder = ['light', 'natural', 'color', 'dark'];
      const catNames = { light: 'ライト', natural: 'ナチュラル', color: 'カラー', dark: 'ダーク' };
      catOrder.forEach(cat => {
        html += `<div class="card-bg-category-label">${catNames[cat]}</div>`;
        html += '<div class="card-bg-row">';
        CARD_BACKGROUNDS.filter(b => b.category === cat).forEach(bg => {
          html += `
            <div class="card-bg-item${bg.id === 'white' ? ' active' : ''}"
                 data-bg="${bg.id}" style="background: ${bg.css}"
                 title="${bg.name}"></div>`;
        });
        html += '</div>';
      });
    } else if (tab === 'gradient') {
      const catOrder = ['g-light', 'g-color', 'g-dark'];
      const catNames = { 'g-light': 'ライト', 'g-color': 'カラー', 'g-dark': 'ダーク' };
      catOrder.forEach(cat => {
        html += `<div class="card-bg-category-label">${catNames[cat]}</div>`;
        html += '<div class="card-bg-row card-bg-row--gradient">';
        CARD_GRADIENTS.filter(b => b.category === cat).forEach(bg => {
          html += `
            <div class="card-bg-item card-bg-item--gradient"
                 data-bg="${bg.id}" style="background: ${bg.css}"
                 title="${bg.name}">
              <span class="card-bg-item-label">${bg.name}</span>
            </div>`;
        });
        html += '</div>';
      });
    } else if (tab === 'pattern') {
      html += '<div class="card-bg-row card-bg-row--pattern">';
      CARD_PATTERNS.forEach(bg => {
        let previewStyle = `background: ${bg.pattern}, ${bg.css};`;
        if (bg.patternSize) previewStyle += `background-size: ${bg.patternSize};`;
        if (bg.patternPosition) previewStyle += `background-position: ${bg.patternPosition};`;
        if (bg.pattern.startsWith('url(')) {
          previewStyle = `background: ${bg.pattern} no-repeat bottom / 100% auto, ${bg.css};`;
        }
        html += `
          <div class="card-bg-item card-bg-item--pattern"
               data-bg="${bg.id}" style="${previewStyle}"
               title="${bg.name}">
            <span class="card-bg-item-label">${bg.name}</span>
          </div>`;
      });
      html += '</div>';
    }

    grid.innerHTML = html;
  }

  render('solid');

  grid.addEventListener('click', (e) => {
    // タブ切替
    const tab = e.target.closest('.card-bg-tab');
    if (tab) {
      render(tab.dataset.tab);
      return;
    }

    // 背景選択
    const item = e.target.closest('.card-bg-item');
    if (!item) return;

    document.querySelectorAll('.card-bg-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    saveState({ cardBackground: item.dataset.bg });

    const bg = findBackground(item.dataset.bg);
    const screen = document.querySelector('.phone-screen');
    applyBackgroundToScreen(screen, bg);
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
             data-bg="${bg.id}" style="overflow:visible">
          <div class="bg-template-preview" style="${bokehStyle} aspect-ratio:16/9; border-radius:inherit; overflow:hidden"></div>
          <div style="display:block; padding:0.35rem 0 0; color:#c5795a; font-size:0.85rem; text-align:center; letter-spacing:0.02em">${bg.name}</div>
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

export { CARD_BACKGROUNDS, CARD_GRADIENTS, CARD_PATTERNS, ZOOM_BACKGROUNDS, findBackground, applyBackgroundToScreen };
