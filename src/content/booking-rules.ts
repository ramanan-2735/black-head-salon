import type { Window } from "@/lib/booking/availability";

/*
 * SAMPLE booking rules for the demo. Opening hours, notice periods and buffers are
 * placeholders until the owner confirms them (planning/08 §Appointment rules).
 * Times are salon-local minutes from midnight. Index 0 = Sunday.
 */
export const bookingRules = {
  granularityMin: 15,
  bufferMin: 10,
  minNoticeMin: 60,
  maxAdvanceDays: 30,
  /** Sample hours: Monday to Saturday 10:00–20:00, closed Sunday. */
  weeklyHours: {
    0: [],
    1: [{ start: 600, end: 1200 }],
    2: [{ start: 600, end: 1200 }],
    3: [{ start: 600, end: 1200 }],
    4: [{ start: 600, end: 1200 }],
    5: [{ start: 600, end: 1200 }],
    6: [{ start: 600, end: 1200 }],
  } satisfies Record<number, Window[]>,
};
