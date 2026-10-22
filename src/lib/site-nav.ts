/** Shared navigation targets. Keep in one place so links never drift between pages. */
export const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/#visit", label: "Visit" },
] as const;

export const BOOK_HREF = "/book";

/** Opening line for WhatsApp, so the customer only has to press send. */
export const WHATSAPP_BOOKING_MESSAGE =
  "Hello Black Head Salon, I'd like to book an appointment. What times are free?";

/** Digits only, with country code, as wa.me expects. Null when the owner hasn't given a number. */
export function whatsappHref(number: string | null, message: string): string | null {
  if (!number) return null;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

/** A tel: link. Keeps the leading + and drops spaces, dashes and brackets. Null when unset. */
export function telHref(number: string | null): string | null {
  if (!number) return null;
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}

/** Instagram profile for a handle. Accepts the handle with or without the @. */
export function instagramHref(handle: string): string {
  return `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
}
