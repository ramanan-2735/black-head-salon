const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const salonDateTime = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

const salonTime = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

/** Money is stored in paise. Null means the owner hasn't set a price. */
export function formatPrice(paise: number | null, isFromPrice: boolean): string {
  if (paise === null) return "Price on request";
  const price = inr.format(paise / 100);
  return isFromPrice ? `From ${price}` : price;
}

export function formatDuration(minutes: number | null): string | null {
  return minutes === null ? null : `${minutes} min`;
}

/** An instant as salon time, e.g. "Mon, 19 Oct, 10:00". */
export function formatSalonDateTime(instant: string): string {
  return salonDateTime.format(new Date(instant));
}

/** The time of day only, in salon time, e.g. "10:00". */
export function formatSalonTime(instant: string): string {
  return salonTime.format(new Date(instant));
}
