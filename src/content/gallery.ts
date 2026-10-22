import type { GalleryImage } from "@/lib/repos/types";

/*
 * SAMPLE lookbook. No real salon photos yet and no stock photos are bundled.
 * `src: null` renders a styled placeholder tile. Captions state that the
 * imagery is not the salon's work. Replace with owner photos, which need
 * customer consent before publishing.
 */
export const galleryImages: GalleryImage[] = [
  {
    id: "look-01",
    alt: "Precision skin fade with textured top and sculpted beard line",
    caption: "Low Skin Fade & Beard Sculpt",
    category: "fades",
    barberId: "barber-sample-1",
    styleName: "Fade & Beard Sculpt",
    src: "/lookbook/fade.jpg",
    isSample: false,
    isVisible: true,
  },
  {
    id: "look-02",
    alt: "Refined classic gentleman taper with styled natural texture",
    caption: "Classic Textured Crop",
    category: "classic",
    barberId: "barber-sample-2",
    styleName: "Classic Cut",
    src: "/lookbook/classic.jpg",
    isSample: false,
    isVisible: true,
  },
  {
    id: "look-03",
    alt: "Sharp beard grooming, clean cheek line and mustache shaping",
    caption: "Beard Sculpt & Razor Edge",
    category: "beard",
    barberId: "barber-sample-2",
    styleName: "Beard Trim & Edge",
    src: "/lookbook/beard.jpg",
    isSample: false,
    isVisible: true,
  },
];
