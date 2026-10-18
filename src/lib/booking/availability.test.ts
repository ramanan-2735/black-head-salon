import { describe, expect, it } from "vitest";
import {
  availableStarts,
  intersectWindows,
  wholeDayBusy,
  type AvailabilityInput,
} from "./availability";
import { instantToLocal, localToInstant } from "./time";

const base: AvailabilityInput = {
  date: "2026-10-20",
  durationMin: 45,
  bufferMin: 10,
  salonWindows: [{ start: 600, end: 1200 }], // 10:00–20:00
  staffWindows: [{ start: 600, end: 1200 }],
  busy: [],
  now: new Date("2026-10-18T06:00:00Z"),
  todayLocal: "2026-10-18",
  granularityMin: 15,
  minNoticeMin: 60,
  maxAdvanceDays: 30,
};

const localTimes = (starts: Date[]) => starts.map((s) => instantToLocal(s).minutes);

describe("availableStarts", () => {
  it("offers every granular start that fits the working day", () => {
    const starts = availableStarts(base);
    expect(localTimes(starts)[0]).toBe(600);
    // Last 45-minute service must end by 20:00, so the final start is 19:15.
    expect(localTimes(starts).at(-1)).toBe(1155);
  });

  it("returns starts in ascending order", () => {
    const times = availableStarts(base).map((s) => s.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it("respects the barber's own hours", () => {
    const starts = availableStarts({ ...base, staffWindows: [{ start: 720, end: 900 }] });
    expect(localTimes(starts)[0]).toBe(720);
    expect(localTimes(starts).at(-1)).toBe(855);
  });

  it("blocks a start whose service plus buffer would hit an existing appointment", () => {
    // Existing 10:00 appointment, 45 min + 10 min buffer, occupies until 10:55.
    const busy = [
      {
        start: localToInstant("2026-10-20", 600),
        end: localToInstant("2026-10-20", 655),
      },
    ];
    const times = localTimes(availableStarts({ ...base, busy }));
    expect(times).not.toContain(600);
    expect(times).not.toContain(645);
    expect(times).toContain(660);
  });

  it("returns nothing on a closed day", () => {
    expect(availableStarts({ ...base, salonWindows: [] })).toEqual([]);
  });

  it("returns nothing when the whole day is blocked", () => {
    expect(availableStarts({ ...base, busy: [wholeDayBusy("2026-10-20")] })).toEqual([]);
  });

  it("enforces minimum notice", () => {
    // now is 11:30 IST on the same day, minimum notice is 60 minutes, so 12:30 is the first start.
    const now = localToInstant("2026-10-20", 690);
    const starts = availableStarts({ ...base, now, todayLocal: "2026-10-20" });
    expect(localTimes(starts)[0]).toBe(750);
  });

  it("refuses dates in the past", () => {
    expect(availableStarts({ ...base, date: "2026-10-17" })).toEqual([]);
  });

  it("refuses dates beyond the advance window", () => {
    expect(availableStarts({ ...base, date: "2026-12-01", maxAdvanceDays: 30 })).toEqual([]);
  });

  it("evaluates the day in salon time, not UTC", () => {
    // 20:00 IST on 20 Oct is 14:30 UTC. The first slot must still be 10:00 IST on 20 Oct.
    const starts = availableStarts(base);
    expect(starts[0].toISOString()).toBe("2026-10-20T04:30:00.000Z");
  });
});

describe("intersectWindows", () => {
  it("keeps only the overlapping minutes", () => {
    expect(intersectWindows([{ start: 600, end: 1200 }], [{ start: 720, end: 1440 }])).toEqual([
      { start: 720, end: 1200 },
    ]);
  });

  it("returns nothing when windows don't overlap", () => {
    expect(intersectWindows([{ start: 600, end: 700 }], [{ start: 800, end: 900 }])).toEqual([]);
  });
});
