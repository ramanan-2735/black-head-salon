import { describe, expect, it } from "vitest";
import { bookingRequestSchema, normalizeIndianMobile } from "./schemas";

describe("normalizeIndianMobile", () => {
  it("accepts common formats and returns E.164", () => {
    expect(normalizeIndianMobile("9876543210")).toBe("+919876543210");
    expect(normalizeIndianMobile("98765 43210")).toBe("+919876543210");
    expect(normalizeIndianMobile("+91-98765-43210")).toBe("+919876543210");
    expect(normalizeIndianMobile("09876543210")).toBe("+919876543210");
  });

  it("rejects numbers that aren't Indian mobiles", () => {
    expect(normalizeIndianMobile("1234567890")).toBeNull(); // must start 6–9
    expect(normalizeIndianMobile("98765")).toBeNull(); // too short
    expect(normalizeIndianMobile("abcdefghij")).toBeNull();
  });
});

describe("bookingRequestSchema", () => {
  const valid = {
    serviceId: "svc-classic-cut",
    staffId: "any",
    startsAt: "2026-10-20T04:30:00.000Z",
    name: "Test Customer",
    phone: "9876543210",
    consent: true,
    idempotencyKey: "abcdefgh-1234",
  };

  it("accepts a complete request", () => {
    expect(bookingRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("requires consent", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("requires a valid start instant", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, startsAt: "tomorrow 10am" }).success).toBe(
      false,
    );
  });

  it("rejects an invalid mobile number", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, phone: "12345" }).success).toBe(false);
  });
});
