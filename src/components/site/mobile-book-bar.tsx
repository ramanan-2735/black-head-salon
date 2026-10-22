"use client";

import { Phone, WhatsappLogo } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { BOOK_HREF, WHATSAPP_BOOKING_MESSAGE, telHref, whatsappHref } from "@/lib/site-nav";

/**
 * Floating call and WhatsApp pill for phones. It sits low and centred, so it
 * never covers the header, and the footer leaves room for it. It is hidden on
 * the booking flow, where the sticky action bar already owns the bottom edge.
 * Each option appears only once the owner has supplied the number.
 */
export function MobileBookBar({
  phone,
  whatsapp,
}: {
  phone: string | null;
  whatsapp: string | null;
}) {
  const pathname = usePathname();
  const call = telHref(phone);
  const chat = whatsappHref(whatsapp, WHATSAPP_BOOKING_MESSAGE);
  if (pathname.startsWith(BOOK_HREF) || (!call && !chat)) return null;

  const optionClass =
    "flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-bone-100 transition-colors hover:text-brass-300";

  return (
    <div className="surface-warm fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit items-center gap-1 rounded-full border border-brass-600/60 p-1.5 shadow-[0_10px_30px_rgb(0_0_0/0.45)] backdrop-blur-sm md:hidden">
      {call && (
        <a href={call} className={optionClass}>
          <Phone size={18} weight="light" aria-hidden="true" />
          Call shop
        </a>
      )}
      {chat && (
        <a href={chat} target="_blank" rel="noopener noreferrer" className={optionClass}>
          <WhatsappLogo size={18} weight="light" aria-hidden="true" />
          WhatsApp us
        </a>
      )}
    </div>
  );
}
