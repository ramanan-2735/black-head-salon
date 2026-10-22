import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./eyebrow";

/** Page band with an optional eyebrow and display heading. Generous vertical rhythm. */
export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={title ? titleId : undefined}
      className={cn("px-6 py-14 md:px-12 md:py-20", className)}
    >
      {(eyebrow || title) && (
        <header className="mb-12 flex flex-col gap-4">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {title && (
            <h2 id={titleId} className="font-display text-4xl font-light md:text-6xl">
              {title}
            </h2>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
