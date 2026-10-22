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
    alt: "Sample image for a skin fade look. Not a Black Head Salon photo.",
    caption: "Sample: Low Skin Fade & Beard Sculpt",
    category: "fades",
    barberId: "barber-sample-1",
    styleName: "Fade & Beard Sculpt",
    src: "/lookbook/fade.jpg",
    isSample: true,
    isVisible: true,
  },
  {
    id: "look-02",
    alt: "Sample image for a classic taper look. Not a Black Head Salon photo.",
    caption: "Sample: Classic Textured Crop",
    category: "classic",
    barberId: "barber-sample-2",
    styleName: "Classic Cut",
    src: "/lookbook/classic.jpg",
    isSample: true,
    isVisible: true,
  },
  {
    id: "look-03",
    alt: "Sample image for a beard trim look. Not a Black Head Salon photo.",
    caption: "Sample: Beard Sculpt & Razor Edge",
    category: "beard",
    barberId: "barber-sample-2",
    styleName: "Beard Trim & Edge",
    src: "/lookbook/beard.jpg",
    isSample: true,
    isVisible: true,
  },
];
