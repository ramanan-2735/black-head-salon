import { cn } from "@/lib/cn";

/**
 * Styled stand-in for a photo that doesn't exist yet. It says so on screen, so
 * an empty tile is never mistaken for real salon work.
 */
export function PlaceholderImage({
  label,
  aspect = "aspect-[4/5]",
  className,
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex w-full items-end overflow-hidden rounded-[2px] bg-ink-800 p-4 ring-1 ring-line",
        aspect,
        className,
      )}
    >
      <span className="relative text-xs tracking-[0.14em] text-bone-500 uppercase">{label}</span>
    </div>
  );
}
