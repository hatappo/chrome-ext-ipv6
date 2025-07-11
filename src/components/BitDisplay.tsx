import type React from "react";
import { formatBitsToLines, getBitColorClass } from "../utils/bit-formatting";

interface BitDisplayProps {
	bits: string;
	variant?: "popup" | "tooltip";
}

/**
 * IPv6ビット表記を2行で表示する共通コンポーネント
 */
export function BitDisplay({ bits, variant = "popup" }: BitDisplayProps): React.ReactElement {
	const lines = formatBitsToLines(bits);

	return (
		<div className={`bits-display ${variant === "tooltip" ? "tooltip-variant" : ""}`}>
			{lines.map((line, lineIndex) => (
				<div key={`line-${lineIndex}-${line.bits.slice(0, 4)}`} className="bits-line">
					<span className="line-number">{line.lineNumber}:</span>
					<div className="bits-content">
						{line.bits.split("").map((bit, bitIndex) => {
							const globalIndex = lineIndex * 64 + bitIndex;
							return (
								<span key={`bit-${globalIndex}-${bit}`} className={getBitColorClass(bit)}>
									{bit}
								</span>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
