import { describe, expect, it } from "vitest";
import { hoursLines } from "./hours";

describe("hoursLines", () => {
  it("returns null when hours are not set", () => {
    expect(hoursLines(null)).toBeNull();
  });

  it("lists Monday first and marks closed days", () => {
    const lines = hoursLines({
      0: null,
      1: { open: "10:00", close: "20:00" },
      2: { open: "10:00", close: "20:00" },
      3: { open: "10:00", close: "20:00" },
      4: { open: "10:00", close: "20:00" },
      5: { open: "10:00", close: "20:00" },
      6: { open: "10:00", close: "18:00" },
    });
    expect(lines).toEqual([
      { day: "Mon", value: "10:00–20:00" },
      { day: "Tue", value: "10:00–20:00" },
      { day: "Wed", value: "10:00–20:00" },
      { day: "Thu", value: "10:00–20:00" },
      { day: "Fri", value: "10:00–20:00" },
      { day: "Sat", value: "10:00–18:00" },
      { day: "Sun", value: "Closed" },
    ]);
  });
});
