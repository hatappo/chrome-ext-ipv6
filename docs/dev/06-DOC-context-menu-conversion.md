# 06-DOC-context-menu-conversion

コンテキストメニューから選択範囲のIPアドレスを変換する機能の実装ドキュメント。

## 概要

ユーザーがテキストを選択して右クリックした際に、コンテキストメニューから「Convert IP Address」を選択することで、選択範囲内の最初のIPアドレスをバイナリ表記に変換して表示する機能を実装しました。

## 実装詳細

### 1. Background Service Worker

`background.ts`を作成し、以下の機能を実装：

- Chrome拡張機能のインストール時にコンテキストメニューを登録
- 選択されたテキストをcontent scriptに送信

```typescript
chrome.contextMenus.create({
    id: "convertIP",
    title: "Convert IP Address",
    contexts: ["selection"]
});
```

### 2. 共通化されたツールチップシステム

既存の`createTooltip`関数を共通化し、`IPInfo`インターフェースを使用するように変更：

```typescript
interface IPInfo {
    address: string;
    type: AddressType;
    binary: string;
}

function createTooltip(ipInfo: IPInfo): HTMLElement
```

これにより、ホバー表示とコンテキストメニューからの表示で同じツールチップ生成ロジックを使用できます。

### 3. 選択範囲での表示制御

`showTooltipAtSelection`関数を実装し、以下の機能を提供：

- 選択範囲の位置を取得（`window.getSelection()`）
- 選択位置の下にツールチップを表示
- 10秒後の自動削除
- クリックによる手動削除
- 既存のコンテキストメニュー由来のツールチップを自動的に置き換え

### 4. メッセージハンドリング

content scriptに新しいメッセージハンドラを追加：

```typescript
if (request.action === "convertSelection") {
    // IPアドレスの検出と変換
    // 最初に見つかったIPアドレスのみを処理
}
```

## 特徴

1. **既存機能との統合**: 
   - 既存のツールチップ生成・表示ロジックを再利用
   - ホバー表示機能と共存

2. **ユーザビリティ**:
   - 選択位置に直接表示
   - 10秒後に自動的に削除
   - クリックで即座に削除可能
   - コピーボタンも利用可能

3. **エラーハンドリング**:
   - IPアドレスが見つからない場合は何も表示しない
   - 無効なIPアドレスの場合も適切に処理

## 使用方法

1. Webページ上でIPアドレスを含むテキストを選択
2. 右クリックしてコンテキストメニューを開く
3. 「Convert IP Address」を選択
4. 選択位置の下にバイナリ表記のツールチップが表示される
5. コピーボタンでバイナリ表記をクリップボードにコピー可能

## 技術的な考慮事項

- PlasmoのBackground Service Worker仕様に準拠
- 既存のコードベースとの一貫性を保持
- パフォーマンスへの影響を最小限に抑制