import { describe, expect, it } from "vitest";
import { ipv6ToBits, isValidIPv6, normalizeIPv6 } from "./ipv6-converter";

describe("IPv6 Converter", () => {
	describe("normalizeIPv6", () => {
		it("should normalize full IPv6 address", () => {
			const result = normalizeIPv6("2001:db8:85a3:0:0:8a2e:370:7334");
			expect(result).toBe("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
		});

		it("should expand :: notation", () => {
			const result = normalizeIPv6("2001:db8::1");
			expect(result).toBe("2001:0db8:0000:0000:0000:0000:0000:0001");
		});

		it("should handle :: at the beginning", () => {
			const result = normalizeIPv6("::1");
			expect(result).toBe("0000:0000:0000:0000:0000:0000:0000:0001");
		});

		it("should handle :: at the end", () => {
			const result = normalizeIPv6("2001:db8::");
			expect(result).toBe("2001:0db8:0000:0000:0000:0000:0000:0000");
		});

		it("should handle single :: (all zeros)", () => {
			const result = normalizeIPv6("::");
			expect(result).toBe("0000:0000:0000:0000:0000:0000:0000:0000");
		});

		it("should handle :: in the middle with trailing segments", () => {
			const result = normalizeIPv6("2001:0db8:0000:0000:3456::");
			expect(result).toBe("2001:0db8:0000:0000:3456:0000:0000:0000");
		});

		it("should handle :: in the middle with leading segments", () => {
			const result = normalizeIPv6("2001:0db8::3456:0000:0000:0000");
			expect(result).toBe("2001:0db8:0000:0000:3456:0000:0000:0000");
		});
	});

	describe("ipv6ToBits", () => {
		it("should convert IPv6 to binary representation", () => {
			const result = ipv6ToBits("2001:db8::1");
			expect(result).toBe(
				"0010000000000001:0000110110111000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000001",
			);
		});

		it("should convert loopback address", () => {
			const result = ipv6ToBits("::1");
			expect(result).toBe(
				"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000001",
			);
		});

		it("should convert all zeros", () => {
			const result = ipv6ToBits("::");
			expect(result).toBe(
				"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000",
			);
		});

		it("should handle full IPv6 address", () => {
			const result = ipv6ToBits("2001:db8:85a3:0:0:8a2e:370:7334");
			expect(result).toBe(
				"0010000000000001:0000110110111000:1000010110100011:0000000000000000:0000000000000000:1000101000101110:0000001101110000:0111001100110100",
			);
		});

		it("should convert trailing :: notation", () => {
			const result = ipv6ToBits("2001:0db8:0000:0000:3456::");
			expect(result).toBe(
				"0010000000000001:0000110110111000:0000000000000000:0000000000000000:0011010001010110:0000000000000000:0000000000000000:0000000000000000",
			);
		});

		it("should convert :: in the middle with trailing zeros", () => {
			const result = ipv6ToBits("2001:0db8::3456:0000:0000:0000");
			expect(result).toBe(
				"0010000000000001:0000110110111000:0000000000000000:0000000000000000:0011010001010110:0000000000000000:0000000000000000:0000000000000000",
			);
		});
	});

	describe("isValidIPv6", () => {
		it("should return true for valid IPv6 addresses", () => {
			expect(isValidIPv6("2001:db8::1")).toBe(true);
			expect(isValidIPv6("::1")).toBe(true);
			expect(isValidIPv6("::")).toBe(true);
			expect(isValidIPv6("2001:db8:85a3:0:0:8a2e:370:7334")).toBe(true);
			expect(isValidIPv6("2001:0db8:0000:0000:3456::")).toBe(true);
			expect(isValidIPv6("2001:0db8::3456:0000:0000:0000")).toBe(true);
		});

		it("should return false for invalid IPv6 addresses", () => {
			expect(isValidIPv6("invalid")).toBe(false);
			expect(isValidIPv6("192.168.1.1")).toBe(false);
			expect(isValidIPv6("")).toBe(false);
		});
	});
});
