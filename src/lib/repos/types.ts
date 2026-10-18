/**
 * Shared content shapes. Professional reads them from src/content, and Premium
 * (Phase 9) will read the same shapes from Prisma. Money is integer paise so
 * there is no float rounding.
 */

export interface Business {
  name: string;
  /** Null until the owner confirms it. Never invent an address. */
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  mapsUrl: string | null;
  /** Weekday keys 0 (Sun) to 6 (Sat). Null hours mean "to be confirmed". */
  hours: Record<number, { open: string; close: string } | null> | null;
  timezone: string;
  currency: "INR";
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Null means "price on request". */
  priceInPaise: number | null;
  isFromPrice: boolean;
  durationMin: number | null;
  isFeatured: boolean;
  isVisible: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  services: Service[];
}

export interface GalleryImage {
  id: string;
  alt: string;
  caption: string;
  category: "fades" | "classic" | "textured" | "beard" | "kids";
  /** Null renders a styled placeholder tile instead of an image. */
  src: string | null;
  isSample: boolean;
  isVisible: boolean;
}

export interface ContentRepository {
  getBusiness(): Promise<Business>;
  getServiceCategories(): Promise<ServiceCategory[]>;
  getGallery(): Promise<GalleryImage[]>;
}
