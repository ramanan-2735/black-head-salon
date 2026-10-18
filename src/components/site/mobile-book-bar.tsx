"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { BOOK_HREF, whatsappHref } from "@/lib/site-nav";

/**
 * Sticky booking bar for phones, so the main action is always one tap away.
 * Hidden on the booking flow itself, where it would cover the step controls.
 * WhatsApp appears only once the owner has supplied a number.
 */
export function MobileBookBar({ whatsappNumber }: { whatsappNumber: string | null }) {
  const pathname = usePathname();
  if (pathname.startsWith(BOOK_HREF)) return null;

  const whatsapp = whatsappHref(whatsappNumber, "Hello, I'd like to ask about an appointment.");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-line bg-ink-950/95 p-3 md:hidden">
      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex min-h-12 min-w-12 items-center justify-center rounded-[2px] border border-line text-bone-100"
        >
          <WhatsappLogo size={22} weight="light" aria-hidden="true" />
        </a>
      )}
      <ButtonLink href={BOOK_HREF} className="flex-1">
        Book an appointment
      </ButtonLink>
    </div>
  );
}
