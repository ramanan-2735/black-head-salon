import Link from "next/link";
import { DemoBadge } from "@/components/ui/demo-badge";
import { HoursList } from "@/components/site/hours-list";
import type { Business } from "@/lib/repos/types";
import { instagramHref, navLinks } from "@/lib/site-nav";

/**
 * Footer with business details. Owner-dependent fields show explicit placeholders.
 * Bottom padding leaves room for the floating call bar on phones.
 */
export function SiteFooter({ business }: { business: Business }) {
  return (
    <footer className="border-t border-line px-6 pt-16 pb-32 md:px-12 md:py-16">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <p className="font-display text-xl tracking-[0.08em]">BLACK HEAD SALON</p>
          <DemoBadge />
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
          <p className="text-xs tracking-[0.18em] text-brass-400 uppercase">Explore</p>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-bone-300 hover:text-brass-300">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm text-bone-300">
          <p className="text-xs tracking-[0.18em] text-brass-400 uppercase">Contact</p>
          <p>{business.address ?? "Address to be confirmed"}</p>
          <p>{business.phone ?? "Phone to be confirmed"}</p>
          {business.instagram && (
            <a
              href={instagramHref(business.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start text-brass-300 underline underline-offset-4 hover:text-brass-400"
            >
              @{business.instagram.replace(/^@/, "")}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>

        <div className="flex flex-col gap-3 text-sm text-bone-300">
          <p className="text-xs tracking-[0.18em] text-brass-400 uppercase">Hours</p>
          <HoursList hours={business.hours} fallback="Hours to be confirmed" />
        </div>
      </div>
      <div className="mt-16 flex flex-col gap-2 text-xs text-bone-500">
        <p>© 2026 Black Head Salon. All rights reserved. New Panvel East, Navi Mumbai.</p>
      </div>
    </footer>
  );
}
