import { business } from "@/content/business";
import { galleryImages } from "@/content/gallery";
import { serviceCategories } from "@/content/services";
import type { ContentRepository, GalleryImage, ServiceCategory } from "./types";

/**
 * Reads content from src/content. Professional uses this as-is. Premium swaps
 * in a Prisma implementation of the same interface. Hidden items are filtered
 * here, so the UI never needs to check visibility itself.
 */
export function createStaticContentRepository(data: {
  business: typeof business;
  categories: ServiceCategory[];
  gallery: GalleryImage[];
}): ContentRepository {
  return {
    async getBusiness() {
      return data.business;
    },
    async getServiceCategories() {
      return data.categories
        .map((category) => ({
          ...category,
          services: category.services.filter((service) => service.isVisible),
        }))
        .filter((category) => category.services.length > 0);
    },
    async getGallery() {
      return data.gallery.filter((image) => image.isVisible);
    },
  };
}

export const contentRepository = createStaticContentRepository({
  business,
  categories: serviceCategories,
  gallery: galleryImages,
});
