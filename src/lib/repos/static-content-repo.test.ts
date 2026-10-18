import { describe, expect, it } from "vitest";
import { createStaticContentRepository } from "./static-content-repo";
import type { GalleryImage, ServiceCategory } from "./types";

const service = (id: string, isVisible: boolean) => ({
  id,
  slug: id,
  name: id,
  description: "",
  priceInPaise: 1000,
  isFromPrice: false,
  durationMin: 30,
  isFeatured: false,
  isVisible,
});

const image = (id: string, isVisible: boolean): GalleryImage => ({
  id,
  alt: id,
  caption: "",
  category: "fades",
  src: null,
  isSample: true,
  isVisible,
});

const business = {
  name: "Test",
  address: null,
  phone: null,
  whatsapp: null,
  mapsUrl: null,
  hours: null,
  timezone: "Asia/Kolkata",
  currency: "INR" as const,
};

describe("createStaticContentRepository", () => {
  it("hides invisible services and drops categories left empty", async () => {
    const categories: ServiceCategory[] = [
      { id: "a", name: "A", services: [service("a1", true), service("a2", false)] },
      { id: "b", name: "B", services: [service("b1", false)] },
    ];
    const repo = createStaticContentRepository({ business, categories, gallery: [] });

    const result = await repo.getServiceCategories();

    expect(result.map((c) => c.id)).toEqual(["a"]);
    expect(result[0].services.map((s) => s.id)).toEqual(["a1"]);
  });

  it("hides invisible gallery images", async () => {
    const repo = createStaticContentRepository({
      business,
      categories: [],
      gallery: [image("shown", true), image("hidden", false)],
    });

    expect((await repo.getGallery()).map((i) => i.id)).toEqual(["shown"]);
  });
});
