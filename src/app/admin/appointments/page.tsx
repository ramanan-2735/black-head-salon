import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { getBookingRepository } from "@/lib/booking/repository";
import { APPOINTMENT_STATUSES, type AppointmentStatus } from "@/lib/booking/status";
import { cn } from "@/lib/cn";
import { AppointmentRow } from "../appointment-row";

export const metadata: Metadata = { title: "Appointments" };

function isStatus(value: string | string[] | undefined): value is AppointmentStatus {
  return typeof value === "string" && APPOINTMENT_STATUSES.some((status) => status === value);
}

export default function AppointmentsPage({ searchParams }: PageProps<"/admin/appointments">) {
  return (
    <Suspense fallback={<p className="text-bone-500">Loading appointments…</p>}>
      <AppointmentList searchParams={searchParams} />
    </Suspense>
  );
}

/** Reads live demo data and the status filter, so it sits behind Suspense. */
async function AppointmentList({
  searchParams,
}: {
  searchParams: PageProps<"/admin/appointments">["searchParams"];
}) {
  await connection();
  const { status } = await searchParams;
  const active = isStatus(status) ? status : null;

  const all = getBookingRepository().listAppointments();
  const shown = active ? all.filter((appointment) => appointment.status === active) : all;

  return (
    <section aria-labelledby="appointments-title" className="flex flex-col gap-8">
      <h1 id="appointments-title" className="font-display text-4xl font-light">
        Appointments
      </h1>

      <nav aria-label="Filter by status">
        <ul className="flex flex-wrap gap-2 text-xs tracking-[0.12em] uppercase">
          <li>
            <Link
              href="/admin/appointments"
              aria-current={active === null ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center border px-4",
                active === null ? "border-brass-400 text-brass-300" : "border-line text-bone-300",
              )}
            >
              All ({all.length})
            </Link>
          </li>
          {APPOINTMENT_STATUSES.map((value) => {
            const count = all.filter((appointment) => appointment.status === value).length;
            return (
              <li key={value}>
                <Link
                  href={`/admin/appointments?status=${value}`}
                  aria-current={active === value ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center border px-4",
                    active === value
                      ? "border-brass-400 text-brass-300"
                      : "border-line text-bone-300",
                  )}
                >
                  {value.replace("_", "-")} ({count})
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {shown.length === 0 ? (
        <p className="text-bone-300">No appointments with this status.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {shown.map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} />
          ))}
        </ul>
      )}
    </section>
  );
}
