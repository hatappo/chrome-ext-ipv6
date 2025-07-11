// IPv6アドレスの正規表現パターン（さまざまな形式に対応）
export const IPV6_PATTERN =
	/\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){1,7}:\b|\b(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}\b|\b(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}\b|\b(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}\b|\b[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}\b|\b::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){1,7}:\b|\b::[0-9a-fA-F]{1,4}\b|\b::\b/g;

/**
 * IPv6アドレスを正規化する関数
 * - :: の展開
 * - 各セグメントを4桁にパディング
 */
export function normalizeIPv6(ipv6: string): string {
	// ::の処理
	if (ipv6.includes("::")) {
		const parts = ipv6.split("::");
		const leftParts = parts[0] ? parts[0].split(":") : [];
		const rightParts = parts[1] ? parts[1].split(":") : [];

		const missingParts = 8 - leftParts.length - rightParts.length;
		const middleParts = Array(missingParts).fill("0000");

		const allParts = [...leftParts, ...middleParts, ...rightParts];
		return allParts.map((part) => part.padStart(4, "0")).join(":");
	}

	// 各セグメントを4桁にパディング
	return ipv6
		.split(":")
		.map((segment) => segment.padStart(4, "0"))
		.join(":");
}

/**
 * IPv6アドレスを16進数からビット表記に変換する関数
 */
export function ipv6ToBits(ipv6: string): string {
	try {
		// IPv6アドレスを正規化
		const normalized = normalizeIPv6(ipv6);

		// 各16進数セグメントをビット表記に変換
		const segments = normalized.split(":");
		const binarySegments = segments.map((segment) => {
			return parseInt(segment, 16).toString(2).padStart(16, "0");
		});

		return binarySegments.join(":");
	} catch (error) {
		console.error("IPv6 to bits conversion error:", error);
		return ipv6;
	}
}

/**
 * IPv6アドレスが有効かどうかを確認する関数
 */
export function isValidIPv6(ipv6: string): boolean {
	if (!ipv6 || typeof ipv6 !== "string") {
		return false;
	}

	try {
		// 基本的な形式チェック
		if (!/^[0-9a-fA-F:]+$/.test(ipv6)) {
			return false;
		}

		// :: が複数回出現する場合は無効
		if ((ipv6.match(/::/g) || []).length > 1) {
			return false;
		}

		// 正規化を試行
		const normalized = normalizeIPv6(ipv6);

		// 正規化された形式が期待する形式と一致するかチェック
		const segments = normalized.split(":");
		if (segments.length !== 8) {
			return false;
		}

		// 各セグメントが4桁の16進数かチェック
		for (const segment of segments) {
			if (!/^[0-9a-fA-F]{4}$/.test(segment)) {
				return false;
			}
		}

		return true;
	} catch {
		return false;
	}
}
