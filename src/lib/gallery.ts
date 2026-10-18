import type { GalleryImage } from "@/lib/repos/types";

export const lookCategories: { value: GalleryImage["category"]; label: string }[] = [
  { value: "fades", label: "Fades" },
  { value: "classic", label: "Classic" },
  { value: "textured", label: "Textured" },
  { value: "beard", label: "Beard" },
  { value: "kids", label: "Kids" },
];

/** Returns images in a category. "all" returns everything, in its original order. */
export function filterGallery(
  images: GalleryImage[],
  category: GalleryImage["category"] | "all",
): GalleryImage[] {
  return category === "all" ? images : images.filter((image) => image.category === category);
}
