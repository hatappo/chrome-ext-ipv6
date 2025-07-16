// ビット表示の共通ユーティリティ関数

export interface BitDisplayLine {
	lineNumber: number;
	bits: string;
}

/**
 * IPv6ビット文字列を32ビットずつ4行に分割
 * IPv4の場合は最初の1行のみにビットが入り、残りは空文字列
 */
export function formatBitsToLines(bits: string): BitDisplayLine[] {
	const segments = bits.split(":");

	const lines: BitDisplayLine[] = [];

	// IPv4の場合（3番目以降のセグメントが空）
	if (segments.length > 2 && segments.slice(2).every((seg) => seg === "")) {
		// 最初の2セグメント（32ビット）のみ結合
		const ipv4Bits = segments.slice(0, 2).join("");
		lines.push({
			lineNumber: 32,
			bits: ipv4Bits,
		});
		// 残りの3行は空
		for (let i = 1; i < 4; i++) {
			lines.push({
				lineNumber: (i + 1) * 32,
				bits: "",
			});
		}
	} else {
		// IPv6の場合は従来通り
		const binaryString = segments.join("");
		for (let i = 0; i < 4; i++) {
			const start = i * 32;
			const end = start + 32;
			lines.push({
				lineNumber: (i + 1) * 32,
				bits: binaryString.slice(start, end),
			});
		}
	}

	return lines;
}

/**
 * ビットの値に応じて色分けCSSクラスを返す
 */
export function getBitColorClass(bit: string): string {
	return bit === "0" ? "ipv6-bit-zero" : bit === "1" ? "ipv6-bit-one" : "";
}

/**
 * ビット文字列に8ビットごとのスペースを追加
 */
export function addSpacingToBits(bits: string): string {
	return bits
		.split("")
		.map((bit, index) => {
			if ((index + 1) % 8 === 0 && index < bits.length - 1) {
				return `${bit} `;
			}
			return bit;
		})
		.join("");
}
