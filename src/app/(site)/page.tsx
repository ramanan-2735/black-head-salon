import type { Metadata } from "next";
import { PlaceholderImage } from "@/components/site/placeholder-image";
import { Reveal } from "@/components/site/reveal";
import { RazorHero } from "@/components/three/razor-hero";
import { ButtonLink } from "@/components/ui/button";
import { DemoBadge } from "@/components/ui/demo-badge";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerRow } from "@/components/ui/ledger-row";
import { Section } from "@/components/ui/section";
import { BOOK_HREF } from "@/lib/site-nav";
import { contentRepository } from "@/lib/repos/static-content-repo";

export const metadata: Metadata = {
  title: { absolute: "Black Head Salon — Haircuts, fades & beard work" },
  description:
    "Book a haircut, fade or beard trim at Black Head Salon. Sample copy until the owner confirms details.",
};

const proof = ["Haircuts & fades", "Beard & shave", "Book in a few taps"];

export default async function Home() {
  const categories = await contentRepository.getServiceCategories();
  const gallery = await contentRepository.getGallery();
  const business = await contentRepository.getBusiness();
  const previewServices = categories.flatMap((category) => category.services).slice(0, 5);

  return (
    <main>
      <section className="relative flex flex-col justify-center overflow-hidden px-6 pt-16 pb-20 md:min-h-[82vh] md:px-12">
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-0 font-display text-[18vw] leading-none font-light text-transparent [-webkit-text-stroke:1px_#2e2b27] select-none"
        >
          BLACK HEAD
        </p>
        <div className="relative grid gap-12 md:grid-cols-12 md:items-center">
          <div className="flex flex-col gap-8 md:col-span-6 md:col-start-1">
            <DemoBadge />
            <Eyebrow>Precision · craft · character</Eyebrow>
            <h1 className="font-display text-6xl leading-[0.95] font-light md:text-8xl">
              Sharp is a <span className="text-brass-400 italic">standard</span>.
            </h1>
            <p className="max-w-md text-bone-300">
              Haircuts, fades and beard work, done with care. Choose a service and a time that suits
              you.
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href={BOOK_HREF}>Book an appointment</ButtonLink>
              <ButtonLink href="/services" variant="secondary">
                Explore services
              </ButtonLink>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <RazorHero />
          </div>
        </div>
      </section>

      <ul className="grid gap-6 border-y border-line px-6 py-8 text-sm text-bone-300 md:grid-cols-3 md:px-12">
        {proof.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-brass-600" />
            {item}
          </li>
        ))}
      </ul>

      <Section id="services" eyebrow="The menu" title="Services & prices">
        <Reveal>
          <ul>
            {previewServices.map((service) => (
              <LedgerRow
                key={service.id}
                service={service}
                bookHref={`/book?service=${service.slug}`}
              />
            ))}
          </ul>
        </Reveal>
        <div className="mt-12">
          <ButtonLink href="/services" variant="tertiary">
            Full menu
          </ButtonLink>
        </div>
      </Section>

      <Section id="lookbook" eyebrow="Lookbook" title="Recent styles">
        <div
          role="region"
          tabIndex={0}
          aria-label="Lookbook preview, scroll sideways to see more"
          className="overflow-x-auto pb-4"
        >
          <ul className="flex snap-x gap-6 md:gap-8">
            {gallery.map((image) => (
              <li key={image.id} className="w-[72vw] shrink-0 snap-start md:w-80">
                <PlaceholderImage label={image.alt} aspect="aspect-[3/4]" />
                <p className="mt-4 text-sm text-bone-300">{image.caption}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12">
          <ButtonLink href="/lookbook" variant="tertiary">
            View the lookbook
          </ButtonLink>
        </div>
      </Section>

      <Section id="about" eyebrow="The chair" title="Our story">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <PlaceholderImage label="Interior photograph — to come" aspect="aspect-[4/3]" />
          <p className="text-lg text-bone-300">
            The owner’s story goes here, in their own words. Placeholder copy until it is written
            together.
          </p>
        </div>
      </Section>

      <Section id="visit" eyebrow="Visit" title="Find us">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-4 text-bone-300">
            <p>{business.address ?? "Address to be confirmed"}</p>
            <p>Hours to be confirmed with the owner.</p>
          </div>
          <PlaceholderImage label="Map — to come" aspect="aspect-[4/3]" />
        </div>
      </Section>

      <section aria-labelledby="cta-title" className="border-t border-line px-6 py-24 md:px-12">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <h2 id="cta-title" className="font-display text-4xl font-light md:text-6xl">
            Your chair is <span className="text-brass-400 italic">waiting</span>.
          </h2>
          <ButtonLink href={BOOK_HREF}>Book now</ButtonLink>
        </div>
      </section>
    </main>
  );
}
