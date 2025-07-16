import { Storage } from "@plasmohq/storage";
import ipRegex from "ip-regex";
import type { PlasmoCSConfig } from "plasmo";
import type { IPInfo } from "../utils/ip-address-common";
import { detectAddressType, detectAndConvertIP } from "../utils/ip-address-common";
import { generateTooltipHTML } from "../utils/tooltip-generator";
import "../style.css";

export const config: PlasmoCSConfig = {
	matches: ["https://*/*", "http://*/*"],
};

const storage = new Storage();

// ビット文字列から実際にコピーする文字列を取得
function getBinaryStringForCopy(bitsNotation: string, addressType: "ipv4" | "ipv6"): string {
	const segments = bitsNotation.split(":");
	return addressType === "ipv4"
		? segments
				.slice(0, 2)
				.join("") // IPv4: 最初の32ビット
		: segments.join(""); // IPv6: 全128ビット
}

// Copyボタンを作成
function createCopyButton(bitsNotation: string, addressType: "ipv4" | "ipv6"): HTMLButtonElement {
	const button = document.createElement("button");
	button.textContent = "Copy";
	button.className = "copy-button";
	button.title = "Copy binary string";
	button.style.cssText = "position: absolute; top: 8px; right: 8px; z-index: 11;";

	button.addEventListener("click", async () => {
		try {
			const binaryString = getBinaryStringForCopy(bitsNotation, addressType);
			await navigator.clipboard.writeText(binaryString);
			button.textContent = "Copied!";
			setTimeout(() => {
				button.textContent = "Copy";
			}, 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	});

	return button;
}

// ツールチップを作成する関数
function createTooltip(ipInfo: IPInfo): HTMLElement {
	const tooltip = document.createElement("div");
	tooltip.className = "ipv6-tooltip";
	tooltip.style.display = "none";

	const label = ipInfo.type === "ipv4" ? "IPv4 Binary:" : "IPv6 Binary:";
	tooltip.innerHTML = `
		<div>${label}</div>
		<div class="font-mono">${generateTooltipHTML(ipInfo.binary)}</div>
	`;

	const copyButton = createCopyButton(ipInfo.binary, ipInfo.type as "ipv4" | "ipv6");
	tooltip.appendChild(copyButton);

	return tooltip;
}

// IPアドレスを含むspan要素を作成
function createIPSpan(ipAddress: string, addressType: "ipv4" | "ipv6"): HTMLSpanElement {
	const span = document.createElement("span");
	span.textContent = ipAddress;
	span.style.position = "relative";
	span.style.cursor = "help";
	span.style.textDecoration = "underline";
	span.style.textDecorationStyle = "dotted";
	span.setAttribute("data-ip", ipAddress);
	span.setAttribute("data-ip-type", addressType);
	return span;
}

// ツールチップのホバーイベントを設定
function setupTooltipHoverEvents(element: HTMLElement, tooltip: HTMLElement): void {
	let hideTimeout: NodeJS.Timeout;

	const showTooltip = () => {
		clearTimeout(hideTimeout);
		const rect = element.getBoundingClientRect();
		tooltip.style.display = "block";
		tooltip.style.position = "fixed";
		tooltip.style.left = `${rect.left}px`;
		tooltip.style.top = `${rect.bottom + 2}px`;
		tooltip.style.zIndex = "10000";
	};

	const hideTooltip = () => {
		hideTimeout = setTimeout(() => {
			tooltip.style.display = "none";
		}, 200);
	};

	element.addEventListener("mouseenter", showTooltip);
	element.addEventListener("mouseleave", hideTooltip);

	tooltip.addEventListener("mouseenter", () => {
		clearTimeout(hideTimeout);
	});
	tooltip.addEventListener("mouseleave", hideTooltip);
}

// テキストノードからIPアドレスを検出してホバー機能を追加する関数
function processTextNode(textNode: Text): void {
	const text = textNode.textContent;
	if (!text) return;

	// IPv4とIPv6の両方のパターンを検出
	const ipPattern = ipRegex();
	const matches = Array.from(text.matchAll(new RegExp(ipPattern.source, "g")));
	if (matches.length === 0) return;

	const parent = textNode.parentElement;
	if (!parent) return;

	// 既に処理済みかチェック
	if (parent.hasAttribute("data-ip-processed")) return;

	let currentText = text;
	let offset = 0;

	matches.forEach((match) => {
		const ipAddress = match[0];
		const startIndex = (match.index ?? 0) + offset;
		const endIndex = startIndex + ipAddress.length;

		// IPアドレスのタイプを判定
		const addressType = detectAddressType(ipAddress);
		if (addressType === "invalid") return;

		// IPアドレスの前のテキスト
		if (startIndex > 0) {
			const beforeText = document.createTextNode(currentText.substring(0, startIndex));
			parent.insertBefore(beforeText, textNode);
		}

		// IPアドレス部分をspanで囲む
		const ipSpan = createIPSpan(ipAddress, addressType);

		// ツールチップを作成
		const ipInfo = detectAndConvertIP(ipAddress);
		if (!ipInfo) return; // 変換に失敗した場合はスキップ

		const tooltip = createTooltip(ipInfo);
		ipSpan.appendChild(tooltip);

		// ホバーイベントを設定
		setupTooltipHoverEvents(ipSpan, tooltip);

		parent.insertBefore(ipSpan, textNode);
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
	const processedElements = document.querySelectorAll("[data-ip-processed]");
	processedElements.forEach((element) => {
		element.removeAttribute("data-ip-processed");
	});

	// ツールチップも削除
	const tooltips = document.querySelectorAll(".ipv6-tooltip");
	tooltips.forEach((tooltip) => {
		tooltip.remove();
	});
}

// 初期化
async function initializeIPConverter(): Promise<void> {
	// 設定を確認
	const autoScan = await storage.get("autoScan");

	// 自動スキャンが有効な場合のみ処理
	if (autoScan === "true") {
		processNode(document.body);
	}
}

// 選択範囲の位置にツールチップを表示する関数
function showTooltipAtSelection(ipInfo: IPInfo): void {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return;

	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();

	// ツールチップを作成
	const tooltip = createTooltip(ipInfo);
	tooltip.style.display = "block";
	tooltip.style.position = "fixed";
	tooltip.style.left = `${rect.left}px`;
	tooltip.style.top = `${rect.bottom + 2}px`;
	tooltip.style.zIndex = "10001";

	// 既存のコンテキストメニュー由来のツールチップを削除
	const existingTooltip = document.querySelector(".ipv6-tooltip-context");
	if (existingTooltip) {
		existingTooltip.remove();
	}

	// コンテキストメニュー由来であることを示すクラスを追加
	tooltip.classList.add("ipv6-tooltip-context");
	document.body.appendChild(tooltip);

	// 10秒後に自動削除
	const autoRemoveTimeout = setTimeout(() => {
		tooltip.remove();
	}, 10000);

	// クリックで削除
	const handleClick = (e: MouseEvent) => {
		// ツールチップ内のクリックは無視
		if (tooltip.contains(e.target as Node)) return;

		clearTimeout(autoRemoveTimeout);
		tooltip.remove();
		document.removeEventListener("click", handleClick);
	};

	// 少し遅延させてイベントを登録（右クリックメニューのクリックを無視するため）
	setTimeout(() => {
		document.addEventListener("click", handleClick);
	}, 100);
}

// メッセージリスナー - 手動トリガー用
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (request.action === "scan") {
		// 既存の処理をクリア
		clearProcessedMarkers();
		// スキャン実行
		processNode(document.body);
		sendResponse({ success: true });
	} else if (request.action === "convertSelection") {
		// 選択されたテキストからIPアドレスを検出
		const text = request.text;
		const ipPattern = ipRegex();
		const matches = text.match(ipPattern);

		if (matches && matches.length > 0) {
			// 最初に見つかったIPアドレスを変換
			const ipAddress = matches[0];
			const ipInfo = detectAndConvertIP(ipAddress);

			if (ipInfo) {
				// ツールチップを表示
				showTooltipAtSelection(ipInfo);
				sendResponse({ success: true });
			} else {
				sendResponse({ success: false, error: "Invalid IP address" });
			}
		} else {
			sendResponse({ success: false, error: "No IP address found" });
		}
	}
	return true;
});

// ページ読み込み後に実行
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeIPConverter);
} else {
	initializeIPConverter();
}
