"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getBookingRepository } from "@/lib/booking/repository";
import { APPOINTMENT_STATUSES } from "@/lib/booking/status";
import { config } from "@/lib/config";

const statusInput = z.object({
  id: z.string().min(1),
  status: z.enum(APPOINTMENT_STATUSES),
});

/**
 * Moves an appointment to a new status. The owner dashboard has no login in demo
 * mode. The Premium build adds authentication and checks the session here too.
 */
export async function setAppointmentStatus(
  id: string,
  status: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!config.isDemo) return { ok: false, error: "NOT_AVAILABLE" };

  const parsed = statusInput.safeParse({ id, status });
  if (!parsed.success) return { ok: false, error: "INVALID_INPUT" };

  const result = getBookingRepository().transition(parsed.data.id, parsed.data.status);
  revalidatePath("/admin", "layout");
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}
