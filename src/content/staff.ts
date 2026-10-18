import type { Window } from "@/lib/booking/availability";

export interface Barber {
  id: string;
  name: string;
  /** Services this barber performs. Only these can be booked with them. */
  serviceIds: string[];
  /** Working windows per weekday (0 = Sunday). Empty means not working that day. */
  schedule: Record<number, Window[]>;
}

/*
 * SAMPLE barbers. Names are placeholders ("Sample barber") and must be replaced
 * with the owner's real team, with their consent, before production.
 */
export const barbers: Barber[] = [
  {
    id: "barber-sample-1",
    name: "Sample barber 1",
    serviceIds: ["svc-classic-cut", "svc-skin-fade", "svc-beard-trim"],
    schedule: {
      0: [],
      1: [{ start: 600, end: 1200 }],
      2: [{ start: 600, end: 1200 }],
      3: [{ start: 600, end: 1200 }],
      4: [{ start: 600, end: 1200 }],
      5: [{ start: 600, end: 1200 }],
      6: [{ start: 600, end: 1200 }],
    },
  },
  {
    id: "barber-sample-2",
    name: "Sample barber 2",
    serviceIds: ["svc-classic-cut", "svc-beard-trim"],
    schedule: {
      0: [],
      1: [{ start: 720, end: 1200 }],
      2: [{ start: 720, end: 1200 }],
      3: [{ start: 720, end: 1200 }],
      4: [{ start: 720, end: 1200 }],
      5: [{ start: 720, end: 1200 }],
      6: [],
    },
  },
];
