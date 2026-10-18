import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { getBookingRepository } from "@/lib/booking/repository";
import { summariseAppointments } from "@/lib/booking/dashboard";
import { AppointmentRow } from "./appointment-row";

export const metadata: Metadata = { title: "Overview" };

function Stat({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="flex flex-col gap-2 border border-line bg-ink-900 p-6">
      <p className="text-xs tracking-[0.14em] text-bone-500 uppercase">{label}</p>
      <p className="font-display text-5xl font-light tabular-nums">{value}</p>
      <p className="text-xs text-bone-500">{note}</p>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <Suspense fallback={<p className="text-bone-500">Loading overview…</p>}>
      <Overview />
    </Suspense>
  );
}

/** Reads live demo data, so it sits behind Suspense and renders per request. */
async function Overview() {
  await connection();
  const summary = summariseAppointments(getBookingRepository().listAppointments(), new Date());

  return (
    <>
      <section aria-labelledby="stats-title" className="flex flex-col gap-6">
        <h1 id="stats-title" className="font-display text-4xl font-light">
          Overview
        </h1>
        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="Today" value={summary.today.length} note="Standing bookings today" />
          <Stat label="Pending" value={summary.pending.length} note="Waiting for your approval" />
          <Stat label="Next 7 days" value={summary.nextSevenDays} note="Confirmed or pending" />
          <Stat label="No-shows" value={summary.noShowsLast30Days} note="Last 30 days" />
        </div>
        <div className="flex flex-col gap-2 text-sm text-bone-300">
          <p className="text-xs tracking-[0.14em] text-bone-500 uppercase">Popular services</p>
          {summary.popularServices.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <ol className="flex flex-wrap gap-x-8 gap-y-2">
              {summary.popularServices.map((service) => (
                <li key={service.serviceName}>
                  {service.serviceName} · {service.count}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section aria-labelledby="pending-title" className="flex flex-col gap-6">
        <h2 id="pending-title" className="font-display text-3xl font-light">
          Requests waiting for you
        </h2>
        {summary.pending.length === 0 ? (
          <p className="text-bone-300">No requests waiting. Nothing to approve right now.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {summary.pending.map((appointment) => (
              <AppointmentRow key={appointment.id} appointment={appointment} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="today-title" className="flex flex-col gap-6">
        <h2 id="today-title" className="font-display text-3xl font-light">
          Today
        </h2>
        {summary.today.length === 0 ? (
          <p className="text-bone-300">No appointments left today.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {summary.today.map((appointment) => (
              <AppointmentRow key={appointment.id} appointment={appointment} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
