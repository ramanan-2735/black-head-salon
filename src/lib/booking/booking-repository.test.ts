import { describe, expect, it } from "vitest";
import type { Barber } from "@/content/staff";
import type { Service } from "@/lib/repos/types";
import { createDemoBookingRepository } from "./booking-repository";
import type { BookingRequest } from "./schemas";
import { localToInstant } from "./time";

const service = (overrides: Partial<Service> & Pick<Service, "id">): Service => ({
  slug: overrides.id,
  name: overrides.id,
  description: "",
  priceInPaise: 30000,
  isFromPrice: false,
  durationMin: 45,
  isFeatured: false,
  isVisible: true,
  ...overrides,
});

const services = [service({ id: "cut" }), service({ id: "shave", durationMin: null })];

const open = [{ start: 600, end: 1200 }];
const barbers: Barber[] = [
  {
    id: "a",
    name: "A",
    serviceIds: ["cut"],
    schedule: { 1: open, 2: open, 3: open, 4: open, 5: open, 6: open, 0: [] },
  },
  {
    id: "b",
    name: "B",
    serviceIds: ["cut"],
    schedule: { 1: open, 2: open, 3: open, 4: open, 5: open, 6: open, 0: [] },
  },
];

const NOW = new Date("2026-10-18T06:00:00Z");
const DAY = "2026-10-20";
const TEN = localToInstant(DAY, 600).toISOString();
const HALF_PAST_TEN = localToInstant(DAY, 630).toISOString();

const request = (overrides: Partial<BookingRequest> = {}): BookingRequest => ({
  serviceId: "cut",
  staffId: "a",
  startsAt: TEN,
  name: "Test Customer",
  phone: "9876543210",
  consent: true,
  idempotencyKey: `key-${Math.random()}`,
  ...overrides,
});

const repo = (mode: "instant" | "approval" = "instant", closedDates: string[] = []) =>
  createDemoBookingRepository({
    now: () => NOW,
    services,
    barbers,
    rules: {
      granularityMin: 15,
      bufferMin: 10,
      minNoticeMin: 60,
      maxAdvanceDays: 30,
      weeklyHours: { 0: [], 1: open, 2: open, 3: open, 4: open, 5: open, 6: open },
    },
    mode,
    closedDates,
  });

describe("getAvailability", () => {
  it("lists slots for a bookable service", () => {
    const result = repo().getAvailability({ serviceId: "cut", staffId: "a", date: DAY });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.slots[0]).toEqual({ startsAt: TEN, label: "10:00" });
  });

  it("refuses a service without a duration", () => {
    expect(repo().getAvailability({ serviceId: "shave", staffId: "any", date: DAY })).toEqual({
      ok: false,
      error: "SERVICE_NOT_BOOKABLE",
    });
  });

  it("returns no slots on a closed day", () => {
    const result = repo("instant", [DAY]).getAvailability({
      serviceId: "cut",
      staffId: "any",
      date: DAY,
    });
    expect(result).toEqual({ ok: true, slots: [] });
  });
});

describe("createBooking", () => {
  it("confirms immediately in instant mode", () => {
    const result = repo("instant").createBooking(request());
    expect(result.ok && result.appointment.status).toBe("CONFIRMED");
  });

  it("stores a pending request in approval mode and still blocks the slot", () => {
    const r = repo("approval");
    const first = r.createBooking(request({ phone: "9000000001" }));
    expect(first.ok && first.appointment.status).toBe("PENDING");
    expect(r.createBooking(request({ phone: "9000000002" }))).toEqual({
      ok: false,
      error: "SLOT_TAKEN",
    });
  });

  it("rejects a second booking for the same barber and slot", () => {
    const r = repo();
    r.createBooking(request({ phone: "9000000001" }));
    expect(r.createBooking(request({ phone: "9000000002" }))).toEqual({
      ok: false,
      error: "SLOT_TAKEN",
    });
  });

  it("returns the original booking when the same idempotency key is replayed", () => {
    const r = repo();
    const body = request({ idempotencyKey: "same-key-123" });
    const first = r.createBooking(body);
    const second = r.createBooking(body);
    expect(first.ok && second.ok && second.replayed).toBe(true);
    expect(first.ok && second.ok && second.appointment.id).toBe(first.ok && first.appointment.id);
  });

  it("assigns 'any' to a free barber when the first is busy", () => {
    const r = repo();
    r.createBooking(request({ staffId: "a", phone: "9000000001" }));
    const result = r.createBooking(request({ staffId: "any", startsAt: TEN, phone: "9000000002" }));
    expect(result.ok && result.appointment.barberId).toBe("b");
  });

  it("blocks a second booking for the same phone at an overlapping time", () => {
    const r = repo();
    r.createBooking(request({ staffId: "a", phone: "9000000001" }));
    expect(
      r.createBooking(request({ staffId: "b", startsAt: HALF_PAST_TEN, phone: "+91 90000 00001" })),
    ).toEqual({
      ok: false,
      error: "DUPLICATE_BOOKING",
    });
  });

  it("rejects a slot that isn't offered, such as outside hours", () => {
    const early = localToInstant(DAY, 300).toISOString();
    expect(repo().createBooking(request({ startsAt: early }))).toEqual({
      ok: false,
      error: "SLOT_TAKEN",
    });
  });
});
