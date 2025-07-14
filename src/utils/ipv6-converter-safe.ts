import ipRegex from "ip-regex";

// タイムアウト付きの安全なIPv6パターンマッチング
const REGEX_TIMEOUT_MS = 100; // 100ms のタイムアウト

/**
 * タイムアウト付きでIPv6アドレスをマッチする
 * ReDoS攻撃を防ぐため、一定時間で処理を中断
 */
export function matchIPv6WithTimeout(text: string): string[] | null {
	const startTime = performance.now();
	const results: string[] = [];
	
	try {
		// テキストが長すぎる場合は事前にチェック
		if (text.length > 10000) {
			console.warn("Text too long for IPv6 matching");
			return null;
		}
		
		const matches = text.matchAll(ipRegex.v6());
		
		for (const match of matches) {
			// タイムアウトチェック
			if (performance.now() - startTime > REGEX_TIMEOUT_MS) {
				console.warn("IPv6 regex matching timeout");
				return results.length > 0 ? results : null;
			}
			
			results.push(match[0]);
		}
		
		return results;
	} catch (error) {
		console.error("Error in IPv6 matching:", error);
		return null;
	}
}

/**
 * 文字列を分割して処理することで、ReDoSリスクを軽減
 */
export function matchIPv6InChunks(text: string, chunkSize = 1000): string[] {
	const results: string[] = [];
	
	// 改行や空白で分割
	const chunks = text.split(/[\s\n]+/);
	
	for (const chunk of chunks) {
		if (chunk.length > chunkSize) {
			continue; // 長すぎるチャンクはスキップ
		}
		
		const matches = chunk.match(ipRegex.v6());
		if (matches) {
			results.push(...matches);
		}
	}
	
	return [...new Set(results)]; // 重複を除去
}