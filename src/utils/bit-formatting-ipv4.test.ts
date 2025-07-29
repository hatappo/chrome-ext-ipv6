import { describe, expect, it } from "vitest";
import { formatBitsToLines } from "./bit-formatting";

describe("formatBitsToLines - IPv4", () => {
	it("IPv4射影アドレス形式のビット文字列を正しく4行に分割する", () => {
		// IPv4射影アドレス形式：最初の80ビット(5セグメント)は0、次の16ビットは1、最後の32ビットがIPv4
		const ipv4Bits =
			"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:1111111111111111:1100000010101000:0000000100000001";
		const lines = formatBitsToLines(ipv4Bits);

		expect(lines).toHaveLength(4);

		// 1行目：最初の32ビット（全て0）
		expect(lines[0].lineNumber).toBe(32);
		expect(lines[0].bits).toBe("00000000000000000000000000000000");

		// 2行目：次の32ビット（全て0）
		expect(lines[1].lineNumber).toBe(64);
		expect(lines[1].bits).toBe("00000000000000000000000000000000");

		// 3行目：80ビット目まで0、96ビット目まで1
		expect(lines[2].lineNumber).toBe(96);
		expect(lines[2].bits).toBe("00000000000000001111111111111111");

		// 4行目：IPv4アドレス部分
		expect(lines[3].lineNumber).toBe(128);
		expect(lines[3].bits).toBe("11000000101010000000000100000001");
	});

	it("IPv4の単純なケース（1.1.1.1）", () => {
		const ipv4Bits =
			"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:1111111111111111:0000000100000001:0000000100000001";
		const lines = formatBitsToLines(ipv4Bits);

		// 最後の行にIPv4アドレスが表示される
		expect(lines[3].bits).toBe("00000001000000010000000100000001");
	});
});
