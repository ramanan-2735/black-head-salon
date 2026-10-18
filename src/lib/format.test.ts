import { describe, expect, it } from "vitest";
import { formatDuration, formatPrice, formatSalonTime } from "./format";

describe("formatPrice", () => {
  it("formats paise as rupees with Indian digit grouping", () => {
    expect(formatPrice(30000, false)).toBe("₹300");
    expect(formatPrice(123456700, false)).toBe("₹12,34,567");
  });

  it("prefixes starting prices", () => {
    expect(formatPrice(35000, true)).toBe("From ₹350");
  });

  it("shows price on request when unset", () => {
    expect(formatPrice(null, false)).toBe("Price on request");
  });
});

describe("formatDuration", () => {
  it("returns null when duration is unknown", () => {
    expect(formatDuration(null)).toBeNull();
    expect(formatDuration(45)).toBe("45 min");
  });
});

describe("salon time formatting", () => {
  it("shows an instant in Indian salon time, whatever the server timezone", () => {
    // 04:30 UTC is 10:00 IST.
    expect(formatSalonTime("2026-10-20T04:30:00.000Z")).toBe("10:00");
  });
});
