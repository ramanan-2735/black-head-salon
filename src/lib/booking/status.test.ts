import { describe, expect, it } from "vitest";
import { ACTIVE_STATUSES, allowedTransitions, canTransition } from "./status";

describe("appointment status machine", () => {
  it("lets the owner approve or decline a pending request", () => {
    expect(canTransition("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransition("PENDING", "DECLINED")).toBe(true);
  });

  it("lets a confirmed appointment end as completed, no-show or cancelled", () => {
    expect(allowedTransitions("CONFIRMED")).toEqual(["COMPLETED", "NO_SHOW", "CANCELLED"]);
  });

  it("treats final states as terminal", () => {
    for (const final of ["DECLINED", "CANCELLED", "COMPLETED", "NO_SHOW"] as const) {
      expect(allowedTransitions(final)).toEqual([]);
    }
  });

  it("refuses a move that skips a step, such as pending to completed", () => {
    expect(canTransition("PENDING", "COMPLETED")).toBe(false);
    expect(canTransition("CONFIRMED", "PENDING")).toBe(false);
  });

  it("holds slots only while pending or confirmed", () => {
    expect([...ACTIVE_STATUSES]).toEqual(["PENDING", "CONFIRMED"]);
  });
});
