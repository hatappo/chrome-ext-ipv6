import ipRegex from "ip-regex";

// IPv6アドレスの正規表現パターン（ip-regexパッケージを使用、完全一致）
export const IPV6_PATTERN = ipRegex.v6({ exact: true });

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
	return IPV6_PATTERN.test(ipv6.trim());
}
