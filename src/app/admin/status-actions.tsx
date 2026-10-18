"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { allowedTransitions, type AppointmentStatus } from "@/lib/booking/status";
import { setAppointmentStatus } from "./actions";

const LABELS: Partial<Record<AppointmentStatus, string>> = {
  CONFIRMED: "Approve",
  DECLINED: "Decline",
  COMPLETED: "Mark completed",
  NO_SHOW: "Mark no-show",
  CANCELLED: "Cancel",
};

const DESTRUCTIVE: AppointmentStatus[] = ["DECLINED", "CANCELLED", "NO_SHOW"];

/** Buttons for the moves a status allows. Nothing is shown for final states. */
export function StatusActions({ id, status }: { id: string; status: AppointmentStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const moves = allowedTransitions(status).filter((to) => LABELS[to]);

  if (moves.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {moves.map((to) => (
          <Button
            key={to}
            variant={DESTRUCTIVE.includes(to) ? "secondary" : "primary"}
            disabled={pending}
            className={
              DESTRUCTIVE.includes(to)
                ? "min-h-11 px-4 text-[0.7rem] hover:text-err"
                : "min-h-11 px-4 text-[0.7rem]"
            }
            onClick={() =>
              startTransition(async () => {
                const result = await setAppointmentStatus(id, to);
                if (result.ok) {
                  setError(null);
                  router.refresh();
                } else {
                  setError("That change didn't go through. Refresh and try again.");
                }
              })
            }
          >
            {LABELS[to]}
          </Button>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-xs text-err">
          {error}
        </p>
      )}
    </div>
  );
}
