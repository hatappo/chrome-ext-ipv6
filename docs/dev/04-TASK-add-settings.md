# 04-TASK-add-settings

## タスクリスト

- [x] featureブランチを作成して切り替える
  - ブランチ名: `feature/add-settings`
- [x] 既存のUIを英語に変更
  - popup.tsx の全テキストを英語化
  - エラーメッセージ、ボタンテキスト、説明文を更新
  - "rescan" → "scan" への統一的な変更
- [x] バイナリ表示を2行から4行に変更
  - bit-formatting.ts の `formatBitsToLines` 関数を32ビット×4行に変更
  - BitDisplay.tsx のコメントと計算ロジックを更新
  - テストケースを4行表示に合わせて更新
- [x] ツールチップにCopyボタンを追加
  - BitDisplay.tsx にCopyボタン機能を実装
  - popup画面とツールチップの両方で表示
  - クリップボードAPIを使用してバイナリ文字列をコピー
  - 成功フィードバック表示（2秒間）
- [x] background.tsとnewtab.tsxの不要ファイルを削除
  - background.ts: 空のファイルで不要
  - newtab.tsx: デフォルトのPlasmoテンプレートで不要
- [x] 設定画面を追加（自動スキャンオンオフ）
  - @plasmohq/storage パッケージを導入
  - options.tsx を設定画面として実装
  - useStorageフックでautoScan設定を管理（デフォルト: false）
  - plasmo.ts で設定を読み取り、自動スキャンを制御
- [x] UI/UXの改善
  - "Convert/Converter" → "Hex to Binary Converter" への明確化
  - ツールチップのホバー動作改善（200ms遅延、隙間短縮）
  - Copyボタンのレイアウト修正（絶対配置で折り返し防止）
- [x] リンターエラーを修正
  - biome check --write で自動修正
- [x] テストの更新と実行
  - 4行表示に合わせてテストケースを更新
  - 全31テストが成功

## 実施内容

### 1. UI国際化とテキスト改善
- 全ての日本語テキストを英語に変更
- "rescan" → "scan" への統一（デフォルトで自動スキャンオフのため）
- "IPv6 Converter" → "IPv6 Hex to Binary Converter" への明確化

### 2. バイナリ表示の改善
- 2行表示（64ビット×2）から4行表示（32ビット×4）に変更
- 各行に行番号表示（32, 64, 96, 128）
- 可読性とコンパクト性のバランス改善

### 3. Copyボタンの実装
- **popup画面**: React componentとして実装
- **ツールチップ**: vanilla JSで動的生成
- navigator.clipboard API使用
- "Copy" → "Copied!" の一時フィードバック

### 4. ツールチップUXの改善
- ホバー時の隙間を5px→2pxに短縮
- mouseleaveに200msの遅延を追加
- ツールチップ自体にもホバーイベントを追加
- Copyボタンへの安全なアクセスを実現

### 5. 設定機能の実装
- Plasmoの`useStorage`フックで設定管理
- トグルスイッチによる直感的なUI
- 設定変更は即座に反映（リアクティブ）
- コンテンツスクリプトでの設定読み取り対応

### 6. レイアウトとスタイル改善
- Copyボタンを絶対配置に変更（折り返し防止）
- box-shadowとtransitionでインタラクティブ性向上
- グラデーション背景で統一感のあるデザイン