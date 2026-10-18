/**
 * Appointment status machine (planning/05). A booking is PENDING until the owner
 * approves or declines it, or CONFIRMED straight away in instant mode. A confirmed
 * appointment ends as COMPLETED, NO_SHOW or CANCELLED. Declined and cancelled
 * appointments release their slot.
 */
export const APPOINTMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "DECLINED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

/** Statuses that hold a slot. Anything else frees it. */
export const ACTIVE_STATUSES: readonly AppointmentStatus[] = ["PENDING", "CONFIRMED"];

const transitions: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "DECLINED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "NO_SHOW", "CANCELLED"],
  DECLINED: [],
  CANCELLED: [],
  COMPLETED: [],
  NO_SHOW: [],
};

export function canTransition(from: AppointmentStatus, to: AppointmentStatus): boolean {
  return transitions[from].includes(to);
}

export function allowedTransitions(from: AppointmentStatus): readonly AppointmentStatus[] {
  return transitions[from];
}
