import type { Business } from "@/lib/repos/types";

const MONDAY_FIRST = [1, 2, 3, 4, 5, 6, 0];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface HoursLine {
  day: string;
  value: string;
}

/** Monday-first rows for display. Null when the owner hasn't set hours yet. */
export function hoursLines(hours: Business["hours"]): HoursLine[] | null {
  if (!hours) return null;
  return MONDAY_FIRST.map((weekday) => {
    const range = hours[weekday];
    return {
      day: DAY_NAMES[weekday],
      value: range ? `${range.open}–${range.close}` : "Closed",
    };
  });
}
