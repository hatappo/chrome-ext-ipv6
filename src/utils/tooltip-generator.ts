import { addSpacingToBits, formatBitsToLines, getBitColorClass } from "./bit-formatting";

/**
 * ツールチップ用のHTMLを生成
 */
export function generateTooltipHTML(bits: string): string {
	const lines = formatBitsToLines(bits);

	return lines
		.map((line) => {
			const spacedBits = addSpacingToBits(line.bits);
			const coloredBits = spacedBits
				.split("")
				.map((char) => {
					if (char === " ") return char;
					const colorClass = getBitColorClass(char);
					return colorClass ? `<span class="${colorClass}">${char}</span>` : char;
				})
				.join("");

			return `<div class="tooltip-line"><span class="tooltip-line-number">${line.lineNumber}:</span><span class="tooltip-bits">${coloredBits}</span></div>`;
		})
		.join("");
}
