import { useEffect, useState } from "react";
import "./style.css";
import { BitDisplay } from "./components/BitDisplay";
import { ipAddressToBits, isValidIPAddress } from "./utils/ip-address-common";

function IndexPopup() {
	const [inputValue, setInputValue] = useState("");
	const [result, setResult] = useState("");
	const [error, setError] = useState("");
	const [scanMessage, setScanMessage] = useState("");

	// Auto-convert when input changes
	useEffect(() => {
		if (!inputValue.trim()) {
			setResult("");
			setError("");
			return;
		}

		if (isValidIPAddress(inputValue)) {
			try {
				const bits = ipAddressToBits(inputValue);
				setResult(bits);
				setError("");
			} catch {
				setError("Conversion error occurred");
				setResult("");
			}
		} else {
			setResult("");
			setError("Please enter a valid IP address (IPv4 or IPv6)");
		}
	}, [inputValue]);

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
					// Show success feedback in scan message area
					setScanMessage("Page scanned successfully!");
					setTimeout(() => {
						setScanMessage("");
					}, 3000);
				}
			}
		} catch (error) {
			console.error("Scan error:", error);
			setScanMessage("Failed to scan page");
			setTimeout(() => {
				setScanMessage("");
			}, 3000);
		}
	};

	return (
		<div className="popup-container">
			<h2 className="popup-title">IP Address to Binary Converter</h2>

			<div className="input-group">
				<label htmlFor="ip-input" className="input-label">
					IP Address:
				</label>
				<input
					id="ip-input"
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="e.g. 192.168.1.1 or 2001:db8::1"
					className="input-field"
				/>
			</div>

			<button type="button" onClick={handleClear} className="btn btn-secondary btn-clear">
				Clear
			</button>

			{error && <div className="error-message">{error}</div>}

			<div className="result-container">
				<div className="result-label">Binary Representation:</div>
				<div className="result-box">
					{result && <BitDisplay bits={result} variant="popup" />}
				</div>
			</div>

			<div className="scan-section">
				<button type="button" onClick={handleScan} className="btn btn-scan">
					Scan Page
				</button>
				<p className="scan-description">Detect IP addresses on this page</p>
				{scanMessage && <div className="scan-message">{scanMessage}</div>}
			</div>

			<footer className="footer">Convert IP address to binary representation</footer>
		</div>
	);
}

export default IndexPopup;
