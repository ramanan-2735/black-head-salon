import type { Metadata } from "next";
import { InstagramCallout } from "@/components/site/instagram-callout";
import { DemoBadge } from "@/components/ui/demo-badge";
import { barbers } from "@/content/staff";
import { contentRepository } from "@/lib/repos/static-content-repo";
import { LookbookBrowser } from "./lookbook-browser";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "Haircut and beard styles from Black Head Salon. Sample imagery until owner photos are added.",
};

export default async function LookbookPage() {
  const images = await contentRepository.getGallery();
  const business = await contentRepository.getBusiness();
  const staffCredits = barbers.map((barber) => ({ id: barber.id, name: barber.name }));

  return (
    <main className="flex flex-1 flex-col gap-12 px-6 py-20 md:px-12 md:py-32">
      <header className="flex flex-col gap-6">
        <DemoBadge />
        <h1 className="font-display text-5xl font-light md:text-7xl">
          The <span className="text-brass-400 italic">lookbook</span>
        </h1>
        <p className="max-w-xl text-bone-300">
          Styles we cut, grouped by look. Images shown here are samples until the owner’s own photos
          are added with customer consent.
        </p>
      </header>
      <LookbookBrowser images={images} barbers={staffCredits} />
      <InstagramCallout handle={business.instagram} />
    </main>
  );
}
