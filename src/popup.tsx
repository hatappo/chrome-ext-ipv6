import { useState } from "react";
import { ipv6ToBits, isValidIPv6 } from "./utils/ipv6-converter";

function IndexPopup() {
	const [inputValue, setInputValue] = useState("");
	const [result, setResult] = useState("");
	const [error, setError] = useState("");

	const handleConvert = () => {
		if (!inputValue.trim()) {
			setError("IPv6アドレスを入力してください");
			setResult("");
			return;
		}

		if (!isValidIPv6(inputValue)) {
			setError("有効なIPv6アドレスを入力してください");
			setResult("");
			return;
		}

		try {
			const bits = ipv6ToBits(inputValue);
			setResult(bits);
			setError("");
		} catch {
			setError("変換エラーが発生しました");
			setResult("");
		}
	};

	const handleClear = () => {
		setInputValue("");
		setResult("");
		setError("");
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: 16,
				minWidth: 400,
				fontFamily: "Arial, sans-serif",
			}}
		>
			<h2 style={{ margin: "0 0 16px 0", color: "#333" }}>IPv6 → ビット変換</h2>

			<div style={{ marginBottom: 12 }}>
				<label htmlFor="ipv6-input" style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
					IPv6アドレス:
				</label>
				<input
					id="ipv6-input"
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="例: 2001:db8::1"
					style={{
						width: "100%",
						padding: 8,
						border: "1px solid #ddd",
						borderRadius: 4,
						fontSize: 14,
					}}
				/>
			</div>

			<div style={{ marginBottom: 12 }}>
				<button
					type="button"
					onClick={handleConvert}
					style={{
						padding: "8px 16px",
						backgroundColor: "#007cba",
						color: "white",
						border: "none",
						borderRadius: 4,
						cursor: "pointer",
						marginRight: 8,
					}}
				>
					変換
				</button>
				<button
					type="button"
					onClick={handleClear}
					style={{
						padding: "8px 16px",
						backgroundColor: "#666",
						color: "white",
						border: "none",
						borderRadius: 4,
						cursor: "pointer",
					}}
				>
					クリア
				</button>
			</div>

			{error && (
				<div
					style={{
						padding: 8,
						backgroundColor: "#ffebee",
						color: "#c62828",
						borderRadius: 4,
						marginBottom: 12,
						fontSize: 14,
					}}
				>
					{error}
				</div>
			)}

			{result && (
				<div style={{ marginBottom: 12 }}>
					<div style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>ビット表記:</div>
					<div
						style={{
							padding: 8,
							backgroundColor: "#f5f5f5",
							border: "1px solid #ddd",
							borderRadius: 4,
							fontSize: 12,
							fontFamily: "monospace",
							wordBreak: "break-all",
						}}
					>
						{result}
					</div>
				</div>
			)}

			<footer style={{ marginTop: 16, fontSize: 12, color: "#666" }}>IPv6アドレスをビット表記に変換します</footer>
		</div>
	);
}

export default IndexPopup;
