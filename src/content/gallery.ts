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
    alt: "Placeholder: sample fade haircut",
    caption: "Sample look — not salon work",
    category: "fades",
    src: null,
    isSample: true,
    isVisible: true,
  },
  {
    id: "look-02",
    alt: "Placeholder: sample classic cut",
    caption: "Sample look — not salon work",
    category: "classic",
    src: null,
    isSample: true,
    isVisible: true,
  },
  {
    id: "look-03",
    alt: "Placeholder: sample beard style",
    caption: "Sample look — not salon work",
    category: "beard",
    src: null,
    isSample: true,
    isVisible: true,
  },
];
