import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Hierarchy (planning/02 §5): primary = the one booking action per view,
 * secondary = outline alternative, tertiary = inline text link.
 */
type Variant = "primary" | "secondary" | "tertiary";

const base =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-[2px] text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-250 disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-brass-400 px-6 text-ink-950 hover:bg-brass-300",
  secondary:
    "border border-bone-100/50 px-6 text-bone-100 hover:border-brass-400 hover:text-brass-300",
  tertiary:
    "min-h-11 text-bone-100 underline decoration-brass-600 underline-offset-8 hover:decoration-brass-400",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
