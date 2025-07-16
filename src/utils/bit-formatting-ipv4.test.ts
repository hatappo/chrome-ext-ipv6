import { describe, expect, it } from "vitest";
import { formatBitsToLines } from "./bit-formatting";

describe("formatBitsToLines - IPv4", () => {
	it("IPv4形式のビット文字列を正しく4行に分割する（2行目以降は空）", () => {
		// IPv4の場合：最初の2セグメントのみ、残りは空
		const ipv4Bits = "11000000101010000000000100000001:00001010000000000000000000000001:::::";
		const lines = formatBitsToLines(ipv4Bits);

		expect(lines).toHaveLength(4);

		// 1行目：32ビット
		expect(lines[0].lineNumber).toBe(32);
		expect(lines[0].bits).toBe("1100000010101000000000010000000100001010000000000000000000000001");

		// 2-4行目：空
		expect(lines[1].lineNumber).toBe(64);
		expect(lines[1].bits).toBe("");

		expect(lines[2].lineNumber).toBe(96);
		expect(lines[2].bits).toBe("");

		expect(lines[3].lineNumber).toBe(128);
		expect(lines[3].bits).toBe("");
	});

	it("IPv4の単純なケース", () => {
		const ipv4Bits = "00000001000000010000000100000001:::::"; // 1.1.1.1の簡略版
		const lines = formatBitsToLines(ipv4Bits);

		expect(lines[0].bits).toBe("00000001000000010000000100000001");
		expect(lines[1].bits).toBe("");
		expect(lines[2].bits).toBe("");
		expect(lines[3].bits).toBe("");
	});
});
