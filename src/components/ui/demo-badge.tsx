import { config } from "@/lib/config";

/** Shown on every page in demo mode so sample content is never mistaken for real. */
export function DemoBadge() {
  if (!config.isDemo) return null;
  return (
    <p
      role="note"
      className="border-l border-brass-600 pl-3 text-xs tracking-[0.14em] text-brass-300 uppercase"
    >
      Premier Grooming & Hair Artistry · New Panvel
    </p>
  );
}
