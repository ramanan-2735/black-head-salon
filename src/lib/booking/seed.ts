import type { Barber } from "@/content/staff";
import type { Service } from "@/lib/repos/types";
import type { Appointment } from "./booking-repository";
import type { AppointmentStatus } from "./status";
import { localToInstant, addDays, todayLocal } from "./time";

interface SeedSpec {
  /** Days from today in salon time. Negative is the past. */
  dayOffset: number;
  /** Salon-local start, minutes from midnight. */
  startMinutes: number;
  barberId: string;
  serviceId: string;
  status: AppointmentStatus;
  name: string;
}

/*
 * SAMPLE appointments so the owner dashboard isn't empty on first load. Names and
 * numbers are invented and not real customers. Phone numbers use the 9000000000
 * block. Dates are relative to today, so the sample always looks current.
 */
const SPECS: SeedSpec[] = [
  {
    dayOffset: -3,
    startMinutes: 600,
    barberId: "barber-sample-1",
    serviceId: "svc-skin-fade",
    status: "COMPLETED",
    name: "Sample customer C",
  },
  {
    dayOffset: -1,
    startMinutes: 660,
    barberId: "barber-sample-1",
    serviceId: "svc-classic-cut",
    status: "COMPLETED",
    name: "Sample customer A",
  },
  {
    dayOffset: -1,
    startMinutes: 900,
    barberId: "barber-sample-2",
    serviceId: "svc-beard-trim",
    status: "NO_SHOW",
    name: "Sample customer B",
  },
  {
    dayOffset: 0,
    startMinutes: 780,
    barberId: "barber-sample-2",
    serviceId: "svc-classic-cut",
    status: "CONFIRMED",
    name: "Sample customer D",
  },
  {
    dayOffset: 1,
    startMinutes: 600,
    barberId: "barber-sample-1",
    serviceId: "svc-classic-cut",
    status: "CONFIRMED",
    name: "Sample customer E",
  },
  {
    dayOffset: 1,
    startMinutes: 720,
    barberId: "barber-sample-2",
    serviceId: "svc-beard-trim",
    status: "PENDING",
    name: "Sample customer F",
  },
  {
    dayOffset: 3,
    startMinutes: 780,
    barberId: "barber-sample-2",
    serviceId: "svc-classic-cut",
    status: "PENDING",
    name: "Sample customer H",
  },
  {
    dayOffset: 4,
    startMinutes: 960,
    barberId: "barber-sample-1",
    serviceId: "svc-skin-fade",
    status: "PENDING",
    name: "Sample customer G",
  },
];

/** Builds sample appointments from the specs. Each gets a stable id and a unique phone. */
export function buildSeedAppointments(
  now: Date,
  services: Service[],
  barbers: Barber[],
  bufferMin: number,
): Appointment[] {
  const today = todayLocal(now);
  const createdAt = now.toISOString();
  return SPECS.flatMap((spec, index) => {
    const service = services.find((item) => item.id === spec.serviceId);
    const barber = barbers.find((item) => item.id === spec.barberId);
    if (!service || !barber || service.durationMin === null) return [];

    const date = addDays(today, spec.dayOffset);
    const startsAt = localToInstant(date, spec.startMinutes);
    const endsAt = new Date(startsAt.getTime() + service.durationMin * 60_000);
    const blockedUntil = new Date(endsAt.getTime() + bufferMin * 60_000);
    const seq = String(index + 1).padStart(2, "0");
    return [
      {
        id: `seed-${seq}`,
        serviceId: service.id,
        serviceName: service.name,
        barberId: barber.id,
        barberName: barber.name,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        blockedUntil: blockedUntil.toISOString(),
        name: spec.name,
        phone: `+9190000000${seq}`,
        status: spec.status,
        idempotencyKey: `seed-${seq}`,
        createdAt,
      },
    ];
  });
}
