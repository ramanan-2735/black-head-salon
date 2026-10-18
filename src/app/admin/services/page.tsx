import type { Metadata } from "next";
import { formatDuration, formatPrice } from "@/lib/format";
import { serviceCategories } from "@/content/services";

export const metadata: Metadata = { title: "Services" };

/**
 * Read-only in the demo. Editing and saving to the site arrive with the Premium admin
 * (planning/03 §10), so nothing here pretends to be saved.
 */
export default function ServicesAdminPage() {
  return (
    <section aria-labelledby="services-admin-title" className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 id="services-admin-title" className="font-display text-4xl font-light">
          Services
        </h1>
        <p className="max-w-xl text-sm text-bone-300">
          This list is read-only in the demo. Changes here aren&apos;t saved yet. Editing prices and
          visibility is part of the Premium admin.
        </p>
      </div>

      {serviceCategories.map((category) => (
        <div key={category.id} className="flex flex-col gap-4">
          <h2 className="font-display text-2xl font-light">{category.name}</h2>
          <ul className="flex flex-col divide-y divide-line border border-line bg-ink-900">
            {category.services.map((service) => (
              <li
                key={service.id}
                className="flex flex-col gap-2 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-bone-100">{service.name}</p>
                  <p className="text-xs text-bone-500">
                    {[formatDuration(service.durationMin), service.isFeatured && "Featured"]
                      .filter(Boolean)
                      .join(" · ") || "No duration set"}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span>{formatPrice(service.priceInPaise, service.isFromPrice)}</span>
                  <span className="text-xs tracking-[0.12em] text-bone-500 uppercase">
                    {service.isVisible ? "Shown on site" : "Hidden"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
