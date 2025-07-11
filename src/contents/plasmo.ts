import type { PlasmoCSConfig } from "plasmo";
import { IPV6_PATTERN, ipv6ToBits } from "../utils/ipv6-converter";

export const config: PlasmoCSConfig = {
	matches: ["https://*/*", "http://*/*"],
};

// テキストノードからIPv6アドレスを検出して変換する関数
function processTextNode(textNode: Text): void {
	const text = textNode.textContent;
	if (!text) return;

	const matches = text.match(IPV6_PATTERN);
	if (!matches) return;

	let newText = text;
	matches.forEach((match) => {
		const bitsNotation = ipv6ToBits(match);
		newText = newText.replace(match, `${match} (${bitsNotation})`);
	});

	if (newText !== text) {
		textNode.textContent = newText;
	}
}

// DOMツリーを再帰的に処理する関数
function processNode(node: Node): void {
	if (node.nodeType === Node.TEXT_NODE) {
		processTextNode(node as Text);
	} else if (node.nodeType === Node.ELEMENT_NODE) {
		// スクリプトタグやスタイルタグは処理しない
		const element = node as Element;
		if (element.tagName === "SCRIPT" || element.tagName === "STYLE") {
			return;
		}

		// 子ノードを処理
		for (const child of Array.from(node.childNodes)) {
			processNode(child);
		}
	}
}

// 初期化
function initializeIPv6Converter(): void {
	// 既存のコンテンツを処理
	processNode(document.body);

	// 新しく追加されるコンテンツを監視
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				processNode(node);
			});
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

// ページ読み込み後に実行
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeIPv6Converter);
} else {
	initializeIPv6Converter();
}
