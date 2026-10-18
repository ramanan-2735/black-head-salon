import { Check } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

/** Booking progress (planning/03 §9). The current step carries aria-current. */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <nav aria-label="Booking progress">
      <ol className="flex flex-wrap gap-x-8 gap-y-4">
        {steps.map((label, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li
              key={label}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex items-center gap-3 text-sm",
                active ? "text-brass-300" : done ? "text-bone-100" : "text-bone-500",
              )}
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-xs",
                  active && "border-brass-400 text-brass-300",
                  done && "border-bone-300 bg-bone-300 text-ink-950",
                  !active && !done && "border-line",
                )}
              >
                {done ? <Check size={14} weight="bold" aria-hidden="true" /> : index + 1}
              </span>
              <span>
                {label}
                <span className="sr-only">{done ? " (complete)" : active ? " (current)" : ""}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
