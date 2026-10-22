# 08 — Test Evidence

## Executed
| Check | Command / method | Result |
|---|---|---|
| Lint | `npx eslint` | exit 0, no findings |
| Typecheck | `npx tsc --noEmit` | exit 0 (also after fixes) |
| Unit tests | `npx vitest run` | 13 files, 72 tests passed (before and after fixes). Warning: `vitest.config.ts` is ESM in a CJS package (cosmetic). |
| Production build | `next build` in a scratch copy (dev server on :3000 left untouched; `NEXT_PUBLIC_DEMO_MODE=true`) | Compiled, TypeScript OK, 15 pages generated; rebuilt after fixes, OK |
| Route sweep | Playwright/Chromium at 375×812 (mobile), 768×1024, 1440×900 against :3000 | `/ /services /lookbook /book /admin /admin/appointments /admin/services /ui` all 200, 1 h1 each, no horizontal overflow; `/nope` and `/privacy` 404; `robots.txt`, `sitemap.xml` 200 |
| Console/network | same run | No page errors. Warnings: LCP image lacks priority. Only 404s were the intentional ones. |
| Accessibility | `@axe-core/playwright` on 5 routes, mobile | see report 04 |
| Booking flow | Playwright Pixel 7 on prod build :3100: preselect → date → slot → details → consent → confirm | Passed: "You're booked", Marcus, Fri 23 Oct 11:00 |
| Lookbook dialog | click first card, press Escape | opens/closes |
| API probes | `curl` invalid JSON, invalid body, past date, security headers | 400, 422, 200 empty, headers present |
| Bug B1 reproduce + fix | API booking then fetch `/admin/appointments` before/after `globalThis` store | before: absent; after: present |
| Bug B2 reproduce + fix | Mobile menu → link → `details.open` | before: true; after: false (page link and `/#visit`) |
| Deployed site | `curl` home, `/admin`, `/lookbook/fade.jpg` on Vercel | 200 / 200 / byte-identical to local file |

## NOT TESTED
- Lighthouse / Core Web Vitals (tool not in project; not installed per rules).
- `npm audit` (registry access not attempted).
- Project `e2e/` Playwright suite.
- Safari, Firefox, real phones, `tel:`/WhatsApp handoff, slow-network behaviour.
- Booking on the live Vercel site (avoided writing to a public demo).
- Professional tier (`NEXT_PUBLIC_SITE_TIER=professional`) and production mode (`DEMO_MODE=false`).
- Admin status buttons (code read, not clicked).
- Concurrency and long-running memory behaviour.

## Uncertainties
- Origin/licence of the four photos (visible third-party branding; AI/stock origin is inference).
- Cause of the stale image cache in the dev server (observed, not root-caused; restart expected to fix).
- Accuracy of hours, prices, phone, address: unverifiable from here.

## Files changed
`src/lib/booking/repository.ts` (globalThis store), `src/components/site/mobile-menu.tsx` (new), `src/components/site/site-header.tsx` (uses MobileMenu). Nothing committed or deployed. `.next/cache/images` was deleted (regenerable cache).
