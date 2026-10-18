import { z } from "zod";

/**
 * Normalises an Indian mobile number to E.164 (+91XXXXXXXXXX). Accepts spaces,
 * dashes, a leading 0 or +91. Returns null if it isn't a valid 10-digit mobile
 * starting with 6–9.
 */
export function normalizeIndianMobile(raw: string): string | null {
  let digits = raw.replace(/[\s-]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

export const availabilityQuerySchema = z.object({
  serviceId: z.string().min(1),
  staffId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const bookingRequestSchema = z.object({
  serviceId: z.string().min(1),
  staffId: z.string().min(1),
  /** The exact UTC instant the customer picked from the slot list. */
  startsAt: z.iso.datetime({ offset: true }),
  name: z.string().trim().min(2, "Enter your full name.").max(60),
  phone: z
    .string()
    .refine(
      (value) => normalizeIndianMobile(value) !== null,
      "Enter a valid 10-digit mobile number.",
    ),
  email: z.email("Enter a valid email address.").max(120).optional(),
  notes: z.string().trim().max(300).optional(),
  consent: z.literal(true, { error: "Please confirm you agree to the privacy notice." }),
  idempotencyKey: z.string().min(8).max(80),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
