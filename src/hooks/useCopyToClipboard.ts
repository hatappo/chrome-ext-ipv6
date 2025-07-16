import { useState } from "react";

const COPY_SUCCESS_DURATION = 2000; // ms

/**
 * クリップボードにコピーする機能を提供するカスタムフック
 * @returns コピー機能とコピー成功状態
 */
export function useCopyToClipboard() {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
			return true;
		} catch (error) {
			console.error("Failed to copy:", error);
			return false;
		}
	};

	return { copyToClipboard, isCopied };
}
