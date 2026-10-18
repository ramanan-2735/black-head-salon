import type { ReactNode } from "react";

/** Marks content for the CSS scroll reveal in globals.css. Server-rendered, no JavaScript. */
export function Reveal({ children }: { children: ReactNode }) {
  return <div className="reveal">{children}</div>;
}
