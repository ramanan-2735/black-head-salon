# 04 — Performance, Accessibility, SEO

## Performance
- **Lighthouse: NOT RUN.** It is not a project dependency and I did not install it. No scores are claimed.
- Production build compiles cleanly; static prerendering for `/`, `/services`, `/lookbook`, `/book`, `/ui`; dynamic for API routes.
- Measured locally (dev, not representative): page loads 0.6–1.4 s on networkidle.
- Source images are 0.8–1.0 MB JPEGs each (4 files, ~3.4 MB). They are served through `next/image` (resized/WebP/AVIF), e.g. `fade.jpg` at w=640 was 68 KB. Good. Consider shrinking the sources anyway.
- Browser warning (Confirmed): `/lookbook/fade.jpg` and `classic.jpg` are detected as LCP but lack `loading="eager"`/`priority`. Add `priority` to the first lookbook image on `/lookbook`.
- 3D: `three` and `@react-three/fiber` are dependencies and `src/components/three/*` exists, but **nothing imports it** (home page no longer uses it). No WebGL runs. Unused dependency weight is not shipped to users but is dead code; remove after the pitch. No scroll-jacking. Reveal animations are CSS-only and respect `prefers-reduced-motion`.

## Accessibility (axe-core via existing `@axe-core/playwright`, mobile 375px)
| Route | Violations |
|---|---|
| `/` | label-content-name-mismatch (serious, 1), region (moderate, 1) |
| `/services` | same |
| `/lookbook` | label-content-name-mismatch (serious, 4), region (moderate, 1) |
| `/book` | label-content-name-mismatch (serious, 1) |
| `/admin` | landmark-one-main (moderate, 1) |

Likely causes (Probable): lookbook buttons use `aria-label="View: <alt>"` that doesn't contain their visible text; the home "Call shop"/logo labels similarly. Fix: make aria-labels start with the visible text, or drop them.
Positives: skip link, `lang`, one `h1` per page, labelled form fields, `role="alert"` on errors, reduced-motion handled, focusable scroll region for lookbook strip.

## SEO
- Titles and descriptions exist per page (Confirmed). Titles are good for the home page.
- Missing (Confirmed by grep): Open Graph/Twitter metadata, `metadataBase`, canonical URLs, custom favicon/app icons beyond the default, LocalBusiness JSON-LD.
- `robots.txt` disallows everything and `sitemap.xml` is empty **because demo mode is on** (intentional, stops search engines indexing the demo). Must change at launch.
- Business facts are consistent across header/footer/home (address, phone, hours) but unverified with the owner.
- Add after approval: LocalBusiness schema (name, address, phone, hours, sameAs Instagram), OG image, `NEXT_PUBLIC_SITE_URL`.
