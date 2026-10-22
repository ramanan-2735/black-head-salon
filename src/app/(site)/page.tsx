import type { Metadata } from "next";
import Image from "next/image";
import { BarberBadge } from "@/components/site/barber-badge";
import { HoursList } from "@/components/site/hours-list";
import { InstagramCallout } from "@/components/site/instagram-callout";
import { Reveal } from "@/components/site/reveal";
import { ButtonLink } from "@/components/ui/button";
import { DemoBadge } from "@/components/ui/demo-badge";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerRow } from "@/components/ui/ledger-row";
import { Section } from "@/components/ui/section";
import { barbers } from "@/content/staff";
import { cutCredit } from "@/lib/gallery";
import { BOOK_HREF } from "@/lib/site-nav";
import { contentRepository } from "@/lib/repos/static-content-repo";

const staffCredits = barbers.map((barber) => ({ id: barber.id, name: barber.name }));

export const metadata: Metadata = {
  title: { absolute: "Black Head Salon — Haircuts, Fades & Beard Work in Panvel" },
  description:
    "Premium barbershop and grooming studio in New Panvel. Master fades, beard sculpts, and sharp haircuts.",
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
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] border border-line bg-ink-900">
                  {image.src ? (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 20rem, 72vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-bone-500">
                      {image.alt}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <BarberBadge label={cutCredit(image, staffCredits)} />
                  <p className="text-sm font-light text-bone-100">{image.caption}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-col gap-12">
          <ButtonLink href="/lookbook" variant="tertiary" className="self-start">
            View the lookbook
          </ButtonLink>
          <InstagramCallout handle={business.instagram} />
        </div>
      </Section>

      <Section id="about" eyebrow="The chair" title="Our craft">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-line bg-ink-900 shadow-2xl">
            <Image
              src="/images/salon-interior.jpg"
              alt="Black Head Salon grooming chairs, mirrors and atmosphere"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-lg leading-relaxed text-bone-300">
              Black Head Salon was built on a simple conviction: grooming is an art form of precision,
              dignity, and character. We cater to gentlemen who value sharp fades, clean straight-razor lines,
              and meticulous attention to detail.
            </p>
            <p className="text-sm leading-relaxed text-bone-500">
              Located in the heart of New Panvel, every appointment is dedicated one-on-one time in the chair.
              No rushed clippers, no cutting corners—just tailored hair and beard craftsmanship.
            </p>
          </div>
        </div>
      </Section>

      <Section id="visit" eyebrow="Visit" title="Find us">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6 text-bone-300">
            <div>
              <p className="font-display text-xl text-bone-100">Black Head Salon</p>
              <p className="mt-2 text-sm leading-relaxed text-bone-300">{business.address}</p>
              {business.phone && (
                <p className="mt-3 text-sm text-brass-300">
                  <a href={`tel:${business.phone.replace(/\s+/g, "")}`} className="hover:underline">
                    {business.phone}
                  </a>
                </p>
              )}
            </div>
            <div className="border-t border-line pt-4">
              <p className="mb-2 text-xs tracking-[0.14em] text-brass-400 uppercase">Weekly Hours</p>
              <HoursList hours={business.hours} fallback="Hours to be confirmed with the owner." />
            </div>
            {business.mapsUrl && (
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 text-sm text-brass-300 underline underline-offset-4 hover:text-brass-400"
              >
                Get directions on Google Maps &rarr;
              </a>
            )}
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-line bg-ink-900 p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-[0.18em] text-brass-400 uppercase">Google Maps · 2439+C6 Panvel</span>
              <p className="font-display text-2xl text-bone-100">Krishna Arcade CHS</p>
              <p className="text-sm text-bone-300">
                Sector 5, New Panvel East, Panvel, Maharashtra 410206.
              </p>
              <p className="mt-1 text-xs text-bone-500">
                Plus Code: <span className="font-mono text-brass-300">2439+C6 Panvel, Maharashtra</span>
              </p>
            </div>
            {business.mapsUrl && (
              <div className="mt-6 flex flex-wrap gap-4">
                <ButtonLink href={business.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Directions on Google Maps
                </ButtonLink>
              </div>
            )}
          </div>
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
