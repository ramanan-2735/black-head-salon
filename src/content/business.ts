import type { Business } from "@/lib/repos/types";

/*
 * Business facts for the owner to confirm. Every null is shown as an explicit
 * "to be confirmed" placeholder, and the floating call and WhatsApp buttons stay
 * hidden until a number is set. Do not fill these with guesses: a wrong phone
 * number sends real customers to a stranger (planning/08-owner-information-checklist.md).
 *
 * To finish the handover, replace the nulls with the owner's details:
 * - phone / whatsapp: digits with country code, e.g. "+91 98765 43210"
 * - hours: { 1: { open: "10:00", close: "20:00" }, ..., 0: null } (0 = Sunday, null = closed)
 */
export const business: Business = {
  name: "Black Head Salon",
  address: "Krishna Arcade CHS, Sector 5, New Panvel East, Panvel, Maharashtra 410206",
  phone: "+91 99677 95720",
  whatsapp: "+91 99677 95720",
  mapsUrl: "https://maps.google.com/?q=Krishna+Arcade+CHS+Sector+5+New+Panvel+East+Panvel+Maharashtra+410206",
  instagram: "blackheadsalon",
  hours: {
    1: { open: "10:00", close: "21:00" }, // Mon
    2: { open: "10:00", close: "21:00" }, // Tue
    3: { open: "10:00", close: "21:00" }, // Wed
    4: { open: "10:00", close: "21:00" }, // Thu
    5: { open: "10:00", close: "21:00" }, // Fri
    6: { open: "09:30", close: "21:30" }, // Sat
    0: { open: "09:30", close: "21:30" }, // Sun
  },
  timezone: "Asia/Kolkata",
  currency: "INR",
};
