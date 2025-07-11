
## 要件

- Chrome Extension を作成します。
- この Extension は、画面上の ipv6 の 16進数表記を特定し bit 表記に変換します。

## フレームワーク

- フレームワークとして [Plasmo](https://github.com/PlasmoHQ/plasmo) を使います。

## Plasmo について

### Plasmoの基本ルール

- 設定より規約: `manifest.json`は自動生成されるため、直接編集しません。
- ファイルベースルーティング: 機能はファイルの命名規則によって決まります。例えば、`popup.tsx`はポップアップ画面、`content.ts`はコンテンツスクリプト、`background.ts`はバックグラウンドスクリプトになります。
- ストレージ: データの保存には、`chrome.storage`を直接使わず、Plasmoが提供する`@plasmohq/storage/hook`の`useStorage`フックを優先して使用します。

### 参考ドキュメント

- コアコンセプト: https://docs.plasmo.com/concepts
- ファイル階層: https://docs.plasmo.com/framework/file-hierarchy
- コンテンツスクリプト: https://docs.plasmo.com/framework/content-scripts
