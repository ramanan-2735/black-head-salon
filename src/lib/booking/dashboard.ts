import type { Appointment } from "./booking-repository";
import { ACTIVE_STATUSES, type AppointmentStatus } from "./status";
import { dayNumber, instantToLocal, todayLocal } from "./time";

export interface DashboardSummary {
  /** Today's appointments that still stand (not declined or cancelled), earliest first. */
  today: Appointment[];
  /** Requests waiting for the owner, earliest first. */
  pending: Appointment[];
  /** Active appointments in the next seven days, after today. */
  nextSevenDays: number;
  /** No-shows in the last 30 days. */
  noShowsLast30Days: number;
  /** Top services by number of standing appointments. */
  popularServices: { serviceName: string; count: number }[];
}

const NOT_STANDING: AppointmentStatus[] = ["DECLINED", "CANCELLED"];

function localDateOf(appointment: Appointment): string {
  return instantToLocal(new Date(appointment.startsAt)).date;
}

function byStart(a: Appointment, b: Appointment): number {
  return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
}

/** Turns the appointment list into the figures the owner dashboard shows. Pure, so it's testable. */
export function summariseAppointments(appointments: Appointment[], now: Date): DashboardSummary {
  const today = todayLocal(now);
  const todayNumber = dayNumber(today);
  const standing = appointments.filter((a) => !NOT_STANDING.includes(a.status));

  const popularCounts = new Map<string, number>();
  for (const appointment of standing) {
    popularCounts.set(
      appointment.serviceName,
      (popularCounts.get(appointment.serviceName) ?? 0) + 1,
    );
  }

  return {
    today: standing.filter((a) => localDateOf(a) === today).sort(byStart),
    pending: appointments.filter((a) => a.status === "PENDING").sort(byStart),
    nextSevenDays: standing.filter((a) => {
      const ahead = dayNumber(localDateOf(a)) - todayNumber;
      return ACTIVE_STATUSES.includes(a.status) && ahead > 0 && ahead <= 7;
    }).length,
    noShowsLast30Days: appointments.filter((a) => {
      const ago = todayNumber - dayNumber(localDateOf(a));
      return a.status === "NO_SHOW" && ago >= 0 && ago <= 30;
    }).length,
    popularServices: [...popularCounts]
      .map(([serviceName, count]) => ({ serviceName, count }))
      .sort((a, b) => b.count - a.count || a.serviceName.localeCompare(b.serviceName))
      .slice(0, 3),
  };
}
