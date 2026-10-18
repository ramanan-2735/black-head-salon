import type { BookingMode } from "@/lib/config";
import type { Service } from "@/lib/repos/types";
import type { Barber } from "@/content/staff";
import { availableStarts, wholeDayBusy, type BusyPeriod, type Window } from "./availability";
import { ACTIVE_STATUSES, canTransition, type AppointmentStatus } from "./status";
import { normalizeIndianMobile, type AvailabilityQuery, type BookingRequest } from "./schemas";
import { formatMinutes, instantToLocal, todayLocal, weekdayOf } from "./time";

export type { AppointmentStatus } from "./status";

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  startsAt: string;
  endsAt: string;
  /** End of the appointment plus the buffer. The slot stays blocked until this time. */
  blockedUntil: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  status: AppointmentStatus;
  idempotencyKey: string;
  createdAt: string;
}

export interface SlotOption {
  startsAt: string;
  label: string;
}

export type BookingError =
  "SERVICE_NOT_BOOKABLE" | "BARBER_NOT_FOUND" | "SLOT_TAKEN" | "DUPLICATE_BOOKING";

export type AvailabilityResult =
  { ok: true; slots: SlotOption[] } | { ok: false; error: BookingError };

export type TransitionResult =
  { ok: true; appointment: Appointment } | { ok: false; error: "NOT_FOUND" | "INVALID_TRANSITION" };

export type CreateResult =
  { ok: true; appointment: Appointment; replayed: boolean } | { ok: false; error: BookingError };

export interface BookingRepository {
  getAvailability(query: AvailabilityQuery): AvailabilityResult;
  createBooking(request: BookingRequest): CreateResult;
  /** Every appointment, earliest first. For the owner dashboard. */
  listAppointments(): Appointment[];
  transition(id: string, to: AppointmentStatus): TransitionResult;
}

export interface BookingRepositoryDeps {
  now: () => Date;
  services: Service[];
  barbers: Barber[];
  rules: {
    granularityMin: number;
    bufferMin: number;
    minNoticeMin: number;
    maxAdvanceDays: number;
    weeklyHours: Record<number, Window[]>;
  };
  mode: BookingMode;
  /** Whole salon-local dates that are closed (holidays). */
  closedDates?: string[];
  seedAppointments?: Appointment[];
}

const ACTIVE = ACTIVE_STATUSES;

/**
 * Demo booking repository. The same rules as production, held in memory so a
 * demo can run without a database. Every check and write happens inside one
 * synchronous call, so two requests can't interleave and take the same slot.
 * The Premium build replaces this with Postgres and a row-level exclusion
 * constraint (planning/05).
 */
