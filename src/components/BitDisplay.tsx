import type React from "react";
import { formatBitsToLines, getBitColorClass } from "../utils/bit-formatting";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

interface BitDisplayProps {
	bits: string;
	variant?: "popup" | "tooltip";
}

/**
 * IPv6ビット表記を4行で表示する共通コンポーネント
 */
export function BitDisplay({ bits, variant = "popup" }: BitDisplayProps): React.ReactElement {
	const lines = formatBitsToLines(bits);
	const { copyToClipboard, isCopied } = useCopyToClipboard();

	const handleCopy = async () => {
		const binaryString = bits.split(":").join("");
		await copyToClipboard(binaryString);
	};

	return (
		<div className={`bits-display ${variant === "tooltip" ? "tooltip-variant" : ""}`}>
			<div className="copy-button-container">
				<button type="button" onClick={handleCopy} className="copy-button" title="Copy binary string">
					{isCopied ? "Copied!" : "Copy"}
				</button>
			</div>
			{lines.map((line, lineIndex) => (
				<div key={`line-${lineIndex}-${line.bits.slice(0, 4)}`} className="bits-line">
					<span className="line-number">{line.lineNumber}:</span>
					<div className="bits-content">
						{line.bits.split("").map((bit, bitIndex) => {
							const globalIndex = lineIndex * 32 + bitIndex;
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
