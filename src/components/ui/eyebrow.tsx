import { cn } from "@/lib/cn";

export function Eyebrow({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cn("text-xs tracking-[0.18em] text-brass-400 uppercase", className)}>
      {children}
    </p>
  );
}
