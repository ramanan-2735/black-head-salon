import { describe, expect, it } from "vitest";
import { filterGallery } from "./gallery";
import type { GalleryImage } from "./repos/types";

const image = (id: string, category: GalleryImage["category"]): GalleryImage => ({
  id,
  alt: id,
  caption: id,
  category,
  src: null,
  isSample: true,
  isVisible: true,
});

const images = [image("a", "fades"), image("b", "beard"), image("c", "fades")];

describe("filterGallery", () => {
  it("returns every image for 'all', in original order", () => {
    expect(filterGallery(images, "all").map((i) => i.id)).toEqual(["a", "b", "c"]);
  });

  it("returns only the requested category", () => {
    expect(filterGallery(images, "fades").map((i) => i.id)).toEqual(["a", "c"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterGallery(images, "kids")).toEqual([]);
  });
});
