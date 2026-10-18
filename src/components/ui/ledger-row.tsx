import { ArrowRight } from "@phosphor-icons/react/ssr";
import { formatDuration, formatPrice } from "@/lib/format";
import type { Service } from "@/lib/repos/types";
import { ButtonLink } from "./button";

/**
 * One line of the printed price ledger (planning/03 §7). Name and description on
 * the left, a dotted leader, then price and duration. The book link names the
 * service for screen readers.
 */
export function LedgerRow({ service, bookHref }: { service: Service; bookHref: string }) {
  const duration = formatDuration(service.durationMin);
  return (
    <li className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-line py-6">
      <div className="flex min-w-0 flex-col gap-1 md:basis-1/3">
        <h3 className="font-display text-2xl font-light">{service.name}</h3>
        <p className="text-sm text-bone-300">{service.description}</p>
      </div>
      <span
        aria-hidden="true"
        className="hidden flex-1 border-b border-dotted border-bone-500 md:block"
      />
      <p className="ml-auto w-40 shrink-0 text-right text-lg">
        {formatPrice(service.priceInPaise, service.isFromPrice)}
        {duration && <span className="block text-xs text-bone-500">{duration}</span>}
      </p>
      <ButtonLink href={bookHref} variant="tertiary" aria-label={`Book ${service.name}`}>
        Book <ArrowRight size={14} weight="light" aria-hidden="true" />
      </ButtonLink>
    </li>
  );
}
