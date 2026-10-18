export interface GateInput {
  webgl2: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  cores: number;
  width: number;
}

/**
 * Decides whether the live 3D razor may load on this device (planning/06). Anything
 * that fails keeps the static image, which is a complete design on its own.
 */
export function canRunRazor3D(input: GateInput): boolean {
  return (
    input.webgl2 &&
    !input.reducedMotion &&
    !input.saveData &&
    input.cores >= 4 &&
    input.width >= 768
  );
}
