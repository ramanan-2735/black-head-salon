import { describe, expect, it } from "vitest";
import { barbers } from "@/content/staff";
import { bookingRules } from "@/content/booking-rules";
import { serviceCategories } from "@/content/services";
import { createDemoBookingRepository } from "./booking-repository";
import { localToInstant } from "./time";

const services = serviceCategories.flatMap((category) => category.services);
const open = [{ start: 600, end: 1200 }];

function repo(mode: "instant" | "approval") {
  return createDemoBookingRepository({
    now: () => new Date("2026-10-18T06:00:00Z"),
    services,
    barbers,
    rules: {
      ...bookingRules,
      weeklyHours: { 0: [], 1: open, 2: open, 3: open, 4: open, 5: open, 6: open },
    },
    mode,
  });
}

const request = (phone: string, key: string) => ({
  serviceId: "svc-classic-cut",
  staffId: "barber-sample-1",
  startsAt: localToInstant("2026-10-20", 600).toISOString(),
  name: "Test Customer",
  phone,
  consent: true as const,
  idempotencyKey: key,
});

describe("appointment transitions", () => {
  it("approves a pending request, moving it to confirmed", () => {
    const r = repo("approval");
    const created = r.createBooking(request("9000000001", "transition-approve-1"));
    if (!created.ok) throw new Error("setup failed");

    const result = r.transition(created.appointment.id, "CONFIRMED");
    expect(result.ok && result.appointment.status).toBe("CONFIRMED");
  });

  it("releases the slot once a request is declined", () => {
    const r = repo("approval");
    const created = r.createBooking(request("9000000002", "transition-decline-1"));
    if (!created.ok) throw new Error("setup failed");
    expect(r.createBooking(request("9000000003", "transition-decline-2"))).toEqual({
      ok: false,
      error: "SLOT_TAKEN",
    });

    r.transition(created.appointment.id, "DECLINED");

    const again = r.createBooking(request("9000000003", "transition-decline-3"));
    expect(again.ok).toBe(true);
  });

  it("refuses an invalid move", () => {
    const r = repo("instant");
    const created = r.createBooking(request("9000000004", "transition-invalid-1"));
    if (!created.ok) throw new Error("setup failed");

    expect(r.transition(created.appointment.id, "PENDING")).toEqual({
      ok: false,
      error: "INVALID_TRANSITION",
    });
  });

  it("reports an unknown appointment", () => {
    expect(repo("instant").transition("missing", "CONFIRMED")).toEqual({
      ok: false,
      error: "NOT_FOUND",
    });
  });

  it("lists appointments earliest first", () => {
    const r = repo("instant");
    r.createBooking(request("9000000005", "transition-list-1"));
    const list = r.listAppointments();
    expect(list.length).toBeGreaterThan(0);
    const times = list.map((a) => new Date(a.startsAt).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });
});
