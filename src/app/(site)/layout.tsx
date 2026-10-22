import { MobileBookBar } from "@/components/site/mobile-book-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { contentRepository } from "@/lib/repos/static-content-repo";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const business = await contentRepository.getBusiness();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 bg-brass-400 px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div id="main" className="flex flex-1 flex-col">
        {children}
      </div>
      <SiteFooter business={business} />
      <MobileBookBar phone={business.phone} whatsapp={business.whatsapp} />
    </>
  );
}
