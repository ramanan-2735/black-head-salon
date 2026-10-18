import { describe, expect, it } from "vitest";
import type { Appointment } from "./booking-repository";
import type { AppointmentStatus } from "./status";
import { summariseAppointments } from "./dashboard";
import { localToInstant } from "./time";

const NOW = new Date("2026-10-18T06:00:00Z"); // 11:30 IST on 18 Oct

function appt(
  id: string,
  dayOffset: number,
  minutes: number,
  status: AppointmentStatus,
  serviceName = "Classic Cut",
): Appointment {
  const date = new Date(Date.UTC(2026, 9, 18 + dayOffset)).toISOString().slice(0, 10);
  const start = localToInstant(date, minutes);
  return {
    id,
    serviceId: "svc",
    serviceName,
    barberId: "b",
    barberName: "B",
    startsAt: start.toISOString(),
    endsAt: new Date(start.getTime() + 45 * 60_000).toISOString(),
    blockedUntil: new Date(start.getTime() + 55 * 60_000).toISOString(),
    name: "Customer",
    phone: "+919000000000",
    status,
    idempotencyKey: id,
    createdAt: NOW.toISOString(),
  };
}

describe("summariseAppointments", () => {
  const list = [
    appt("today-late", 0, 900, "CONFIRMED"),
    appt("today-early", 0, 780, "COMPLETED"),
    appt("today-declined", 0, 960, "DECLINED"),
    appt("pending-tomorrow", 1, 600, "PENDING", "Beard Trim"),
    appt("pending-today", 0, 1000, "PENDING", "Beard Trim"),
    appt("week-ahead", 5, 600, "CONFIRMED", "Skin Fade"),
    appt("far-ahead", 12, 600, "CONFIRMED", "Skin Fade"),
    appt("no-show-recent", -3, 600, "NO_SHOW"),
    appt("no-show-old", -45, 600, "NO_SHOW"),
  ];

  it("lists today's standing appointments, earliest first, without declined ones", () => {
    const { today } = summariseAppointments(list, NOW);
    expect(today.map((a) => a.id)).toEqual(["today-early", "today-late", "pending-today"]);
  });

  it("collects pending requests across all days", () => {
    const { pending } = summariseAppointments(list, NOW);
    expect(pending.map((a) => a.id)).toEqual(["pending-today", "pending-tomorrow"]);
  });

  it("counts active appointments in the next seven days, not today or later", () => {
    // pending-tomorrow and week-ahead count. far-ahead is outside the window.
    expect(summariseAppointments(list, NOW).nextSevenDays).toBe(2);
  });

  it("counts no-shows only in the last 30 days", () => {
    expect(summariseAppointments(list, NOW).noShowsLast30Days).toBe(1);
  });

  it("ranks popular services by standing appointments", () => {
    const { popularServices } = summariseAppointments(list, NOW);
    // Classic Cut: two standing today, plus both no-shows. Declined bookings don't count.
    expect(popularServices[0]).toEqual({ serviceName: "Classic Cut", count: 4 });
  });
});
