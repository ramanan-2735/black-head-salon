import { Scissors } from "@phosphor-icons/react/ssr";

/** Barber pill, e.g. "Cut by Asha · Classic Cut" or "Any available". Ties the work to a person. */
export function BarberBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 self-start rounded-full border border-brass-600/60 bg-ink-800 px-3 py-1 text-xs text-bone-100">
      <Scissors size={14} weight="light" aria-hidden="true" className="shrink-0 text-brass-400" />
      <span className="truncate">{label}</span>
    </span>
  );
}
