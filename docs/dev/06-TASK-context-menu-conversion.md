# 06-TASK-context-menu-conversion

コンテキストメニューから選択範囲のIPアドレスを変換する機能の実装タスクリスト。

## 実装準備

- [x] package.jsonにcontextMenus権限を追加
- [x] background.tsファイルの作成（ルートディレクトリ）

## Background Service Workerの実装

- [x] chrome.runtime.onInstalledリスナーでコンテキストメニューを作成
  - [x] ID: "convertIP"
  - [x] タイトル: "Convert IP Address"（英語UI）
  - [x] contexts: ["selection"]

- [x] chrome.contextMenus.onClickedリスナーの実装
  - [x] content scriptへメッセージ送信（選択テキストを含む）

## Content Scriptの拡張

- [x] 既存のcreateTooltip関数を共通化
  - [x] 引数を(ipInfo: IPInfo)に統一
  - [x] 既存のprocessTextNode内での使用箇所を更新

- [x] メッセージリスナーに"convertSelection"アクションを追加
  - [x] 選択テキストからIPアドレスを抽出（ip-regexパッケージ使用）
  - [x] 最初に見つかったIPアドレスのみを処理
  - [x] 既存のdetectAndConvertIP関数を活用してIPInfo取得
  - [x] 選択範囲の位置を取得（window.getSelection()使用）
  - [x] 既存のcreateTooltip関数でツールチップ生成
  - [x] 選択位置に合わせて表示位置を調整

- [x] ツールチップの表示制御を共通化
  - [x] showTooltipAtSelection関数の作成
  - [x] 既存のホバー表示と右クリック表示の両方で使用

## 表示制御の改善

- [x] ツールチップの自動削除機能
  - [x] 10秒後に自動削除（右クリックメニューから表示の場合）
  - [x] クリックで即座に削除
  - [x] 既存のホバー制御と共存

- [x] エラーハンドリング
  - [x] IPアドレスが見つからない場合は何も表示しない
  - [x] 選択範囲が取得できない場合の処理

## テスト

- [ ] 既存のツールチップ生成テストの更新
- [ ] 新しいメッセージハンドリングのテスト
- [ ] 統合テスト
  - [ ] 通常のホバー表示が引き続き動作することを確認
  - [ ] コンテキストメニューからの表示が正しく動作することを確認

## ドキュメント更新

- [x] 06-DOC-context-menu-conversion.mdの作成
- [ ] README.mdへの機能追加の記載