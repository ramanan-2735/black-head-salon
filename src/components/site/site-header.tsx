import Link from "next/link";
import { MobileMenu } from "@/components/site/mobile-menu";
import { ButtonLink } from "@/components/ui/button";
import { BOOK_HREF, navLinks } from "@/lib/site-nav";

/**
 * Top navigation. The mobile menu is a native <details> disclosure that closes itself on
 * navigation (see MobileMenu).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink-950/90 backdrop-blur-sm">
      <div className="flex h-20 items-center justify-between gap-6 px-6 md:px-12">
        <Link href="/" className="flex flex-col leading-none" aria-label="Black Head Salon, home">
          <span className="font-display text-xl tracking-[0.08em] whitespace-nowrap md:text-2xl">
            BLACK HEAD
          </span>
          <span className="mt-1 text-[0.6rem] tracking-[0.42em] text-bone-500">SALON</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-bone-300 transition-colors hover:text-brass-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ButtonLink href={BOOK_HREF} className="min-h-11 px-5">
            Book
          </ButtonLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
