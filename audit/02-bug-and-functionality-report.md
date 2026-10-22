# 02 — Bug and Functionality Report

Tested on a production build (`next build` + `next start`, port 3100, copy of the working tree) and the running dev server (port 3000), Chromium via Playwright, Pixel 7 emulation + 1440px desktop.

## Confirmed defects

| # | Sev | Finding | Evidence | Status |
|---|-----|---------|----------|--------|
| B1 | P1 | Booking made through the API does not appear in the admin on a production build (slot IS consumed). Admin could look empty during a live demo. | Posted a booking; `/admin/appointments` had 0 matches, availability showed the slot taken. After fix: 201 then present in the list. Cause: `let instance` in `src/lib/booking/repository.ts` is duplicated between route-handler and page bundles. | **FIXED + verified** (local only) |
| B2 | P2 | Mobile menu stays open after choosing a link (header persists across routes). | Playwright: open menu → Services → `details.open === true`. After fix: false for page link and `/#visit`. | **FIXED + verified** |
| B3 | P1 (env) | Dev server on :3000 serves stale optimizer output: `/lookbook` and home show web-design mockup screenshots. | Screenshot; Vercel and disk files match; clearing `.next/cache/images` did not help (in-memory in the running process). | Not fixed: restart dev server (user's process) |
| B4 | P2 | Lookbook "Book this look" links to `/book?look=<id>`, but the booking flow reads only `service`. Nothing is pre-filled. | `lookbook-browser.tsx`, `booking-flow.tsx` (only `params.get("service")`). DOC.md also admits this. | Not fixed (needs a decision) |
| B5 | P3 | `/privacy` is a 404, but the booking consent text and the API error mention a "privacy notice". | Probe: 404. Consent label itself doesn't link anywhere. | Not fixed |
| B6 | P3 | Default Next.js 404 page (unbranded, white). | `/nope` → "404: This page could not be found." | Not fixed |
| B7 | P3 | Admin pages have no `<main>` landmark; `/admin` title reads "Overview — Black Head Salon". | axe: `landmark-one-main`. | Not fixed |
| B8 | P3 | Hero is text-only; huge outlined "BLACK HEAD" watermark is cropped and collides with the demo badge/headline on mobile. | Screenshot `mobile-home`. | Subjective |

## Worked correctly (tested)
- All 12 routes return expected codes; no JS page errors; no failed network requests except the two intentional 404s.
- Lookbook dialog opens, closes on Escape.
- Booking: `?service=skin-fade` pre-selects; date strip; slots load; details validation; consent required; confirmation screen; demo disclaimer shown.
- API: bad JSON → 400, invalid body → 422 with field errors, past date → empty slots, conflict → 409.
- Floating Call/WhatsApp pill renders on phone widths.

## Unverified / NOT TESTED
- Playwright suite in `e2e/` (not run; I used my own probes).
- Real phone, Safari/iOS, Firefox.
- `tel:` and WhatsApp deep links on a real device (hrefs are built correctly in code).
- Live Vercel booking flow (read-only checks only; I did not create bookings on the public site).
- Concurrency / double-submit under load.
