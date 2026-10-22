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
    name: "Marcus",
    serviceIds: ["svc-classic-cut", "svc-skin-fade", "svc-beard-trim", "svc-hot-towel-shave"],
    schedule: {
      0: [{ start: 600, end: 1260 }],
      1: [{ start: 600, end: 1260 }],
      2: [{ start: 600, end: 1260 }],
      3: [{ start: 600, end: 1260 }],
      4: [{ start: 600, end: 1260 }],
      5: [{ start: 600, end: 1260 }],
      6: [{ start: 600, end: 1260 }],
    },
  },
  {
    id: "barber-sample-2",
    name: "Aryan",
    serviceIds: ["svc-classic-cut", "svc-beard-trim", "svc-hot-towel-shave"],
    schedule: {
      0: [{ start: 600, end: 1260 }],
      1: [{ start: 600, end: 1260 }],
      2: [{ start: 600, end: 1260 }],
      3: [{ start: 600, end: 1260 }],
      4: [{ start: 600, end: 1260 }],
      5: [{ start: 600, end: 1260 }],
      6: [{ start: 600, end: 1260 }],
    },
  },
];
