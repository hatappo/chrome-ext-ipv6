# 04-DOC-add-settings

## 概要

Chrome拡張機能の包括的なUI/UX改善と設定機能の実装を行いました。ユーザビリティ、国際化対応、カスタマイズ性を大幅に向上させるアップデートです。

## 主な変更点

### 1. UI国際化とテキスト改善

**言語の統一:**
- 全UI要素を日本語から英語に変更
- エラーメッセージ、ボタン、説明文を含む完全な国際化

**用語の明確化:**
- "IPv6 → Binary Converter" → "IPv6 Hex to Binary Converter"
- "Rescan Page" → "Scan Page"（自動スキャンがデフォルトオフのため）
- 変換内容（16進数→2進数）を明確に表現

**変更例:**
```typescript
// Before
setError("IPv6アドレスを入力してください");

// After  
setError("Please enter an IPv6 address");
```

### 2. バイナリ表示の改善

**レイアウト変更:**
- 2行表示（64ビット×2）→ 4行表示（32ビット×4）
- 行番号表示：32, 64, 96, 128
- 視認性と情報密度のバランス最適化

**実装詳細:**
```typescript
// formatBitsToLines関数の変更
for (let i = 0; i < 4; i++) {  // 2 → 4
    const start = i * 32;      // 64 → 32
    const end = start + 32;
    lines.push({
        lineNumber: (i + 1) * 32,
        bits: binaryString.slice(start, end),
    });
}
```

### 3. Copyボタンの実装

**実装方式:**
- **popup画面**: React componentとして実装
- **ツールチップ**: vanilla JSで動的生成

**機能詳細:**
- navigator.clipboard APIによるコピー機能
- "Copy" → "Copied!" の2秒間フィードバック
- 絶対配置による折り返し防止

**popup画面での実装:**
```typescript
// React component内
const [copySuccess, setCopySuccess] = useState(false);
const handleCopy = async () => {
    const binaryString = bits.split(":").join("");
    await navigator.clipboard.writeText(binaryString);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
};
```

**ツールチップでの実装:**
```typescript
// vanilla JSで動的生成
copyButton.addEventListener("click", async () => {
    const binaryString = bitsNotation.split(":").join("");
    await navigator.clipboard.writeText(binaryString);
    copyButton.textContent = "Copied!";
    setTimeout(() => {
        copyButton.textContent = "Copy";
    }, 2000);
});
```

### 4. 設定機能の実装

**Plasmoストレージシステム:**
- `@plasmohq/storage`パッケージによる設定管理
- React Hook（`useStorage`）でリアクティブな状態管理
- vanilla JS（`new Storage()`）でも使用可能

**設定画面の実装:**
```typescript
// React Hookによる設定管理
const [autoScan, setAutoScan] = useStorage("autoScan", false);

// トグルスイッチで直感的な操作
<input 
    type="checkbox" 
    checked={autoScan} 
    onChange={(e) => handleAutoScanChange(e.target.checked)} 
/>
```

**コンテンツスクリプトでの設定読み取り:**
```typescript
const storage = new Storage();
const autoScan = await storage.get("autoScan");
if (autoScan === true || autoScan === "true") {
    processNode(document.body);
}
```

## UI/UXの改善詳細

### 1. ツールチップのホバー動作改善

**問題と解決:**
- **問題**: IPv6要素とツールチップ間の隙間でツールチップが消える
- **解決**: 
  - 隙間を5px→2pxに短縮
  - mouseleaveに200ms遅延を追加
  - ツールチップ自体にもマウスイベントを追加

**実装コード:**
```typescript
// タイマーによる遅延処理
let hideTimeout: NodeJS.Timeout;

const hideTooltip = () => {
    hideTimeout = setTimeout(() => {
        tooltip.style.display = "none";
    }, 200);
};

// ツールチップ上でのホバー時はタイマーをクリア
tooltip.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
});
```

### 2. Copyボタンのレイアウト改善

**問題と解決:**
- **問題**: Copyボタンがバイナリ文字列と重なり折り返し発生
- **解決**: 絶対配置でボタンを右上に固定

**CSS実装:**
```css
.copy-button-container {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
}

.bits-display {
    position: relative; /* 子要素の絶対配置のため */
}
```

### 3. 設定画面のトグルスイッチ

**実装詳細:**
```css
/* カスタムトグルスイッチ */
.toggle-slider {
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;
}

input:checked + .toggle-slider:before {
    transform: translateX(24px);
}
```

## 技術的な実装選択

### 1. React vs Vanilla JS の使い分け

**React使用箇所:**
- popup.tsx - 状態管理が複雑
- options.tsx - useStorageフックの活用
- BitDisplay.tsx - 再利用可能コンポーネント

**Vanilla JS使用箇所:**
- contents/plasmo.ts - DOM操作中心
- ツールチップのCopyボタン - 動的生成

### 2. Plasmoストレージの利点

**Chrome Storage API との比較:**
```typescript
// Chrome Storage API (従来)
chrome.storage.sync.get(["settings"], (result) => {
    // コールバック地獄の可能性
});

// Plasmo Storage (新)
const [autoScan, setAutoScan] = useStorage("autoScan", false);
// シンプルでリアクティブ
```

## パフォーマンスとセキュリティ

### 1. バンドルサイズ

**最適化:**
- 不要ファイルの削除（background.ts, newtab.tsx）
- 必要最小限の依存関係

### 2. セキュリティ考慮事項

**clipboard API:**
- HTTPS環境でのみ動作
- ユーザーアクション（クリック）が必要
- 適切なエラーハンドリング

## 今後の改善提案

### 1. 機能拡張
- ビット表示のカスタマイズ（2/4/8行切り替え）
- 複数のIPv6フォーマット対応
- 変換履歴機能

### 2. アクセシビリティ
- ARIAラベルの追加
- キーボードショートカット
- ハイコントラストモード対応

### 3. 国際化
- 多言語対応（i18n）
- 地域別の表示形式
- RTL言語サポート