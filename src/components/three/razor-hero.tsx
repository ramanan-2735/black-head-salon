"use client";

import Image from "next/image";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { canRunRazor3D, type GateInput } from "@/lib/three-gate";

/** Loaded only when the device passes the gate, so the 3D code stays out of the first load. */
const RazorCanvas = lazy(() => import("./razor-canvas"));

function readGateInput(): GateInput {
  const canvas = document.createElement("canvas");
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return {
    webgl2: canvas.getContext("webgl2") !== null,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData ?? false,
    cores: navigator.hardwareConcurrency ?? 1,
    width: window.innerWidth,
  };
}

/**
 * Hero razor. The static render is what everyone sees first. On devices that pass the
 * gate, the live model loads after first paint and fades in over it.
 */
export function RazorHero() {
  const [enable3D, setEnable3D] = useState(false);
  const [live, setLive] = useState(false);
  const handleReady = useCallback(() => setLive(true), []);

  useEffect(() => {
    if (!canRunRazor3D(readGateInput())) return;
    // Wait a moment so the headline and image paint before any 3D work starts.
    const timer = window.setTimeout(() => setEnable3D(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full">
      <Image
        src="/three/razor-static.webp"
        alt="Straight razor with a polished steel blade and a black horn handle"
        fill
        priority
        sizes="(min-width: 768px) 40vw, 100vw"
        className={cn("object-contain transition-opacity duration-500", live && "opacity-0")}
      />
      {enable3D && (
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <RazorCanvas onReady={handleReady} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
