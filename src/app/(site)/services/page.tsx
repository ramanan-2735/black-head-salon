import type { Metadata } from "next";
import { DemoBadge } from "@/components/ui/demo-badge";
import { LedgerRow } from "@/components/ui/ledger-row";
import { contentRepository } from "@/lib/repos/static-content-repo";

export const metadata: Metadata = {
  title: "Services & prices",
  description:
    "Haircuts, beard work and shaves at Black Head Salon. Sample prices until the owner confirms the menu.",
};

export default async function ServicesPage() {
  const categories = await contentRepository.getServiceCategories();

  return (
    <main className="flex flex-1 flex-col gap-12 px-6 py-20 md:px-12 md:py-32">
      <header className="flex flex-col gap-6">
        <DemoBadge />
        <h1 className="font-display text-5xl font-light md:text-7xl">
          Services <span className="text-brass-400 italic">&amp; prices</span>
        </h1>
        <p className="max-w-xl text-bone-300">
          Prices and durations shown are samples. The owner will confirm the real menu before
          launch.
        </p>
      </header>

      <div className="grid gap-12 md:grid-cols-[14rem_minmax(0,1fr)]">
        <nav aria-label="Menu categories" className="md:sticky md:top-28 md:self-start">
          <ul className="flex gap-6 overflow-x-auto text-sm md:flex-col md:gap-3 md:overflow-visible">
            {categories.map((category) => (
              <li key={category.id} className="shrink-0">
                <a href={`#${category.id}`} className="text-bone-300 hover:text-brass-300">
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-20">
          {categories.map((category, index) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-title`}
              className="scroll-mt-28"
            >
              <p className="text-xs tracking-[0.18em] text-brass-400 uppercase">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2
                id={`${category.id}-title`}
                className="mt-2 font-display text-4xl font-light md:text-5xl"
              >
                {category.name}
              </h2>
              <ul className="mt-8">
                {category.services.map((service) => (
                  <LedgerRow
                    key={service.id}
                    service={service}
                    bookHref={`/book?service=${service.slug}`}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
