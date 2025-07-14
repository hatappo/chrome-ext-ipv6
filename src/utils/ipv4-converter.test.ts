import { describe, expect, it } from "vitest";
import { ipv4ToBits, isValidIPv4 } from "./ipv4-converter";

describe("isValidIPv4", () => {
	it("有効なIPv4アドレスを正しく判定する", () => {
		expect(isValidIPv4("192.168.1.1")).toBe(true);
		expect(isValidIPv4("0.0.0.0")).toBe(true);
		expect(isValidIPv4("255.255.255.255")).toBe(true);
		expect(isValidIPv4("10.0.0.1")).toBe(true);
		expect(isValidIPv4("172.16.0.1")).toBe(true);
	});

	it("無効なIPv4アドレスを正しく判定する", () => {
		expect(isValidIPv4("256.1.1.1")).toBe(false);
		expect(isValidIPv4("192.168.1")).toBe(false);
		expect(isValidIPv4("192.168.1.1.1")).toBe(false);
		expect(isValidIPv4("192.168.-1.1")).toBe(false);
		expect(isValidIPv4("192.168.a.1")).toBe(false);
		expect(isValidIPv4("")).toBe(false);
		expect(isValidIPv4("not-an-ip")).toBe(false);
	});

	it("前後の空白を除去して判定する", () => {
		expect(isValidIPv4(" 192.168.1.1 ")).toBe(true);
		expect(isValidIPv4("\t10.0.0.1\n")).toBe(true);
	});
});

describe("ipv4ToBits", () => {
	it("IPv4アドレスを正しくビット表記に変換する", () => {
		expect(ipv4ToBits("192.168.1.1")).toBe("11000000101010000000000100000001");
		expect(ipv4ToBits("255.255.255.255")).toBe("11111111111111111111111111111111");
		expect(ipv4ToBits("0.0.0.0")).toBe("00000000000000000000000000000000");
		expect(ipv4ToBits("10.0.0.1")).toBe("00001010000000000000000000000001");
	});

	it("各オクテットが8ビットにパディングされる", () => {
		expect(ipv4ToBits("1.1.1.1")).toBe("00000001000000010000000100000001");
		expect(ipv4ToBits("128.64.32.16")).toBe("10000000010000000010000000010000");
	});

	it("無効なIPv4アドレスの場合エラーをスローする", () => {
		expect(() => ipv4ToBits("256.1.1.1")).toThrow("Invalid IPv4 address");
		expect(() => ipv4ToBits("192.168.1")).toThrow("Invalid IPv4 address");
		expect(() => ipv4ToBits("not-an-ip")).toThrow("Invalid IPv4 address");
	});

	it("前後の空白を除去して変換する", () => {
		expect(ipv4ToBits(" 192.168.1.1 ")).toBe("11000000101010000000000100000001");
	});
});
