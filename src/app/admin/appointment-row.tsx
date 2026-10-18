import type { Appointment } from "@/lib/booking/booking-repository";
import type { AppointmentStatus } from "@/lib/booking/status";
import { cn } from "@/lib/cn";
import { formatSalonDateTime } from "@/lib/format";
import { StatusActions } from "./status-actions";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW: "No-show",
};

const STATUS_TONE: Record<AppointmentStatus, string> = {
  PENDING: "border-brass-400 text-brass-300",
  CONFIRMED: "border-ok text-ok",
  DECLINED: "border-line text-bone-500",
  CANCELLED: "border-line text-bone-500",
  COMPLETED: "border-bone-300 text-bone-300",
  NO_SHOW: "border-err text-err",
};

/** One appointment with its status and the moves the owner can make. Text labels, not colour alone. */
export function AppointmentRow({ appointment }: { appointment: Appointment }) {
  return (
    <li className="flex flex-col gap-4 border border-line bg-ink-900 p-5 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-1">
        <p className="font-display text-xl font-light">
          {formatSalonDateTime(appointment.startsAt)}
        </p>
        <p className="text-sm text-bone-100">
          {appointment.serviceName} with {appointment.barberName}
        </p>
        <p className="text-sm text-bone-300">
          {appointment.name} · {appointment.phone}
        </p>
        {appointment.notes && <p className="text-sm text-bone-500">Note: {appointment.notes}</p>}
      </div>
      <div className="flex flex-col gap-3 md:items-end">
        <span
          className={cn(
            "w-fit border px-3 py-1 text-xs tracking-[0.12em] uppercase",
            STATUS_TONE[appointment.status],
          )}
        >
          {STATUS_LABEL[appointment.status]}
        </span>
        <StatusActions id={appointment.id} status={appointment.status} />
      </div>
    </li>
  );
}
