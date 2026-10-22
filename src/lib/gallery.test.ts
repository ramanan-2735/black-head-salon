import { describe, expect, it } from "vitest";
import { cutCredit, filterGallery } from "./gallery";
import type { GalleryImage } from "./repos/types";

const image = (id: string, category: GalleryImage["category"]): GalleryImage => ({
  id,
  alt: id,
  caption: id,
  category,
  barberId: null,
  styleName: id,
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

describe("cutCredit", () => {
  const barbers = [{ id: "b1", name: "Asha" }];

  it("names the credited barber and the style", () => {
    const credited = { ...image("x", "fades"), barberId: "b1", styleName: "Fade & Beard Sculpt" };
    expect(cutCredit(credited, barbers)).toBe("Cut by Asha · Fade & Beard Sculpt");
  });

  it("falls back to the style alone when no barber is credited", () => {
    const uncredited = { ...image("x", "fades"), barberId: null, styleName: "Classic Cut" };
    expect(cutCredit(uncredited, barbers)).toBe("Classic Cut");
  });

  it("falls back to the style alone when the barber is no longer on the team", () => {
    const orphaned = { ...image("x", "fades"), barberId: "gone", styleName: "Classic Cut" };
    expect(cutCredit(orphaned, barbers)).toBe("Classic Cut");
  });
});
