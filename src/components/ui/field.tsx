import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Labelled text input. Hint and error are linked with aria-describedby, and
 * aria-invalid is set, so screen readers announce them with the field.
 */
export function Field({
  id,
  label,
  hint,
  error,
  className,
  ...inputProps
}: ComponentProps<"input"> & { id: string; label: string; hint?: string; error?: string }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm text-bone-100">
        {label}
        {inputProps.required && (
          <span className="text-brass-400" aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        className="min-h-12 rounded-[2px] border border-line bg-ink-800 px-4 text-bone-100 placeholder:text-bone-500 focus:border-brass-400 aria-[invalid=true]:border-err"
        {...inputProps}
      />
      {hint && (
        <p id={hintId} className="text-xs text-bone-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-err">
          {error}
        </p>
      )}
    </div>
  );
}
