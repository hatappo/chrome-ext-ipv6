import ipRegex from "ip-regex";

// IPv4アドレスの正規表現パターン（ip-regexパッケージを使用）
export const IPV4_PATTERN = ipRegex.v4({ exact: true });

/**
 * IPv4アドレスの検証
 * @param address - 検証するアドレス文字列
 * @returns 有効なIPv4アドレスの場合true
 */
export function isValidIPv4(address: string): boolean {
	if (!address || typeof address !== "string") {
		return false;
	}
	return IPV4_PATTERN.test(address.trim());
}

/**
 * IPv4アドレスをビット表記に変換
 * @param ipv4 - IPv4アドレス文字列
 * @returns 32ビットのバイナリ文字列（コロン区切りなし）
 */
export function ipv4ToBits(ipv4: string): string {
	const trimmed = ipv4.trim();
	if (!isValidIPv4(trimmed)) {
		throw new Error("Invalid IPv4 address");
	}

	const octets = trimmed.split(".");
	const bits = octets.map((octet) => {
		const num = parseInt(octet, 10);
		return num.toString(2).padStart(8, "0");
	});

	// 32ビットを返す（IPv6形式の表示時に最初の1行に収まるように）
	return bits.join("");
}
