import type { ServiceCategory } from "@/lib/repos/types";

/*
 * SAMPLE catalogue. Every name, description, price and duration is illustrative
 * and must be replaced with the owner's real menu. Prices are in paise
 * (₹1 = 100). Category names are placeholders until the owner confirms them.
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: "cat-haircuts",
    name: "Haircuts",
    services: [
      {
        id: "svc-classic-cut",
        slug: "classic-cut",
        name: "Classic Cut",
        description: "Precision scissor and clipper cut tailored to your facial structure with neck taper.",
        priceInPaise: 30000,
        isFromPrice: false,
        durationMin: 45,
        isFeatured: true,
        isVisible: true,
      },
      {
        id: "svc-skin-fade",
        slug: "skin-fade",
        name: "Skin Fade",
        description: "Seamless low, mid, or high fade blended down to the skin with foil shaver detailing.",
        priceInPaise: 35000,
        isFromPrice: false,
        durationMin: 50,
        isFeatured: true,
        isVisible: true,
      },
    ],
  },
  {
    id: "cat-beard",
    name: "Beard & Shave",
    services: [
      {
        id: "svc-beard-trim",
        slug: "beard-trim",
        name: "Beard Trim & Sculpt",
        description: "Complete beard shaping, volume de-bulking, cheek alignment, and sharp neckline edging.",
        priceInPaise: 20000,
        isFromPrice: false,
        durationMin: 25,
        isFeatured: false,
        isVisible: true,
      },
      {
        id: "svc-hot-towel-shave",
        slug: "hot-towel-shave",
        name: "Hot Towel Shave",
        description: "Traditional straight-razor shave with pre-shave oil, steaming hot towel, and cold splash.",
        priceInPaise: 25000,
        isFromPrice: false,
        durationMin: 30,
        isFeatured: false,
        isVisible: true,
      },
    ],
  },
];
