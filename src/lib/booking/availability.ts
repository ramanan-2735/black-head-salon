import { addDays, dayNumber, localToInstant } from "./time";

/** A window of salon-local minutes from midnight, e.g. 600–1200 = 10:00–20:00. */
export interface Window {
  start: number;
  end: number;
}

/** A period the calendar can't use. Appointments already include their buffer. */
export interface BusyPeriod {
  start: Date;
  end: Date;
}

export interface AvailabilityInput {
  date: string;
  durationMin: number;
  bufferMin: number;
  /** Salon opening windows for this weekday. Empty means closed. */
  salonWindows: Window[];
  /** The barber's own working windows for this weekday. Empty means not working. */
  staffWindows: Window[];
  busy: BusyPeriod[];
  now: Date;
  todayLocal: string;
  granularityMin: number;
  minNoticeMin: number;
  maxAdvanceDays: number;
}

/** Overlap of two window lists. Both lists are assumed to be non-overlapping. */
export function intersectWindows(a: Window[], b: Window[]): Window[] {
  const result: Window[] = [];
  for (const first of a) {
    for (const second of b) {
      const start = Math.max(first.start, second.start);
      const end = Math.min(first.end, second.end);
      if (start < end) result.push({ start, end });
    }
  }
  return result;
}

/**
 * Returns every bookable start for one barber on one day. A start is bookable when
 * the service fits inside working hours, the appointment plus its trailing buffer
 * doesn't touch a busy period, it respects minimum notice, and the day is within
 * the advance window. Results are UTC instants, sorted ascending.
 */
export function availableStarts(input: AvailabilityInput): Date[] {
  const daysAhead = dayNumber(input.date) - dayNumber(input.todayLocal);
  if (daysAhead < 0 || daysAhead > input.maxAdvanceDays) return [];

  const windows = intersectWindows(input.salonWindows, input.staffWindows);
  const earliest = input.now.getTime() + input.minNoticeMin * 60_000;
  const starts: Date[] = [];

  for (const window of windows) {
    for (
      let minute = window.start;
      minute + input.durationMin <= window.end;
      minute += input.granularityMin
    ) {
      const start = localToInstant(input.date, minute);
      if (start.getTime() < earliest) continue;

      const blockedUntil = start.getTime() + (input.durationMin + input.bufferMin) * 60_000;
      const clashes = input.busy.some(
        (period) => start.getTime() < period.end.getTime() && blockedUntil > period.start.getTime(),
      );
      if (!clashes) starts.push(start);
    }
  }

  return starts.sort((a, b) => a.getTime() - b.getTime());
}

/** Busy periods that block a whole salon-local day, used for closures and holidays. */
export function wholeDayBusy(date: string): BusyPeriod {
  return { start: localToInstant(date, 0), end: localToInstant(addDays(date, 1), 0) };
}
