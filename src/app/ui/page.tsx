import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoBadge } from "@/components/ui/demo-badge";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerRow } from "@/components/ui/ledger-row";
import { Section } from "@/components/ui/section";
import { Stepper } from "@/components/ui/stepper";
import { config } from "@/lib/config";
import { contentRepository } from "@/lib/repos/static-content-repo";
import { InteractiveDemo } from "./interactive-demo";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

/** Internal showcase of the primitives. Only available in demo mode. */
export default async function DesignSystemPage() {
  if (!config.isDemo) notFound();

  const categories = await contentRepository.getServiceCategories();
  const sampleServices = categories.flatMap((category) => category.services).slice(0, 2);

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 px-6 pt-12 md:px-12">
        <DemoBadge />
        <h1 className="font-display text-5xl font-light md:text-7xl">Design system</h1>
      </div>

      <Section id="tokens" eyebrow="Foundations" title="Colour and type">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="h-24 rounded-[2px] bg-ink-950 ring-1 ring-line" />
            <p className="text-sm text-bone-300">ink-950 · background</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-24 rounded-[2px] bg-ink-800" />
            <p className="text-sm text-bone-300">ink-800 · raised surface</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-24 rounded-[2px] bg-brass-400" />
            <p className="text-sm text-bone-300">brass-400 · accent (≤5% of view)</p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-6">
          <p className="font-display text-7xl font-light">
            Sharp, <span className="text-brass-400 italic">quietly</span>
          </p>
          <p className="font-display text-3xl font-light">Display serif for headlines</p>
          <p className="text-bone-300">Geist for body and interface text, at 16px and above.</p>
          <Eyebrow>Eyebrow label</Eyebrow>
        </div>
      </Section>

      <Section id="ledger" eyebrow="Components" title="Price ledger row">
        <ul>
          {sampleServices.map((service) => (
            <LedgerRow key={service.id} service={service} bookHref="/book" />
          ))}
        </ul>
      </Section>

      <Section id="stepper" eyebrow="Components" title="Booking stepper">
        <Stepper steps={["Service", "Barber", "Date & time", "Confirm"]} current={1} />
      </Section>

      <Section id="interactive" eyebrow="Components" title="Interactive controls">
        <InteractiveDemo />
      </Section>
    </main>
  );
}
