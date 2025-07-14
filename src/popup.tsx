import { useState } from "react";
import { BitDisplay } from "./components/BitDisplay";
import { ipv6ToBits, isValidIPv6 } from "./utils/ipv6-converter";
import "./style.css";

function IndexPopup() {
	const [inputValue, setInputValue] = useState("");
	const [result, setResult] = useState("");
	const [error, setError] = useState("");

	const handleConvert = () => {
		if (!inputValue.trim()) {
			setError("Please enter an IPv6 address");
			setResult("");
			return;
		}

		if (!isValidIPv6(inputValue)) {
			setError("Please enter a valid IPv6 address");
			setResult("");
			return;
		}

		try {
			const bits = ipv6ToBits(inputValue);
			setResult(bits);
			setError("");
		} catch {
			setError("Hex to binary conversion error occurred");
			setResult("");
		}
	};

	const handleClear = () => {
		setInputValue("");
		setResult("");
		setError("");
	};

	const handleScan = async () => {
		try {
			// 現在のアクティブタブを取得
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			if (tab.id) {
				// コンテンツスクリプトにスキャンメッセージを送信
				const response = await chrome.tabs.sendMessage(tab.id, { action: "scan" });
				if (response?.success) {
					// Show success feedback temporarily
					setError("");
					const originalResult = result;
					setResult("Page scanned successfully!");
					setTimeout(() => {
						setResult(originalResult);
					}, 2000);
				}
			}
		} catch (error) {
			console.error("Scan error:", error);
			setError("Failed to scan page");
		}
	};

	return (
		<div className="popup-container">
			<h2 className="popup-title">IPv6 Hex to Binary Converter</h2>

			<div className="input-group">
				<label htmlFor="ipv6-input" className="input-label">
					IPv6 Address:
				</label>
				<input
					id="ipv6-input"
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="e.g. 2001:db8::1"
					className="input-field"
				/>
			</div>

			<div className="button-group">
				<button type="button" onClick={handleConvert} className="btn btn-primary">
					Convert
				</button>
				<button type="button" onClick={handleClear} className="btn btn-secondary">
					Clear
				</button>
			</div>

			{error && <div className="error-message">{error}</div>}

			{result && (
				<div className="result-container">
					<div className="result-label">Binary Representation:</div>
					<div className="result-box">
						<BitDisplay bits={result} variant="popup" />
					</div>
				</div>
			)}

			<div className="scan-section">
				<button type="button" onClick={handleScan} className="btn btn-scan">
					Scan Page
				</button>
				<p className="scan-description">Detect IPv6 addresses on this page</p>
			</div>

			<footer className="footer">Convert IPv6 hex format to binary representation</footer>
		</div>
	);
}

export default IndexPopup;
