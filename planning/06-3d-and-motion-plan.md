# 06 — 3D and Motion Plan

> Black Head Salon — Phase 1 planning deliverable. Source: approved planning report (2026-10-18). Tags: P0/P1/P2 priority · [REAL] [PROTO] [3RD] [OWNER].

## 12. 3D & motion strategy

**Chosen 3D concept: "The Razor."** A single GLB straight razor with a brass bolster and black horn scales, steel blade with brushed anisotropic look. It sits in the hero, crossing the photo/type boundary.
- **Purpose:** embodies "precision" and the brass palette. It is the memorable signature, and one object, not a scene.
- **Interaction:** idle slow float (±4px, 6s loop) + pointer parallax tilt (max 8°, damped). Scroll 0→60vh unfolds the blade from closed to open (one bone animation or two-part pivot) and rotates 25°. Then the canvas fades and stops rendering (`frameloop="demand"` once offscreen).
- **Tech:** `three` + `@react-three/fiber` + selective `@react-three/drei` imports (`useGLTF`, `Environment` with a tiny baked 256px HDR or `Lightformer`s — no 4K HDRIs). Model compressed with `gltf-transform` (Meshopt + KTX2/WebP textures). Draco is optional.
- **Asset budget:** GLB ≤ 350 KB, textures ≤ 512px, triangles ≤ 30k. 3D JS chunk ≤ ~220 KB gzip, **never in the initial bundle**.
- **Loading:** hero renders the **static razor WebP** (pre-rendered from the same model, 2 sizes) immediately as part of the composition. After `load` + `requestIdleCallback`, if the conditions below pass, it dynamically imports the canvas and crossfades from static to live. LCP stays the headline/photo.
- **Gating:** WebGL2 available ∧ `prefers-reduced-motion: no-preference` ∧ not `saveData` ∧ `navigator.hardwareConcurrency ≥ 4` ∧ viewport ≥ 768px **or** a device-memory hint ≥ 4. Otherwise the static image stays (still beautiful, so the fallback is a design, not an error). DPR capped at 1.5. Pauses on `visibilitychange`.
- **Asset sourcing [decision]:** commission or model a custom razor in Blender (~1–2 days), or use a CC0/licensed model and re-material it. Licence recorded in `ASSETS.md`.
- **Risk:** model quality is the whole effect, and a cheap-looking razor hurts the brand. Mitigation: approve the static render first (Phase 2) before wiring WebGL.

**Other depth (CSS only, no WebGL):** ghost outline typography behind the hero and section titles. Lookbook cards get a subtle 3D tilt on hover (desktop, ≤4°). The booking summary panel has a soft parallax lift.

**Motion system (Motion for React `motion/react`, plus CSS where possible):**
| Token | Value |
|---|---|
| durations | 150 (micro) · 250 (UI) · 450 (reveal) · 800 (hero) ms |
| easing | `cubic-bezier(.2,.7,.1,1)` out · `cubic-bezier(.6,0,.4,1)` in-out |
| reveals | headlines line-by-line rise 16px + fade, 60ms stagger. Images clip-path `inset(0 0 100% 0)` → `inset(0)`. Fire once at 20% in view. |
| scroll-linked | hero razor unfold + hero recede only (Motion `useScroll`). No scroll-jacking, no smooth-scroll library. |
| page transitions | View Transitions API where supported (cross-fade 200ms), progressive. |
| reduced motion | all transforms off. Opacity fades ≤150ms or none. 3D replaced by static. Carousels don't autoplay. |

GSAP is **not** needed. Motion + CSS cover the plan, which saves a dependency.


