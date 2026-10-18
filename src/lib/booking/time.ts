/**
 * Salon-local time helpers. The salon is in India (Asia/Kolkata, UTC+05:30,
 * no daylight saving), so a fixed offset is exact and avoids a timezone
 * library. Times are stored as instants; rules are evaluated in salon-local
 * dates and minutes from midnight.
 */

export const SALON_OFFSET_MIN = 330;
const DAY_MS = 86_400_000;

function parseDate(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

/** Converts a salon-local date and minutes-from-midnight into a UTC instant. */
export function localToInstant(date: string, minutes: number): Date {
  const { year, month, day } = parseDate(date);
  return new Date(Date.UTC(year, month - 1, day) + (minutes - SALON_OFFSET_MIN) * 60_000);
}

/** Converts a UTC instant into the salon-local date and minutes from midnight. */
export function instantToLocal(instant: Date): { date: string; minutes: number } {
  const shifted = new Date(instant.getTime() + SALON_OFFSET_MIN * 60_000);
  return {
    date: shifted.toISOString().slice(0, 10),
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

/** Whole days since the epoch for a salon-local date. Used for day arithmetic. */
export function dayNumber(date: string): number {
  const { year, month, day } = parseDate(date);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

export function addDays(date: string, days: number): string {
  return new Date((dayNumber(date) + days) * DAY_MS).toISOString().slice(0, 10);
}

/** 0 = Sunday … 6 = Saturday, in salon-local time. */
export function weekdayOf(date: string): number {
  return new Date(dayNumber(date) * DAY_MS).getUTCDay();
}

export function todayLocal(now: Date): string {
  return instantToLocal(now).date;
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}