export function createDemoBookingRepository(deps: BookingRepositoryDeps): BookingRepository {
  const appointments: Appointment[] = [...(deps.seedAppointments ?? [])];
  const byIdempotencyKey = new Map<string, Appointment>();
  const closed = new Set(deps.closedDates ?? []);

  function bookableService(serviceId: string): Service | undefined {
    return deps.services.find(
      (service) => service.id === serviceId && service.isVisible && service.durationMin !== null,
    );
  }

  function eligibleBarbers(serviceId: string): Barber[] {
    return deps.barbers.filter((barber) => barber.serviceIds.includes(serviceId));
  }

  function busyFor(barberId: string): BusyPeriod[] {
    const own = appointments
      .filter((a) => a.barberId === barberId && ACTIVE.includes(a.status))
      .map((a) => ({ start: new Date(a.startsAt), end: new Date(a.blockedUntil) }));
    return [...own, ...[...closed].map(wholeDayBusy)];
  }

  function startsFor(barber: Barber, service: Service, date: string): Date[] {
    const now = deps.now();
    return availableStarts({
      date,
      durationMin: service.durationMin ?? 0,
      bufferMin: deps.rules.bufferMin,
      salonWindows: deps.rules.weeklyHours[weekdayOf(date)] ?? [],
      staffWindows: barber.schedule[weekdayOf(date)] ?? [],
      busy: busyFor(barber.id),
      now,
      todayLocal: todayLocal(now),
      granularityMin: deps.rules.granularityMin,
      minNoticeMin: deps.rules.minNoticeMin,
      maxAdvanceDays: deps.rules.maxAdvanceDays,
    });
  }

  return {
    getAvailability({ serviceId, staffId, date }) {
      const service = bookableService(serviceId);
      if (!service) return { ok: false, error: "SERVICE_NOT_BOOKABLE" };

      const eligible = eligibleBarbers(serviceId);
      const pool =
        staffId === "any" ? eligible : eligible.filter((barber) => barber.id === staffId);
      if (pool.length === 0) return { ok: false, error: "BARBER_NOT_FOUND" };

      const unique = new Map<number, Date>();
      for (const barber of pool) {
        for (const start of startsFor(barber, service, date)) {
          unique.set(start.getTime(), start);
        }
      }

      const slots = [...unique.values()]
        .sort((a, b) => a.getTime() - b.getTime())
        .map((start) => ({
          startsAt: start.toISOString(),
          label: formatMinutes(instantToLocal(start).minutes),
        }));
      return { ok: true, slots };
    },

    listAppointments() {
      return [...appointments].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      );
    },

    transition(id, to) {
      const appointment = appointments.find((a) => a.id === id);
      if (!appointment) return { ok: false, error: "NOT_FOUND" };
      if (!canTransition(appointment.status, to)) {
        return { ok: false, error: "INVALID_TRANSITION" };
      }
      appointment.status = to;
      return { ok: true, appointment };
    },

    createBooking(request) {
      const existing = byIdempotencyKey.get(request.idempotencyKey);
      if (existing) return { ok: true, appointment: existing, replayed: true };

      const service = bookableService(request.serviceId);
      if (!service || service.durationMin === null) {
        return { ok: false, error: "SERVICE_NOT_BOOKABLE" };
      }

      const eligible = eligibleBarbers(request.serviceId);
      const startsAt = new Date(request.startsAt);
      const date = instantToLocal(startsAt).date;
      const phone = normalizeIndianMobile(request.phone);
      if (!phone) return { ok: false, error: "SLOT_TAKEN" };

      const endsAt = new Date(startsAt.getTime() + service.durationMin * 60_000);
      const blockedUntil = new Date(endsAt.getTime() + deps.rules.bufferMin * 60_000);
      const clashesForPhone = appointments.some(
        (a) =>
          a.phone === phone &&
          ACTIVE.includes(a.status) &&
          startsAt.getTime() < new Date(a.blockedUntil).getTime() &&
          blockedUntil.getTime() > new Date(a.startsAt).getTime(),
      );
      if (clashesForPhone) return { ok: false, error: "DUPLICATE_BOOKING" };

      const candidates =
        request.staffId === "any"
          ? [...eligible].sort((a, b) => countOnDate(a.id, date) - countOnDate(b.id, date))
          : eligible.filter((barber) => barber.id === request.staffId);
      if (candidates.length === 0) return { ok: false, error: "BARBER_NOT_FOUND" };

      const barber = candidates.find((candidate) =>
        startsFor(candidate, service, date).some((start) => start.getTime() === startsAt.getTime()),
      );
      if (!barber) return { ok: false, error: "SLOT_TAKEN" };

      const appointment: Appointment = {
        id: crypto.randomUUID(),
        serviceId: service.id,
        serviceName: service.name,
        barberId: barber.id,
        barberName: barber.name,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        blockedUntil: blockedUntil.toISOString(),
        name: request.name,
        phone,
        email: request.email,
        notes: request.notes,
        status: deps.mode === "instant" ? "CONFIRMED" : "PENDING",
        idempotencyKey: request.idempotencyKey,
        createdAt: deps.now().toISOString(),
      };
      appointments.push(appointment);
      byIdempotencyKey.set(request.idempotencyKey, appointment);
      return { ok: true, appointment, replayed: false };
    },
  };

  function countOnDate(barberId: string, date: string): number {
    return appointments.filter(
      (a) =>
        a.barberId === barberId &&
        ACTIVE.includes(a.status) &&
        instantToLocal(new Date(a.startsAt)).date === date,
    ).length;
  }
}
