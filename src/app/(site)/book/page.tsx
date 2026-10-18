import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoBadge } from "@/components/ui/demo-badge";
import { barbers } from "@/content/staff";
import { config } from "@/lib/config";
import { contentRepository } from "@/lib/repos/static-content-repo";
import { BookingFlow } from "./booking-flow";

export const metadata: Metadata = {
  title: "Book an appointment",
  description: "Choose a service, barber and time at Black Head Salon.",
};

export default async function BookPage() {
  const categories = await contentRepository.getServiceCategories();
  // Only services with a set duration can be booked online. Others need a phone call.
  const services = categories
    .flatMap((category) => category.services)
    .filter((service) => service.durationMin !== null)
    .map((service) => ({
      id: service.id,
      slug: service.slug,
      name: service.name,
      priceInPaise: service.priceInPaise,
      isFromPrice: service.isFromPrice,
      durationMin: service.durationMin ?? 0,
    }));
  const publicBarbers = barbers.map((barber) => ({
    id: barber.id,
    name: barber.name,
    serviceIds: barber.serviceIds,
  }));

  return (
    <main className="flex flex-1 flex-col gap-12 px-6 py-20 md:px-12 md:py-28">
      <header className="flex flex-col gap-6">
        <DemoBadge />
        <h1 className="font-display text-5xl font-light md:text-7xl">
          Book an <span className="text-brass-400 italic">appointment</span>
        </h1>
      </header>
      <Suspense fallback={<p className="text-bone-500">Loading booking…</p>}>
        <BookingFlow
          services={services}
          barbers={publicBarbers}
          mode={config.bookingMode}
          isDemo={config.isDemo}
        />
      </Suspense>
    </main>
  );
}
