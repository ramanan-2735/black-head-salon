import { barbers } from "@/content/staff";
import { bookingRules } from "@/content/booking-rules";
import { serviceCategories } from "@/content/services";
import { config } from "@/lib/config";
import { createDemoBookingRepository, type BookingRepository } from "./booking-repository";
import { buildSeedAppointments } from "./seed";
import { addDays, todayLocal } from "./time";

let instance: BookingRepository | null = null;

/**
 * The booking repository used by the API routes and the owner dashboard. In demo
 * mode it runs in memory with sample data: a few past and upcoming appointments,
 * and a closed day in two days. Production swaps in a Postgres-backed implementation.
 *
 * Created on first use rather than at import. Reading the clock at import time
 * would make the build treat it as request-time data.
 */
export function getBookingRepository(): BookingRepository {
  if (instance) return instance;

  const now = new Date();
  const services = serviceCategories.flatMap((category) => category.services);
  instance = createDemoBookingRepository({
    now: () => new Date(),
    services,
    barbers,
    rules: bookingRules,
    mode: config.bookingMode,
    closedDates: [addDays(todayLocal(now), 2)],
    seedAppointments: buildSeedAppointments(now, services, barbers, bookingRules.bufferMin),
  });
  return instance;
}
