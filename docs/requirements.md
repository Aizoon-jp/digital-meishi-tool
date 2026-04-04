# デジタル名刺ツール 要件定義書

## 1. プロジェクト概要

### 成果目標
Zoom上でQRコードを相手に読み取ってもらい、スマホブラウザで名刺画像とHPリンクがアニメーション付きで表示されるデジタル名刺ページを公開する。

### 成功指標

**定量的指標**:
- 名刺画像のファイルサイズ: 500KB以下
- QRコード解像度: 1000×1000px以上
- iPhone Safariでの表示崩れ: ゼロ

**定性的指標**:
- 名刺アニメーション（降りてくる→シャイン→リンク浮き上がり）が滑らかに動作
- Zoom背景にQRを重ねても読み取り可能
- HP（aizoon.jp）とのデザイン統一感を維持

---

## 2. システム全体像

### アーキテクチャ
静的サイト（HTML + CSS + vanilla JS）をGitHub Pagesで配信する。バックエンド・データベース・認証は不要。

### ファイル構成
```
project/
├── index.html           # メインページ（名刺表示 + HPリンク）
├── assets/
│   └── card.jpg         # 名刺画像（最適化済み）
├── qr_aizoon.png        # QRコード画像（Zoom背景用）
└── docs/
    ├── requirements.md
    └── SCOPE_PROGRESS.md
```

### ロール・認証
なし（公開ページ、認証不要）

---

## 3. ページ詳細仕様

### P-001: index.html（デジタル名刺ページ）

**目的**: 名刺画像とHPリンクをアニメーション付きで表示する

**デザイン仕様（変更不可）**:
| 項目 | 値 |
|------|-----|
| 背景色 | ネイビー `#1a1f2e` |
| アクセントカラー | テラコッタ `#c5795a` |
| フォント | Cormorant Garamond + Noto Serif JP（Google Fonts） |

**アニメーション仕様（変更不可）**:
1. 名刺画像が上からスーッと降りてくる
2. シャインエフェクト（光の反射が走る）
3. HPリンクが下から浮き上がる

**改善してよい点**:
- モバイル表示の最適化（iPhone Safari対応必須）
- `<meta>` タグの整備（OGP設定、description等）
- パフォーマンス改善（`loading="lazy"` 等）

**表示情報**:
| 項目 | 内容 |
|------|------|
| サイト名 | Aizoon Systems |
| 担当者名 | 藍澤 和博（Aizawa Kazuhiro） |
| 肩書き | CEO / AIエージェンティックエンジニア |
| HPリンク | https://aizoon.jp |
| メール | info@aizoon.jp |
| 住所 | 千葉県市川市欠真間1-11-25 |

**OGP設定**:
- og:title: Aizoon Systems - 藍澤 和博
- og:description: 次世代AIの開発力で、あなたの理想を形に
- og:image: 名刺画像
- og:url: GitHub Pages公開URL

---

## 4. データ設計概要

なし（静的サイトのためデータベース不使用）

---

## 5. セキュリティ要件

- HTTPS強制（GitHub Pagesはデフォルトで対応）
- 入力フォームなし（XSS/CSRF対策不要）
- 外部スクリプトはGoogle Fontsのみ（信頼済みCDN）

---

## 6. 技術スタック

```yaml
フロントエンド: HTML5 + CSS3 + vanilla JavaScript
フォント: Google Fonts（Cormorant Garamond, Noto Serif JP）
ホスティング: GitHub Pages（mainブランチ / root配信）
画像最適化: Python Pillow（スクリーンショットからのトリミング + 圧縮）
QRコード生成: Python qrcode ライブラリ
```

---

## 7. 外部サービス一覧

| サービス | 用途 | 料金 |
|---------|------|------|
| Google Fonts | Webフォント配信 | 無料 |
| GitHub Pages | 静的サイトホスティング | 無料 |

---

## 8. 画像素材

### 名刺画像
- ソース: Canva画面のスクリーンショット（2094×2160px）
- パス: `/mnt/c/Users/User/OneDrive/画像/Screenshots/スクリーンショット (41).png`
- 処理: 下半分の名刺部分をトリミング → JPEG最適化 → 500KB以下に圧縮
- 出力: `assets/card.jpg`

### 既存デザイン参照
- `card_standalone.html`（Base64埋め込み版、デザインの参考元）
- 指示書パス: `/mnt/c/Users/User/Downloads/INSTRUCTIONS.md`

### QRコード
- サイズ: 1000×1000px以上
- 形式: PNG
- 余白（クワイエットゾーン）: 十分に確保
- ファイル名: `qr_aizoon.png`
- 内容: GitHub Pages公開URL（デプロイ後に確定）

---

## 9. デプロイ要件

- GitHubリポジトリ作成（リポジトリ名: `digital-card`）
- GitHub Pages有効化（`main` ブランチ / `/ (root)` から配信）
- 公開URL: `https://<GitHubユーザー名>.github.io/digital-card/`
- GitHubアカウント名はデプロイフェーズで確認
