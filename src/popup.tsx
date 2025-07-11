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

	const handleRescan = async () => {
		try {
			// 現在のアクティブタブを取得
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			if (tab.id) {
				// コンテンツスクリプトに再スキャンメッセージを送信
				const response = await chrome.tabs.sendMessage(tab.id, { action: "rescan" });
				if (response?.success) {
					// 成功フィードバックを表示（一時的に）
					setError("");
					const originalResult = result;
					setResult("ページを再スキャンしました！");
					setTimeout(() => {
						setResult(originalResult);
					}, 2000);
				}
			}
		} catch (error) {
			console.error("Rescan error:", error);
			setError("再スキャンに失敗しました");
		}
	};

	return (
		<div className="popup-container">
			<h2 className="popup-title">IPv6 → ビット変換</h2>

			<div className="input-group">
				<label htmlFor="ipv6-input" className="input-label">
					IPv6アドレス:
				</label>
				<input
					id="ipv6-input"
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="例: 2001:db8::1"
					className="input-field"
				/>
			</div>

			<div className="button-group">
				<button type="button" onClick={handleConvert} className="btn btn-primary">
					変換
				</button>
				<button type="button" onClick={handleClear} className="btn btn-secondary">
					クリア
				</button>
			</div>

			{error && <div className="error-message">{error}</div>}

			{result && (
				<div className="result-container">
					<div className="result-label">ビット表記:</div>
					<div className="result-box">
						<BitDisplay bits={result} variant="popup" />
					</div>
				</div>
			)}

			<div className="rescan-section">
				<button type="button" onClick={handleRescan} className="btn btn-rescan">
					ページを再スキャン
				</button>
				<p className="rescan-description">動的に追加されたIPv6アドレスも検出します</p>
			</div>

			<footer className="footer">IPv6アドレスをビット表記に変換します</footer>
		</div>
	);
}

export default IndexPopup;
