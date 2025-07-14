import { describe, expect, it } from "vitest";
import { IPV6_PATTERN, ipv6ToBits, isValidIPv6, normalizeIPv6 } from "./ipv6-converter";

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

	describe("IPV6_PATTERN", () => {
		it("should match full IPv6 addresses", () => {
			const address = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
			const matches = address.match(IPV6_PATTERN);
			expect(matches).toBeTruthy();
			expect(matches?.[0]).toBe(address);
		});

		it("should match compressed IPv6 addresses with ::", () => {
			const testCases = [
				"2001:db8::1",
				"::1",
				"::",
				"2001:db8::",
				"::ffff:192.0.2.1",
				"2001:0db8::3456:0000:0000:0000",
				"2001:0db8:0000:0000:3456::",
			];

			testCases.forEach((address) => {
				const matches = address.match(IPV6_PATTERN);
				expect(matches).toBeTruthy();
				expect(matches?.[0]).toBe(address);
			});
		});

		it("should match IPv6 addresses without leading zeros", () => {
			const testCases = [
				"2001:db8:85a3:0:0:8a2e:370:7334",
				"2001:db8:85a3::8a2e:370:7334",
				"fe80::1",
				"2001:db8:0:0:1:0:0:1",
			];

			testCases.forEach((address) => {
				const matches = address.match(IPV6_PATTERN);
				expect(matches).toBeTruthy();
				expect(matches?.[0]).toBe(address);
			});
		});

		it("should not match patterns that are not valid IPv6", () => {
			const invalidCases = [
				"192.168.1.1", // IPv4アドレス
				"invalid", // 文字列
				"", // 空文字列
			];

			invalidCases.forEach((address) => {
				const matches = address.match(IPV6_PATTERN);
				expect(matches).toBeFalsy();
			});
		});

		it("should extract valid IPv6 from strings with invalid IPv6 format", () => {
			const testCases = [
				{ text: "gggg::1", expected: "::1" },
				{ text: "2001:db8:::1", expected: "2001:db8::" },
				{ text: "2001:db8:85a3:0:0:8a2e:370:7334:extra", expected: "2001:db8:85a3:0:0:8a2e:370:7334" },
			];

			testCases.forEach(({ text, expected }) => {
				const matches = text.match(IPV6_PATTERN);
				expect(matches).toBeTruthy();
				expect(matches?.[0]).toBe(expected);
			});
		});

		it("should match valid IPv6 in invalid context", () => {
			// "::1::2"は無効な完全なIPv6アドレスだが、"::1"という有効な部分を含む
			const text = "::1::2";
			const matches = text.match(IPV6_PATTERN);
			expect(matches).toBeTruthy();
			expect(matches?.[0]).toBe("::1");
		});

		it("should match IPv6 addresses in text", () => {
			const text = "Server at 2001:db8::1 is responding. Connect to ::1 for localhost.";
			const matches = text.match(IPV6_PATTERN);
			expect(matches).toBeTruthy();
			expect(matches?.length).toBe(2);
			expect(matches?.[0]).toBe("2001:db8::1");
			expect(matches?.[1]).toBe("::1");
		});

		it("should match various IPv6 compression patterns", () => {
			const testCases = [
				"1:2:3:4:5:6:7:8",
				"1::8",
				"1:2:3:4:5:6:7::",
				"1:2:3:4:5:6::8",
				"1:2:3:4:5::8",
				"1:2:3:4::8",
				"1:2:3::8",
				"1:2::8",
				"1::3:4:5:6:7:8",
				"::2:3:4:5:6:7:8",
				"1:2:3:4:5:6::8",
			];

			testCases.forEach((address) => {
				const matches = address.match(IPV6_PATTERN);
				expect(matches).toBeTruthy();
				expect(matches?.[0]).toBe(address);
			});
		});
	});
});
