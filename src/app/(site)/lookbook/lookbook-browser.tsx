"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PlaceholderImage } from "@/components/site/placeholder-image";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { filterGallery, lookCategories } from "@/lib/gallery";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/lib/repos/types";

/** Column spans repeat so the grid reads as an editorial layout, not identical cards. */
const spans = [
  "md:col-span-7",
  "md:col-span-5 md:mt-24",
  "md:col-span-4",
  "md:col-span-8 md:mt-12",
];

function LookImage({ image, sizes }: { image: GalleryImage; sizes: string }) {
  if (image.src) {
    return <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />;
  }
  return <PlaceholderImage label={image.alt} aspect="aspect-[4/5] h-full" />;
}

export function LookbookBrowser({ images }: { images: GalleryImage[] }) {
  const [category, setCategory] = useState<GalleryImage["category"] | "all">("all");
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const visible = filterGallery(images, category);
  const available = new Set(images.map((image) => image.category));

  return (
    <div className="flex flex-col gap-12">
      <div role="group" aria-label="Filter by style" className="flex flex-wrap gap-3">
        {[{ value: "all" as const, label: "All" }, ...lookCategories]
          .filter((option) => option.value === "all" || available.has(option.value))
          .map((option) => (
            <Button
              key={option.value}
              variant="secondary"
              aria-pressed={category === option.value}
              onClick={() => setCategory(option.value)}
              className={cn(
                "min-h-11 px-4 text-[0.7rem]",
                category === option.value && "border-brass-400 bg-brass-400 text-ink-950",
              )}
            >
              {option.label}
            </Button>
          ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-bone-300">No looks in this style yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-12">
          {visible.map((image, index) => (
            <li key={image.id} className={cn("md:col-span-6", spans[index % spans.length])}>
              <button
                type="button"
                onClick={() => setSelected(image)}
                aria-label={`View: ${image.alt}`}
                className="group flex w-full flex-col gap-4 text-left"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <LookImage image={image} sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
                <span className="flex flex-col gap-1">
                  <span className="font-display text-xl font-light group-hover:text-brass-300">
                    {image.caption}
                  </span>
                  <span className="text-xs tracking-[0.14em] text-bone-500 uppercase">
                    {lookCategories.find((c) => c.value === image.category)?.label}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.caption ?? ""}
      >
        {selected && (
          <>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <LookImage image={selected} sizes="36rem" />
            </div>
            <p className="text-sm text-bone-300">{selected.alt}</p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href={`/book?look=${encodeURIComponent(selected.id)}`}>
                Book this look
              </ButtonLink>
              <Link
                href="/services"
                className="min-h-12 flex items-center text-sm underline underline-offset-8"
              >
                See services
              </Link>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
