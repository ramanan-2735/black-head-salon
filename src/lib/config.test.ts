import { describe, expect, it } from "vitest";
import { parseSiteConfig } from "./config";

describe("parseSiteConfig", () => {
  it("defaults to premium demo with instant booking when no flags are set", () => {
    expect(parseSiteConfig({})).toEqual({
      tier: "premium",
      isPremium: true,
      isDemo: true,
      bookingMode: "instant",
    });
  });

  it("reads the professional tier with demo off and approval booking", () => {
    expect(
      parseSiteConfig({
        NEXT_PUBLIC_SITE_TIER: "professional",
        NEXT_PUBLIC_DEMO_MODE: "false",
        NEXT_PUBLIC_BOOKING_MODE: "approval",
      }),
    ).toEqual({
      tier: "professional",
      isPremium: false,
      isDemo: false,
      bookingMode: "approval",
    });
  });

  it("rejects an unknown tier instead of falling back", () => {
    expect(() => parseSiteConfig({ NEXT_PUBLIC_SITE_TIER: "gold" })).toThrow();
  });
});
