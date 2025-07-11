import type { PlasmoCSConfig } from "plasmo";
import { IPV6_PATTERN, ipv6ToBits } from "../utils/ipv6-converter";
import { generateTooltipHTML } from "../utils/tooltip-generator";
import "../style.css";

export const config: PlasmoCSConfig = {
	matches: ["https://*/*", "http://*/*"],
};

// ツールチップを作成する関数
function createTooltip(_ipv6: string, bitsNotation: string): HTMLElement {
	const tooltip = document.createElement("div");
	tooltip.className = "ipv6-tooltip";
	tooltip.style.display = "none";
	tooltip.innerHTML = `
		<div>IPv6 Binary:</div>
		<div class="font-mono">${generateTooltipHTML(bitsNotation)}</div>
	`;
	return tooltip;
}

// テキストノードからIPv6アドレスを検出してホバー機能を追加する関数
function processTextNode(textNode: Text): void {
	const text = textNode.textContent;
	if (!text) return;

	const matches = Array.from(text.matchAll(new RegExp(IPV6_PATTERN.source, "g")));
	if (matches.length === 0) return;

	const parent = textNode.parentElement;
	if (!parent) return;

	// 既に処理済みかチェック
	if (parent.hasAttribute("data-ipv6-processed")) return;

	let currentText = text;
	let offset = 0;

	matches.forEach((match) => {
		const ipv6Address = match[0];
		const startIndex = (match.index ?? 0) + offset;
		const endIndex = startIndex + ipv6Address.length;

		// IPv6アドレスの前のテキスト
		if (startIndex > 0) {
			const beforeText = document.createTextNode(currentText.substring(0, startIndex));
			parent.insertBefore(beforeText, textNode);
		}

		// IPv6アドレス部分をspanで囲む
		const ipv6Span = document.createElement("span");
		ipv6Span.textContent = ipv6Address;
		ipv6Span.style.position = "relative";
		ipv6Span.style.cursor = "help";
		ipv6Span.style.textDecoration = "underline";
		ipv6Span.style.textDecorationStyle = "dotted";
		ipv6Span.setAttribute("data-ipv6", ipv6Address);

		// ツールチップを作成
		const bitsNotation = ipv6ToBits(ipv6Address);
		const tooltip = createTooltip(ipv6Address, bitsNotation);
		ipv6Span.appendChild(tooltip);

		// ホバーイベントを追加
		ipv6Span.addEventListener("mouseenter", (_e) => {
			const rect = ipv6Span.getBoundingClientRect();
			tooltip.style.display = "block";
			tooltip.style.position = "fixed";
			tooltip.style.left = `${rect.left}px`;
			tooltip.style.top = `${rect.bottom + 5}px`;
			tooltip.style.zIndex = "10000";
		});

		ipv6Span.addEventListener("mouseleave", () => {
			tooltip.style.display = "none";
		});

		parent.insertBefore(ipv6Span, textNode);
		currentText = currentText.substring(endIndex);
		offset = 0;
	});

	// 残りのテキスト
	if (currentText.length > 0) {
		const remainingText = document.createTextNode(currentText);
		parent.insertBefore(remainingText, textNode);
	}

	// 元のテキストノードを削除
	parent.removeChild(textNode);
	parent.setAttribute("data-ipv6-processed", "true");
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

// 処理済みの要素をクリアする関数
function clearProcessedMarkers(): void {
	const processedElements = document.querySelectorAll("[data-ipv6-processed]");
	processedElements.forEach((element) => {
		element.removeAttribute("data-ipv6-processed");
	});

	// ツールチップも削除
	const tooltips = document.querySelectorAll(".ipv6-tooltip");
	tooltips.forEach((tooltip) => {
		tooltip.remove();
	});
}

// 初期化
function initializeIPv6Converter(): void {
	// 既存のコンテンツを処理
	processNode(document.body);
}

// メッセージリスナー - 手動トリガー用
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (request.action === "rescan") {
		// 既存の処理をクリア
		clearProcessedMarkers();
		// 再スキャン実行
		processNode(document.body);
		sendResponse({ success: true });
	}
	return true;
});

// ページ読み込み後に実行
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeIPv6Converter);
} else {
	initializeIPv6Converter();
}
