# IPv6 Converter

IPv6アドレスを16進数表記からビット表記に変換するChrome拡張機能です。

このプロジェクトは[Plasmo extension](https://docs.plasmo.com/)フレームワークを使用して開発されています。

## 機能

- **自動変換**: ウェブページ上のIPv6アドレスを自動検出してビット表記を表示
- **手動変換**: ポップアップUIでIPv6アドレスを手動入力して変換
- **リアルタイム監視**: 動的に追加されるコンテンツも自動で処理
- **多様な形式対応**: 完全形式、短縮形式（::）、ループバックアドレスなど

## 開発環境のセットアップ

### 必要な環境

- Node.js 24.3.0 (Voltaで管理)
- npm 11.4.2

### インストール

```bash
# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザを開き、適切な開発ビルドを読み込んでください。
Chromeブラウザ（Manifest V3）の場合: `build/chrome-mv3-dev`

### 拡張機能の読み込み方法

1. Chrome の拡張機能管理ページ（`chrome://extensions/`）を開く
2. 「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `build/chrome-mv3-dev` フォルダを選択

## 開発

- `src/popup.tsx`: ポップアップUIの編集
- `src/contents/plasmo.ts`: コンテンツスクリプトの編集  
- `src/utils/ipv6-converter.ts`: 変換ロジックの編集

変更は自動的に反映されます。コンテンツスクリプトを変更した場合は、ブラウザで拡張機能をリロードしてください。

## テスト

```bash
# テストを実行
npm test

# テストUIを起動
npm run test:ui
```

## コード品質管理

```bash
# リンターでチェック
npm run lint

# リンターで自動修正
npm run lint:fix

# フォーマッター
npm run format
```

## プロダクションビルド

```bash
npm run build
```

このコマンドで拡張機能のプロダクションバンドルが作成され、ストアに公開する準備が整います。

## ファイル構造

```
src/
├── contents/
│   └── plasmo.ts          # コンテンツスクリプト
├── utils/
│   ├── ipv6-converter.ts  # IPv6変換ユーティリティ
│   └── ipv6-converter.test.ts  # テスト
├── test/
│   └── setup.ts           # テストセットアップ
└── popup.tsx              # ポップアップUI
```

## 対応するIPv6形式

- 完全形式: `2001:db8:85a3:0:0:8a2e:370:7334`
- 短縮形式: `2001:db8::1`
- ループバック: `::1`
- 全ゼロ: `::`

## ライセンス

MIT

## 詳細なドキュメント

詳細な実装ドキュメントは [docs/dev/01-DOC-extension-base.md](docs/dev/01-DOC-extension-base.md) を参照してください。
