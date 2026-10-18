/** Shared navigation targets. Keep in one place so links never drift between pages. */
export const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/#visit", label: "Visit" },
] as const;

export const BOOK_HREF = "/book";

/** Digits only, with country code, as wa.me expects. Null when the owner hasn't given a number. */
export function whatsappHref(number: string | null, message: string): string | null {
  if (!number) return null;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
