import { describe, expect, it } from "vitest";
import { instagramHref, telHref, whatsappHref } from "./site-nav";

describe("telHref", () => {
  it("returns null when no number is set", () => {
    expect(telHref(null)).toBeNull();
  });

  it("keeps the country code and drops spaces and dashes", () => {
    expect(telHref("+91 98765-43210")).toBe("tel:+919876543210");
  });
});

describe("whatsappHref", () => {
  it("encodes the booking message into the link", () => {
    expect(whatsappHref("+91 98765 43210", "Hi there")).toBe(
      "https://wa.me/919876543210?text=Hi%20there",
    );
  });
});

describe("instagramHref", () => {
  it("builds the profile link with or without the @", () => {
    expect(instagramHref("blackheadsalon")).toBe("https://www.instagram.com/blackheadsalon/");
    expect(instagramHref("@blackheadsalon")).toBe("https://www.instagram.com/blackheadsalon/");
  });
});
