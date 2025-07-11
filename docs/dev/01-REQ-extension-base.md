
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

- Overview: https://deepwiki.com/PlasmoHQ/plasmo
- Project Structure: https://deepwiki.com/PlasmoHQ/plasmo/2.1-project-structure
- Extension Lifecycle: https://deepwiki.com/PlasmoHQ/plasmo/2.2-extension-lifecycle 
- Plasmo CLI: https://deepwiki.com/PlasmoHQ/plasmo/3.1-plasmo-cli
- Project Initialization: https://deepwiki.com/PlasmoHQ/plasmo/3.2-project-initialization
- Development Mode: https://deepwiki.com/PlasmoHQ/plasmo/4.1-development-mode
