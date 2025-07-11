# 02-DOC-styling

## 概要

当初TailwindCSS v4を導入しましたが、シンプルな構成を維持するためプレーンCSSに移行しました。直接テキスト挿入方式からホバー表示方式に変更し、ビット表記の視認性を大幅に向上させました。さらに、共通コンポーネント化によりコードの保守性を改善しました。

## 実装された機能

### 1. スタイリングシステムの変遷

#### 技術選択の変更
- **初期**: TailwindCSS v4を採用
- **最終**: プレーンCSSに移行（シンプル性重視）
- **理由**: 小規模プロジェクトのため、依存関係を削減してメンテナビリティを向上

#### 現在の構成
- `src/style.css`: プレーンCSSによる統一されたスタイリング
- セマンティックなCSSクラス名（例：`.popup-container`, `.bits-display`）
- モジュール化されたコンポーネント別スタイル

### 2. ホバー表示機能

#### UX改善
- **非侵襲的**: 元のテキストを変更せず、ホバー時にのみ情報を表示
- **視覚的フィードバック**: IPv6アドレスに点線アンダーラインとカーソル変更
- **統一デザイン**: ツールチップとポップアップで一貫したデザイン

#### 実装詳細
```typescript
// ツールチップの位置計算
const rect = ipv6Span.getBoundingClientRect();
tooltip.style.position = "fixed";
tooltip.style.left = `${rect.left}px`;
tooltip.style.top = `${rect.bottom + 5}px`;
```

### 3. 2行表示システム

#### 表示形式
- **128ビット分割**: 64ビットずつ2行に分割表示
- **行番号**: 64、128で各行を識別
- **8ビットごとのスペース**: 視認性を向上
- **色分け**: 0（青色）と1（赤色）で明確に区別

#### 実装
```typescript
// 共通ユーティリティ関数による2行分割
export function formatBitsToLines(bits: string): BitDisplayLine[] {
    const segments = bits.split(":");
    const binaryString = segments.join("");
    
    const lines: BitDisplayLine[] = [];
    for (let i = 0; i < 2; i++) {
        const start = i * 64;
        const end = start + 64;
        lines.push({
            lineNumber: (i + 1) * 64,
            bits: binaryString.slice(start, end),
        });
    }
    return lines;
}
```

### 4. ビット表記の色分け

#### 色設計
- **0**: 青色 (`#2563eb`) - 視覚的に"オフ"を表現
- **1**: 赤色 (`#dc2626`) - 視覚的に"オン"を表現

#### カスタムCSSクラス
```css
.ipv6-bit-zero {
    color: #2563eb;
    font-family: monospace;
}

.ipv6-bit-one {
    color: #dc2626;
    font-family: monospace;
}
```

### 5. 手動再スキャン機能

#### MutationObserverからの移行
- **旧方式**: 自動監視によるパフォーマンス負荷
- **新方式**: ユーザー主導の手動再スキャン
- **利点**: CPU使用量削減、ユーザーコントロール向上

#### 実装
```typescript
// Chrome拡張機能のメッセージングシステム
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "rescan") {
        clearProcessedMarkers();
        processNode(document.body);
        sendResponse({ success: true });
    }
    return true;
});
```

### 6. 共通コンポーネント化

#### リファクタリング成果
- **重複コード削減**: 約75行の重複コードを削除
- **保守性向上**: 一箇所の変更で両方に反映
- **テストカバレッジ**: 15→23テストケースに拡張

#### 新しいアーキテクチャ
```typescript
// 共通ユーティリティ
src/utils/bit-formatting.ts     // ビット処理ロジック
src/utils/tooltip-generator.ts  // ツールチップHTML生成

// 共通コンポーネント
src/components/BitDisplay.tsx   // React表示コンポーネント
```

## アーキテクチャの改善

### コード構造
- **関心の分離**: ツールチップ作成、色分け、イベント処理を独立した関数に分離
- **再利用性**: 色分けロジックをコンテンツスクリプトとポップアップで共有
- **型安全性**: TypeScriptによる厳密な型チェック

### パフォーマンス最適化
- **重複処理防止**: `data-ipv6-processed`属性による処理済み要素の管理
- **効率的なDOM操作**: 必要最小限のDOM変更
- **メモリリーク防止**: 適切なイベントリスナー管理

## 設計方針

### ユーザビリティ
- **非破壊的**: 既存のコンテンツを変更しない
- **オンデマンド**: 必要時にのみ情報を表示
- **直感的**: 視覚的に分かりやすい色分け

### メンテナビリティ
- **モジュール化**: 機能ごとに分離された関数
- **一貫性**: TailwindCSSによる統一されたスタイリング
- **拡張性**: 新しい機能を追加しやすい構造

## 技術仕様

### 現在の依存関係
```json
{
  "react": "^18.3.1",
  "@types/react": "^18.3.12",
  "plasmo": "0.90.5",
  "vitest": "^3.2.4",
  "@biomejs/biome": "1.9.4"
}
```

### ブラウザ対応
- Chrome Manifest V3
- モダンCSS機能（CSS Custom Properties、Flexbox、Grid）
- ES2020+ JavaScript機能

### 実装ファイル
```
src/
├── components/
│   └── BitDisplay.tsx        # 共通ビット表示コンポーネント
├── contents/plasmo.ts        # ホバー機能、DOM操作
├── popup.tsx                 # ポップアップUI
├── style.css                 # プレーンCSS、統一スタイル
└── utils/
    ├── ipv6-converter.ts     # IPv6変換ロジック
    ├── bit-formatting.ts     # ビット表示共通ロジック
    └── tooltip-generator.ts  # ツールチップHTML生成
```

## 今後の改善案

### 機能拡張
1. **アニメーション**: ホバー時のフェードイン/アウト効果
2. **設定**: 色のカスタマイズ機能
3. **アクセシビリティ**: スクリーンリーダー対応、ARIA属性の追加
4. **キーボードナビゲーション**: Tabキーでの操作サポート

### パフォーマンス
1. **仮想化**: 大量のIPv6アドレスがある場合の最適化
2. **Web Workers**: 重い処理の非同期化
3. **キャッシュ**: 変換結果のメモ化
4. **レンダリング最適化**: React.memoの活用

### 開発体験
1. **Storybook**: コンポーネントの独立開発・テスト
2. **E2Eテスト**: Playwright/Cypressによる統合テスト
3. **視覚回帰テスト**: UIの一貫性確保
4. **型安全性**: より厳密なTypeScript型定義

## 設計の利点と制約

### 利点
- **軽量**: 外部CSS依存なしの軽量実装
- **保守性**: 共通コンポーネントによる一元管理
- **拡張性**: モジュール化されたアーキテクチャ
- **テスト性**: 小さな関数単位でのテスト

### 制約・注意事項
- ホバー表示は主にデスクトップ環境を想定（モバイルでの代替手段が必要）
- 色分けは色覚特性を考慮した配色の検討が必要
- 手動再スキャンはユーザーの操作が必要