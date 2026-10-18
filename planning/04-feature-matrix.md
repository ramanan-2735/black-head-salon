# 04 — Feature Matrix

> Black Head Salon — Phase 1 planning deliverable. Source: approved planning report (2026-10-18). Tags: P0/P1/P2 priority · [REAL] [PROTO] [3RD] [OWNER].

## 11. Premium feature matrix

| Feature | Prof. | Premium | Problem solved | Customer side | Owner side | Dependencies / backend | Security / privacy | Complexity | Launch |
|---|---|---|---|---|---|---|---|---|---|
| Visual design | Polished responsive | Custom art direction + 3D hero | Credibility, premium pricing | Wow + clarity | — | Design system | — | M / L | Both P0 |
| Services & pricing | Static file | Owner-managed (DB) | Outdated prices | Clear menu, book CTA | Edit in admin | `ContentRepository` (static / prisma) | Admin auth | S / M | P0 |
| Gallery | Static grid + lightbox | Filterable lookbook, book-this-look, admin upload | Show quality | Browse → book | Upload/reorder | Cloudinary | Upload validation, consent | S / M | P0 / P1 |
| WhatsApp enquiries | `wa.me` link | Same + click analytics | Quick questions | Prefilled chat | — | None | No PII stored | S | P0 |
| Time-slot booking | ✗ (WhatsApp CTA) | Real engine | Phone tag, double booking | Self-serve 24/7 | Fewer calls | Postgres, availability engine | PII, rate limits | L | P0 demo / P1 real |
| Booking management | Manual (WhatsApp) | Admin dashboard | Overview of the day | Manage link | Approve, reschedule, no-show | Auth.js, DB | Auth, audit log | L | P1 |
| Automated reminders | ✗ | Optional: email included; WhatsApp/SMS paid | No-shows | Reminder messages | Toggle channels | Resend; Meta WhatsApp Cloud API or BSP; DLT-registered SMS | Consent, opt-out | M + setup lead time | P2 [3RD] |
| Photo/price updates | Developer-assisted | Admin editing | Owner autonomy | Fresh content | Self-service | DB + Cloudinary + ISR revalidate | Auth | M | P1 |
| Offers & loyalty | Static offer block | Offer manager; loyalty P2 | Promotions | See offers | Schedule offers | `Offer` table | — | S / M (loyalty L) | Offers P1, loyalty P2 |
| Analytics | None/basic | Booking + enquiry reporting | Know what works | — | Dashboard counts | Own cookieless `EnquiryEvent` + appointment queries; optional Plausible [3RD] | No personal tracking, no cookie banner needed | S / M | P1 |

**Included in Premium:** everything above except paid messaging (WhatsApp/SMS fees + setup), Google reviews API, loyalty, online deposits (Razorpay, P2) and staff logins. These are optional upgrades.

**Acceptance (per feature):** see §20 and `04-feature-matrix.md`.


## 15. Professional vs Premium scope & commercial strategy

| | Professional | Premium |
|---|---|---|
| Pages | Home, Services, Lookbook (static), Contact/Visit, Privacy | + Booking, Manage booking, Admin |
| Booking | WhatsApp + call CTAs | Real slot booking, instant/approval |
| Content updates | Developer edits `content/*.ts` | Owner admin |
| 3D | Static razor render (no WebGL) — or live 3D as an add-on | Live 3D hero |
| Backend | None (static hosting, very low running cost) | Postgres, auth, cron, email |
| Analytics | None or Plausible | Enquiry + booking reporting |
| Rough effort (estimates, not commitments) | ~40–70 hours | ~160–260 hours incl. Professional base |
| Ongoing costs to discuss | Domain, static hosting (free tier possible) | Domain, Vercel Pro, Supabase (free → paid as data and backups grow), Cloudinary (free tier likely), Resend (free tier likely) |
| Optional extras (separately priced) | Managed booking SaaS embed | WhatsApp/SMS reminders (per-message fees + Meta verification / DLT registration), Google reviews widget, loyalty, deposits via Razorpay, staff logins, Hindi/regional language |

All third-party prices must be checked at proposal time. No figures are quoted here because they change. **No promises** of rankings, revenue or dates.

**Build order for the sale:** demo P0 first (design + all five screens on demo data). The real backend is built only after purchase. A monthly care plan (updates, backups, small edits) is a suggested recurring line item [owner's choice].


## 20. Demo acceptance criteria

1. All five screens are reachable from the nav and work at 360px, 768px, 1280px and 1920px with no horizontal scroll.
2. Every price, offer, review-like element, stat and image in demo shows a "sample/illustrative" label. A persistent "Demo" badge sits in the footer and on booking and admin pages.
3. Booking: complete flow end to end. Slots respect demo hours, buffers, a seeded holiday, already-booked demo slots and min notice. "Slot taken" and "no availability" states can be demonstrated. Confirmation says no real booking was made. Network tab shows no outbound messaging calls.
4. Toggling the demo setting between instant and approval changes the confirmation screen.
5. Demo dashboard shows the booking just made (same session), allows approve/decline/no-show, and a price edit appears on `/services` in the same session. All metrics labelled sample data.
6. Hero 3D loads after first paint on a capable desktop, and the static fallback shows with reduced motion, no WebGL, or on a low-end phone. No layout shift on swap.
7. Lighthouse mobile (demo deploy): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. axe: 0 serious/critical.
8. Keyboard-only run through the booking and lightbox succeeds, and focus is always visible.
9. No fabricated business facts anywhere. All owner-dependent fields display explicit placeholders.


