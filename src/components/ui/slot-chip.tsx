"use client";

import { cn } from "@/lib/cn";

/** A bookable time. aria-pressed shows the selection, and disabled means unavailable. */
export function SlotChip({
  time,
  selected,
  disabled,
  onSelect,
}: {
  time: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "min-h-11 rounded-[2px] border px-3 text-sm tabular-nums transition-colors",
        selected
          ? "border-brass-400 bg-brass-400 text-ink-950"
          : "border-line text-bone-100 hover:border-brass-600",
        disabled && "line-through opacity-40",
      )}
    >
      {time}
    </button>
  );
}
