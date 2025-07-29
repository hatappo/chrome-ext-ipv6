import { describe, expect, it } from "vitest";
import { detectAddressType, detectAndConvertIP, ipAddressToBits, isValidIPAddress } from "./ip-address-common";

describe("detectAddressType", () => {
	it("IPv4アドレスを正しく判定する", () => {
		expect(detectAddressType("192.168.1.1")).toBe("ipv4");
		expect(detectAddressType("10.0.0.1")).toBe("ipv4");
		expect(detectAddressType("255.255.255.255")).toBe("ipv4");
	});

	it("IPv6アドレスを正しく判定する", () => {
		expect(detectAddressType("2001:db8::1")).toBe("ipv6");
		expect(detectAddressType("::1")).toBe("ipv6");
		expect(detectAddressType("fe80::1")).toBe("ipv6");
	});

	it("無効なアドレスを正しく判定する", () => {
		expect(detectAddressType("not-an-ip")).toBe("invalid");
		expect(detectAddressType("256.1.1.1")).toBe("invalid");
		expect(detectAddressType("")).toBe("invalid");
		expect(detectAddressType("192.168.1")).toBe("invalid");
	});
});

describe("isValidIPAddress", () => {
	it("有効なIPアドレスを正しく判定する", () => {
		expect(isValidIPAddress("192.168.1.1")).toBe(true);
		expect(isValidIPAddress("2001:db8::1")).toBe(true);
		expect(isValidIPAddress("::1")).toBe(true);
		expect(isValidIPAddress("10.0.0.1")).toBe(true);
	});

	it("無効なアドレスを正しく判定する", () => {
		expect(isValidIPAddress("not-an-ip")).toBe(false);
		expect(isValidIPAddress("256.1.1.1")).toBe(false);
		expect(isValidIPAddress("")).toBe(false);
	});
});

describe("ipAddressToBits", () => {
	it("IPv4アドレスをIPv4射影アドレス形式で正しく変換する", () => {
		const result = ipAddressToBits("192.168.1.1");
		// IPv4射影アドレス形式: 最初の80ビット(5セグメント)は0、次の16ビットは1、最後の32ビットがIPv4
		expect(result).toBe(
			"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:1111111111111111:1100000010101000:0000000100000001",
		);
	});

	it("IPv6アドレスを正しく変換する", () => {
		const result = ipAddressToBits("::1");
		// IPv6の::1は最後の1ビットのみ1
		expect(result.endsWith("0000000000000001")).toBe(true);
	});

	it("無効なアドレスの場合エラーをスローする", () => {
		expect(() => ipAddressToBits("not-an-ip")).toThrow("Invalid IP address");
		expect(() => ipAddressToBits("256.1.1.1")).toThrow("Invalid IP address");
	});
});

describe("detectAndConvertIP", () => {
	it("有効なIPv4アドレスを正しく変換する", () => {
		const result = detectAndConvertIP("192.168.1.1");
		expect(result).not.toBeNull();
		expect(result?.address).toBe("192.168.1.1");
		expect(result?.type).toBe("ipv4");
		expect(result?.binary).toBe(
			"0000000000000000:0000000000000000:0000000000000000:0000000000000000:0000000000000000:1111111111111111:1100000010101000:0000000100000001",
		);
		// IPv4はIPv4射影アドレスとして分類される
		expect(result?.classification?.type.toLowerCase()).toMatch(/ipv4/i);
	});

	it("有効なIPv6アドレスを正しく変換する", () => {
		const result = detectAndConvertIP("2001:db8::1");
		expect(result).not.toBeNull();
		expect(result?.address).toBe("2001:db8::1");
		expect(result?.type).toBe("ipv6");
		expect(result?.binary).toContain(":");
		// グローバルユニキャストアドレスとして分類される
		expect(result?.classification?.type.toLowerCase()).toMatch(/グローバルユニキャスト/i);
	});

	it("無効なアドレスの場合nullを返す", () => {
		expect(detectAndConvertIP("not-an-ip")).toBeNull();
		expect(detectAndConvertIP("256.1.1.1")).toBeNull();
		expect(detectAndConvertIP("")).toBeNull();
	});

	it("前後の空白を取り除いて処理する", () => {
		const result = detectAndConvertIP("  192.168.1.1  ");
		expect(result).not.toBeNull();
		expect(result?.address).toBe("192.168.1.1");
	});
});
