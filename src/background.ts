// Plasmo Background Service Worker
export {};

// コンテキストメニューの作成
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "convertIP",
		title: "Convert IP Address",
		contexts: ["selection"],
	});
});

// コンテキストメニューのクリックハンドラ
chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "convertIP" && info.selectionText && tab?.id) {
		// 選択されたテキストをcontent scriptに送信
		// content script側でIPアドレスの検出と変換を行う
		chrome.tabs.sendMessage(tab.id, {
			action: "convertSelection",
			text: info.selectionText,
		});
	}
});
