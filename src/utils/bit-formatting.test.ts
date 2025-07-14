import { describe, expect, it } from "vitest";
import { addSpacingToBits, formatBitsToLines, getBitColorClass } from "./bit-formatting";

describe("bit-formatting utilities", () => {
	describe("formatBitsToLines", () => {
		it("should split 128 bits into 4 lines of 32 bits each", () => {
			const bits =
				"0010000000000001:0000110110111000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000001";
			const result = formatBitsToLines(bits);

			expect(result).toHaveLength(4);
			expect(result[0].lineNumber).toBe(32);
			expect(result[0].bits).toHaveLength(32);
			expect(result[1].lineNumber).toBe(64);
			expect(result[1].bits).toHaveLength(32);
			expect(result[2].lineNumber).toBe(96);
			expect(result[2].bits).toHaveLength(32);
			expect(result[3].lineNumber).toBe(128);
			expect(result[3].bits).toHaveLength(32);
		});

		it("should handle typical IPv6 bits format", () => {
			const bits =
				"0010000000000001:0000110110111000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000001";
			const result = formatBitsToLines(bits);

			expect(result[0].bits).toBe("00100000000000010000110110111000");
			expect(result[1].bits).toBe("00000000000000000000000000000000");
			expect(result[2].bits).toBe("00000000000000000000000000000000");
			expect(result[3].bits).toBe("00000000000000000000000000000001");
		});
	});

	describe("getBitColorClass", () => {
		it("should return correct CSS class for bit 0", () => {
			expect(getBitColorClass("0")).toBe("ipv6-bit-zero");
		});

		it("should return correct CSS class for bit 1", () => {
			expect(getBitColorClass("1")).toBe("ipv6-bit-one");
		});

		it("should return empty string for other characters", () => {
			expect(getBitColorClass(":")).toBe("");
			expect(getBitColorClass("a")).toBe("");
			expect(getBitColorClass(" ")).toBe("");
		});
	});

	describe("addSpacingToBits", () => {
		it("should add space after every 8 bits", () => {
			const bits = "0000000011111111000000001111111100000000111111110000000011111111";
			const result = addSpacingToBits(bits);

			expect(result).toBe("00000000 11111111 00000000 11111111 00000000 11111111 00000000 11111111");
		});

		it("should not add space after the last bit", () => {
			const bits = "00000000";
			const result = addSpacingToBits(bits);

			expect(result).toBe("00000000");
		});

		it("should handle shorter bit strings", () => {
			const bits = "0000";
			const result = addSpacingToBits(bits);

			expect(result).toBe("0000");
		});
	});
});
