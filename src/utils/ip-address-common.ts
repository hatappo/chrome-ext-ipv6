import { ipv4ToBits, isValidIPv4 } from "./ipv4-converter";
import { classifyIPv6, type IPv6Classification } from "./ipv6-classifier";
import { ipv6ToBits, isValidIPv6, normalizeIPv6 } from "./ipv6-converter";

export type AddressType = "ipv4" | "ipv6" | "invalid";

export interface IPInfo {
	address: string;
	type: AddressType;
	binary: string;
	classification?: IPv6Classification;
}

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
			// IPv4をIPv6のIPv4射影アドレス形式のビット表現に変換
			// ::ffff:x.x.x.x の形式なので、最初の96ビットは0、最後の32ビットがIPv4
			const ipv4Bits = ipv4ToBits(address.trim());
			// 96ビットの0（6セグメント分）+ IPv4の32ビット（2セグメント分）
			const zeros = "0000000000000000"; // 16ビットの0
			const segment7 = ipv4Bits.substring(0, 16);
			const segment8 = ipv4Bits.substring(16, 32);
			return `${zeros}:${zeros}:${zeros}:${zeros}:${zeros}:1111111111111111:${segment7}:${segment8}`;
		}

		case "ipv6":
			return ipv6ToBits(address.trim());

		default:
			throw new Error("Invalid IP address");
	}
}

/**
 * IPアドレスを検出して変換情報を返す
 * @param address - IPアドレス文字列
 * @returns IPInfo オブジェクト、無効な場合はnull
 */
export function detectAndConvertIP(address: string): IPInfo | null {
	const type = detectAddressType(address);

	if (type === "invalid") {
		return null;
	}

	try {
		const binary = ipAddressToBits(address);
		const trimmedAddress = address.trim();

		// IPv4の場合はIPv4射影アドレス形式に変換、IPv6の場合はそのまま正規化
		let normalized: string;
		if (type === "ipv4") {
			// IPv4をIPv6のIPv4射影アドレス形式に変換
			const octets = trimmedAddress.split(".");
			const hex1 = (parseInt(octets[0]) * 256 + parseInt(octets[1])).toString(16).padStart(4, "0");
			const hex2 = (parseInt(octets[2]) * 256 + parseInt(octets[3])).toString(16).padStart(4, "0");
			normalized = `0000:0000:0000:0000:0000:ffff:${hex1}:${hex2}`;
		} else {
			normalized = normalizeIPv6(trimmedAddress);
		}

		const classification = classifyIPv6(normalized);

		return {
			address: trimmedAddress,
			type,
			binary,
			classification: classification || undefined,
		};
	} catch (_error) {
		return null;
	}
}
