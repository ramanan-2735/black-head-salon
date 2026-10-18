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
        description: "Sample description: a scissor or clipper cut tailored to the face.",
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
        description: "Sample description: a taper blended down to the skin.",
        priceInPaise: 35000,
        isFromPrice: true,
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
        name: "Beard Trim",
        description: "Sample description: shaping and edging with a clean neckline.",
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
        description: "Sample description: a straight-razor shave with a hot towel finish.",
        priceInPaise: null,
        isFromPrice: false,
        durationMin: null,
        isFeatured: false,
        isVisible: true,
      },
    ],
  },
];
