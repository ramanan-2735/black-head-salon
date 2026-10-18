import { describe, expect, it } from "vitest";
import { canRunRazor3D, type GateInput } from "./three-gate";

const capable: GateInput = {
  webgl2: true,
  reducedMotion: false,
  saveData: false,
  cores: 8,
  width: 1280,
};

describe("canRunRazor3D", () => {
  it("allows 3D on a capable desktop", () => {
    expect(canRunRazor3D(capable)).toBe(true);
  });

  it("keeps the static image when WebGL 2 is missing", () => {
    expect(canRunRazor3D({ ...capable, webgl2: false })).toBe(false);
  });

  it("respects reduced motion", () => {
    expect(canRunRazor3D({ ...capable, reducedMotion: true })).toBe(false);
  });

  it("respects data-saver", () => {
    expect(canRunRazor3D({ ...capable, saveData: true })).toBe(false);
  });

  it("skips low-core devices", () => {
    expect(canRunRazor3D({ ...capable, cores: 2 })).toBe(false);
  });

  it("skips phones, where the hero stays static", () => {
    expect(canRunRazor3D({ ...capable, width: 390 })).toBe(false);
  });
});
