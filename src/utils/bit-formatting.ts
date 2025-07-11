// ビット表示の共通ユーティリティ関数

export interface BitDisplayLine {
	lineNumber: number;
	bits: string;
}

/**
 * IPv6ビット文字列を64ビットずつ2行に分割
 */
export function formatBitsToLines(bits: string): BitDisplayLine[] {
	const segments = bits.split(":");
	const binaryString = segments.join("");

	const lines: BitDisplayLine[] = [];
	for (let i = 0; i < 2; i++) {
		const start = i * 64;
		const end = start + 64;
		lines.push({
			lineNumber: (i + 1) * 64,
			bits: binaryString.slice(start, end),
		});
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
