import Link from "next/link";
import { DemoBadge } from "@/components/ui/demo-badge";
import type { Business } from "@/lib/repos/types";
import { navLinks } from "@/lib/site-nav";

/** Footer with business details. Owner-dependent fields show explicit placeholders. */
export function SiteFooter({ business }: { business: Business }) {
  return (
    <footer className="border-t border-line px-6 py-16 md:px-12">
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
        </div>

        <div className="flex flex-col gap-3 text-sm text-bone-300">
          <p className="text-xs tracking-[0.18em] text-brass-400 uppercase">Hours</p>
          <p>Hours to be confirmed</p>
        </div>
      </div>
      <div className="mt-16 flex flex-col gap-2 text-xs text-bone-500">
        <p>© Black Head Salon. Placeholder copy until the owner confirms details.</p>
        <p>
          Razor model: &quot;Straight Razor&quot; by Cajetan, modified, licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            className="underline underline-offset-4 hover:text-brass-300"
            rel="noopener noreferrer"
          >
            CC BY 4.0
          </a>
          . Source:{" "}
          <a
            href="https://sketchfab.com/Cajetan"
            className="underline underline-offset-4 hover:text-brass-300"
            rel="noopener noreferrer"
          >
            sketchfab.com/Cajetan
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
