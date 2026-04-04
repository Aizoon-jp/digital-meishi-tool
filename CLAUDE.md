# デジタル名刺ツール

## 基本原則
> 「シンプルさは究極の洗練である」

- **最小性**: 不要なコードは一文字も残さない。必要最小限を超えない
- **単一性**: 真実の源は常に一つ（要件: requirements.md、進捗: SCOPE_PROGRESS.md）
- **刹那性**: 役目を終えたコード・ドキュメントは即座に削除する
- **実証性**: 推測しない。ログ・DB・APIレスポンスで事実を確認する
- **潔癖性**: エラーは隠さない。フォールバックで問題を隠蔽しない

## プロジェクト設定

技術スタック:
  frontend: HTML5 + CSS3 + vanilla JavaScript
  fonts: Google Fonts (Cormorant Garamond, Noto Serif JP)
  hosting: GitHub Pages (main / root)

ポート設定:
  frontend: 3837（ローカルプレビュー用）

## テスト認証情報

不要（認証機能なし）

## 環境変数

不要（静的サイト、外部API呼び出しなし）

## 命名規則

- ファイル名: kebab-case（例: index.html, card.jpg）
- CSS: BEMまたはシンプルなクラス名
- JS: camelCase

## コード品質

- 関数: 100行以下 / ファイル: 700行以下 / 複雑度: 10以下 / 行長: 120文字

## デザイン仕様（変更不可）

- 背景色: ネイビー `#1a1f2e`
- アクセントカラー: テラコッタ `#c5795a`
- フォント: Cormorant Garamond + Noto Serif JP
- アニメーション: 名刺が上から降りてくる → シャイン → リンク浮き上がり

## 画像素材

- 名刺スクリーンショット: `/mnt/c/Users/User/OneDrive/画像/Screenshots/スクリーンショット (41).png`
  - 2094x2160px、下半分が名刺画像 → トリミング+JPEG最適化で500KB以下に
- 既存デザイン参照: `card_standalone.html`（Base64埋め込み版）
- 実装指示書: `/mnt/c/Users/User/Downloads/INSTRUCTIONS.md`

## 開発ルール

### サーバー起動
- ローカルプレビューは `python3 -m http.server 3837` を使用
- サーバーは1つのみ維持。重複起動禁止

### エラー対応
- 同じエラー3回 → Web検索で最新情報を収集

### デプロイ
- デプロイはユーザーの明示的な承認を得てから実行する
- デプロイ先: GitHub Pages
- リポジトリ名: digital-card
- GitHubアカウント名はデプロイフェーズで確認

### ドキュメント管理
許可されたドキュメントのみ作成可能:
- docs/SCOPE_PROGRESS.md（実装計画・進捗）
- docs/requirements.md（要件定義）
上記以外のドキュメント作成はユーザー許諾が必要。

## Playwright

スクリーンショット保存先: /tmp/bluelamp-screenshots/
