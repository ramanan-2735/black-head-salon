# 02 — Design Reference Analysis

> Black Head Salon — Phase 1 planning deliverable. Source: approved planning report (2026-10-18). Tags: P0/P1/P2 priority · [REAL] [PROTO] [3RD] [OWNER].

## 2. Reference analysis

| # | Reference | Strengths to keep | Avoid / adapt |
|---|---|---|---|
| R1 | **Mane Barbershop** (light, off-white) | Editorial serif headline with one accent word in tan ("More Than a **Haircut**"). Short gold rule under the headline. Generous whitespace. Primary filled button plus outline secondary button. Clear four-up USP strip. Split "Your Style" dark band with script signature. Clean 5-column footer. | Light base doesn't fit "Black Head". The service cards are a generic carousel. The "1K+ happy clients ★★★★★" claim is something we must not fabricate. |
| R2 | **Legend Barber Shop** (dark) | A dark hero with a portrait that blends into the background works well with 3D lighting. Utility top bar (address · walk-ins · phone · socials). Condensed caps headline with a gold accent word. Icon USP strip. Dark "About" panel with a video play affordance. Alternating dark/light bands give rhythm. | Six identical service cards (the overused grid). Fake stats ("50K+ clients", "4.9 rating") and stock testimonials must not be copied. Gold is slightly overused on buttons. |
| R3 | **Barbearia Exclusiva** (dark booking) | **Most important for function.** A four-step booking stepper (Service → Barber → Date & time → Confirm). Service, barber, calendar and live **summary** are visible together on desktop. Brass time-slot chips. Selected state shown with a brass border and check. Hours badge ("Seg–Sáb 09h às 20h"). "Your data is safe" reassurance. Footer shows opening hours. | The four-column layout won't fit a phone, so it becomes a step-by-step flow with a sticky summary sheet. Barber star ratings would be fabricated, so we drop them unless real. |
| R4 | **Slick Style** (orange, loud) | **3D/depth ideas:** floating grooming objects (brushes, scissors) around the hero. Huge outlined background word ("TRANSFORMATION") behind content. Angled, tilted card frames. Before/after transformation pairs. The mobile adaptation is shown explicitly. | Saturated orange, grunge brick and condensed display type everywhere read as "street", not luxury. Too many floating objects distract. We take **one** object, the giant ghost-typography idea and the before/after concept (only with owner photos and consent). |

**Visual characteristics retained:** dark cinematic photography, warm practical lighting (bulbs, mirrors), high-contrast serif headlines, a single warm metallic accent, thin hairline rules, small tracked uppercase eyebrows ("LOOK GOOD. FEEL CONFIDENT." pattern).
**Layout:** left-aligned type with the image bleeding off the right edge (R1–R3). Horizontal USP strip. Alternating band rhythm. Booking as a contained panel (R3).
**Typography:** serif display + sans UI (R1, R3). Condensed caps (R2, R4) are rejected for headlines and used only sparingly in small labels.
**Colour/material:** black/charcoal + brass (R2, R3). Warm leather, chrome and brass suggested by the photography.
**Motion (not visible in stills, so this is inferred and must be designed):** none can be confirmed from static images. *Recorded as unknown.* Our motion system (§12) is original.
**3D opportunities:** R4's floating grooming tools, reduced to one hero object rendered properly in WebGL.
**Mobile:** only R4 shows mobile (single column, stacked cards, carousel arrows). Others are inferred.
**Cannot be determined from references:** hover states, animation timing, actual breakpoints, font names, how the nav behaves on scroll, form error states.


## 5. Brand & design system — "Barber's Ledger"

**Direction:** a dark, warm, editorial look, like a gentleman's barbershop at night: lamplight on brass, leather and black lacquer. Restraint signals luxury: one accent colour, hairline rules, large type, real photography. The signature idea is the **printed price ledger**: services shown as typeset rows with dotted leaders, à la a vintage barber's tariff board.

**Brand mark [OWNER]:** use the owner's real logo. Until then: a typographic wordmark placeholder "BLACK HEAD" (Fraunces, tracked) with "SALON" in small caps, clearly marked as a placeholder.

**Colour tokens (CSS variables on `:root`, Tailwind v4 `@theme`):**
| Token | Value | Use |
|---|---|---|
| `--ink-950` | `#0B0B0C` | page background |
| `--ink-900` | `#121214` | surface / panels |
| `--ink-800` | `#1A1A1D` | raised surface, inputs |
| `--ink-700` | `#26262A` | strong borders, disabled |
| `--line` | `#2E2B27` | warm hairline rules |
| `--bone-100` | `#EDE8DF` | primary text |
| `--bone-300` | `#B9B2A6` | secondary text |
| `--bone-500` | `#8C8579` | muted/meta (verify ≥4.5:1 on ink-950) |
| `--brass-300` | `#DDC08F` | hover accent |
| `--brass-400` | `#C9A46A` | accent, primary button bg |
| `--brass-600` | `#9C7A45` | pressed, rules |
| `--paper-100` | `#F2EEE7` | rare inverse band (lookbook captions/print) |
| `--ok` / `--warn` / `--err` | `#7FA27B` / `#D9A74A` / `#D2675A` | status (admin) |
Rule: brass covers at most ~5% of any viewport. It is never used for body text, and gradients are limited to photo-darkening scrims.

**Typography (self-hosted via `next/font`, `display: swap`, subset Latin):**
- Display: **Fraunces** (variable; `opsz` high, `SOFT` 0, weight 300–500), for headlines with one italic accent word in brass (from R1/R3).
- UI/body: **Geist** 400/500/600.
- Numerals: Geist with `font-variant-numeric: tabular-nums` for prices, times and calendars.
- Scale (fluid `clamp`): display-xl 56→120px, display-l 40→80, h2 32→56, h3 22→28, body-l 18, body 16, small 14, eyebrow 12 (uppercase, +0.18em tracking).
- Hindi/Tamil content is out of scope. [OWNER: confirm English-only.]

**Spacing:** 4px base, scale 4·8·12·16·24·32·48·64·96·128·160. Section padding `clamp(64px, 10vw, 160px)`. 12-column grid, max width 1440px, 48px gutters on desktop, 20px on mobile.
**Borders/surfaces:** 1px `--line` hairlines. Radius **2px** default, 0 on images, full only on avatars and status pills. Shadows only on overlays (`0 24px 64px rgb(0 0 0 / .5)`). No glassmorphism, except an optional 8px blur behind the sticky nav once scrolled.
**Buttons:** Primary = brass fill, ink text, uppercase 13px tracked, arrow icon nudges 4px on hover. Secondary = 1px bone outline. Tertiary = text link with brass underline that draws in. Destructive (admin) = err outline. Minimum height 48px; touch target ≥44px.
**Image treatment:** warm-graded, slightly desaturated, deep blacks. Reveal by clip-path wipe. Portrait crops 4:5, editorial 3:4 / 16:9. Cloudinary `g_auto` focal crops. Never label stock photos as salon work. They carry a "Sample image" caption in demo mode.
**Iconography:** Phosphor Icons (thin/light weight, tree-shaken per icon). One custom SVG set for the ledger (razor, scissors, comb) only if needed.
**Motion principles:** see §12. Short version: purposeful, eased, never blocking input, fully reduced-motion aware.
**Responsive principles:** mobile-first. Breakpoints 640/768/1024/1280. The booking CTA is always reachable (sticky bottom bar on mobile). No horizontal page scroll. 3D only above 768px or on capable devices.


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


