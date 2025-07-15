import { ipv4ToBits, isValidIPv4 } from "./ipv4-converter";
import { ipv6ToBits, isValidIPv6 } from "./ipv6-converter";

export type AddressType = "ipv4" | "ipv6" | "invalid";

/**
 * IPアドレスのタイプを判定
 * @param address - 判定するアドレス文字列
 * @returns アドレスタイプ
 */
export function detectAddressType(address: string): AddressType {
	if (!address || typeof address !== "string") {
		return "invalid";
	}

	const trimmed = address.trim();

	if (isValidIPv4(trimmed)) {
		return "ipv4";
	}

	if (isValidIPv6(trimmed)) {
		return "ipv6";
	}

	return "invalid";
}

/**
 * IPv4/IPv6共通の検証関数
 * @param address - 検証するアドレス文字列
 * @returns 有効なIPアドレスの場合true
 */
export function isValidIPAddress(address: string): boolean {
	return detectAddressType(address) !== "invalid";
}

/**
 * IPv4/IPv6共通の変換関数
 * @param address - IPアドレス文字列
 * @returns ビット表記文字列
 */
export function ipAddressToBits(address: string): string {
	const type = detectAddressType(address);

	switch (type) {
		case "ipv4": {
			// IPv4の32ビットをIPv6形式に合わせて表示
			// 32ビットを16ビットごとに区切って2セグメント作成
			const ipv4Bits = ipv4ToBits(address.trim());
			const segment1 = ipv4Bits.substring(0, 16);
			const segment2 = ipv4Bits.substring(16, 32);
			// IPv6の表示形式に合わせて、最初の2セグメントのみ使用し、残りは空にする
			return `${segment1}:${segment2}:::::`;
		}

		case "ipv6":
			return ipv6ToBits(address.trim());

		default:
			throw new Error("Invalid IP address");
	}
}
