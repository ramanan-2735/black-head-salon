import { InstagramLogo } from "@phosphor-icons/react/ssr";
import { instagramHref } from "@/lib/site-nav";

/** Invites customers to tag their cut. Renders nothing until the owner sets a handle. */
export function InstagramCallout({ handle }: { handle: string | null }) {
  if (!handle) return null;
  const label = `@${handle.replace(/^@/, "")}`;
  return (
    <aside
      aria-label="Instagram"
      className="surface-warm flex flex-col gap-4 rounded-[2px] border border-line p-6 md:flex-row md:items-center md:justify-between md:p-8"
    >
      <div className="flex flex-col gap-2">
        <p className="font-display text-2xl">Just had a cut you love?</p>
        <p className="text-sm text-bone-300">
          Tag your photo on Instagram so we can see how it turned out.
        </p>
      </div>
      <a
        href={instagramHref(handle)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 shrink-0 items-center gap-3 self-start rounded-[2px] border border-brass-600 px-5 text-sm text-brass-300 transition-colors hover:border-brass-400 hover:text-brass-300 md:self-center"
      >
        <InstagramLogo size={20} weight="light" aria-hidden="true" />
        <span>{label}</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </aside>
  );
}
