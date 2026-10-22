"use client";

import Link from "next/link";
import { useRef } from "react";
import { navLinks } from "@/lib/site-nav";

/**
 * Phone navigation: a native <details> disclosure. The header stays mounted across
 * pages, so the menu has to close itself when a link is chosen.
 */
export function MobileMenu() {
  const menu = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={menu} className="group md:hidden">
      <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center text-sm text-bone-100">
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Close</span>
      </summary>
      <nav
        aria-label="Mobile"
        className="absolute inset-x-0 top-20 flex flex-col gap-1 border-b border-line bg-ink-950 px-6 py-6"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => menu.current?.removeAttribute("open")}
            className="min-h-11 py-3 font-display text-3xl font-light"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
