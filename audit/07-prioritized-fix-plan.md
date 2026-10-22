# 07 — Prioritized Fix Plan

## Must fix before tomorrow
| Item | Effort | Rationale |
|---|---|---|
| Restart the dev server or demo from Vercel / `npm run build && npm start` (stale images, dev badge) | Small | Wrong images on screen is the most embarrassing possible failure. |
| Commit + deploy the two verified fixes (`repository.ts`, `mobile-menu.tsx`, `site-header.tsx`) | Small | Admin/booking mismatch and sticky menu would show live otherwise. |
| Relabel or replace the lookbook / interior photos; fix alt text and the "Our craft" claim | Small | Third-party branding in "your" photos destroys credibility. |
| Don't `git add .`: remove the 86 MB Godot zip from the project folder | Small | Avoid pushing it. |

## Should fix if time permits
| Item | Effort | Rationale |
|---|---|---|
| Hero image behind the headline | Medium | Biggest first-impression upgrade. |
| Rename or replace the map-less "Google Maps" card | Small | Looks unfinished. |
| `priority` on first lookbook image; fix aria-label mismatches (axe serious) | Small | Clean accessibility/perf story. |
| "Book this look" → prefill service or relabel | Small–Medium | Button promises more than it does. |
| Branded 404, `<main>` in admin | Small | Polish. |

## Can defer until after client approval
OG/Twitter metadata, LocalBusiness JSON-LD, favicon set, `metadataBase`; remove unused three.js code and deps; privacy policy page; rate limiting; CSP/HSTS; `npm audit`; run Lighthouse; e2e suite in CI; remove tracked reference images from git.

## Requires owner input or additional budget
Real services/prices/hours/staff/photos; database and hosting (Large); admin authentication (Medium–Large); SMS/WhatsApp/email notifications (Medium + running costs); domain and Google Business profile; legal/privacy review; ongoing maintenance.
