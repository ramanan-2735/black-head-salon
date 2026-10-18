# 05 — Technical Architecture

> Black Head Salon — Phase 1 planning deliverable. Source: approved planning report (2026-10-18). Tags: P0/P1/P2 priority · [REAL] [PROTO] [3RD] [OWNER].

## 13. Recommended technical architecture

**Choice:** a **Next.js 15+ (App Router) monolith on Vercel** with Postgres. One deployable unit for marketing pages (static/ISR, fast and SEO-friendly), booking API (route handlers / server actions) and admin. A separate Express backend is **rejected**: more hosting, CORS, and two deploys for no gain at this scale. **Managed booking SaaS** (Fresha, Setmore, Square, Zoho Bookings) was evaluated. It is free or cheap and has reminders, but embedding it kills the bespoke booking UX that sells Premium, and it locks data in. It is kept as a **fallback recommendation** if the owner declines Premium but wants online booking (the Professional+ option).

```
Browser ── Next.js on Vercel (region bom1 Mumbai) ─────────────────────┐
  │  Marketing (SSG/ISR)  /  /services  /lookbook                      │
  │  Booking UI (client islands)  /book                                │
  │  Admin (server components, auth-gated)  /admin/*                   │
  │  Route handlers /api/*  ── lib/booking/availability.ts (pure)      │
  │                         ── repositories (Static | Demo | Prisma)   │
  ├── PostgreSQL (Supabase, ap-south-1)  via Prisma                    │
  ├── Cloudinary (images, signed uploads)                              │
  ├── Resend (email)   [opt] WhatsApp Cloud API / DLT SMS              │
  └── Vercel Cron → /api/cron/reminders, /api/cron/expire-pending ─────┘
```

**Folder structure (planned):**
```
src/app/(site)/{page,services,lookbook,book,book/manage/[token],privacy}
src/app/admin/{login,(dash)/{page,appointments,services,lookbook,staff,settings}}
src/app/api/{availability,bookings,bookings/[id],admin/*,cron/*,uploads/sign}
src/components/{ui,site,booking,admin,three}
src/lib/booking/{availability.ts,rules.ts,status.ts}   ← pure, 100% unit tested
src/lib/repos/{types.ts,static/,demo/,prisma/}
src/lib/{config.ts (tier/mode flags, zod-validated env),auth.ts,notify/,analytics.ts,tz.ts}
src/content/  (Professional + demo seed: services.ts, gallery.ts, business.ts)
prisma/{schema.prisma,migrations/,seed.ts}
public/three/razor.glb, public/three/razor-static-*.webp
```

**Flags:** `NEXT_PUBLIC_SITE_TIER=professional|premium`, `NEXT_PUBLIC_DEMO_MODE=true|false`. In `config.ts`, a Professional build doesn't render `/book` (CTA → WhatsApp) or `/admin` (404), and never imports Prisma (repository chosen at module level).

**Responsibilities:** frontend = presentation, step state, optimistic UI. Server = all validation (zod schemas shared), availability, booking transaction, auth, uploads signing, notifications. **No secrets in the client.** Only `NEXT_PUBLIC_*` values that are safe.

**Auth:** Auth.js v5 Credentials + Argon2id + database sessions (httpOnly, Secure, SameSite=Lax), middleware guarding `/admin`. Roles: `OWNER`, `MANAGER` (P2 `BARBER` read-only). Every admin route handler re-checks the session (no reliance on middleware alone). CSRF is handled by Auth.js and same-origin server actions.

**Notifications:** a `notify()` adapter with channels `email` (Resend), `whatsapp` (Meta Cloud API, pre-approved utility templates, Business verification required), `sms` (DLT-registered gateway e.g. MSG91, with sender ID and templates registered on DLT, which takes weeks). Each send is logged in `NotificationLog`. In demo mode, the adapter is a no-op that only logs.

**Analytics:** `EnquiryEvent` (type, page, timestamp, no IP/UA stored) via `navigator.sendBeacon` → aggregated in admin. Booking metrics are SQL over `Appointment`. Optional Plausible [3RD]. Cookieless, so no consent banner.

**SEO:** Metadata API per route, `sitemap.ts`, `robots.ts` (disallow `/admin`, `/book/manage`), `LocalBusiness`→`HairSalon`/`BarberShop` JSON-LD from **settings** (only populated fields emitted), OG image generated with `next/og` in brand style, canonical URLs.

**Env vars:** `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `CLOUDINARY_*`, `RESEND_API_KEY`, `WHATSAPP_*`, `SMS_*`, `CRON_SECRET`, `UPSTASH_*` (optional), tier/mode flags. Validated at boot with zod. `.env.example` committed.

**Deployment:** GitHub → Vercel (preview per PR). **Note: commercial use requires Vercel Pro (recurring fee).** The alternative is Netlify or Cloudflare. Prisma migrations run in CI (`prisma migrate deploy`). Separate Supabase projects for `demo` and `production`. Daily DB backups (Supabase plan dependent).

**Maintenance:** Renovate/Dependabot monthly. `README` + `docs/OPERATIONS.md` (how to add an admin, rotate secrets, restore backup).


## 14. Data model & API outline

Prisma models (essential fields; `id` cuid, `createdAt`/`updatedAt` implied):

- **BusinessSettings** (singleton): name, tagline, phone, whatsapp, email, addressLines, geo(lat,lng), mapsUrl, timezone (default `Asia/Kolkata`), currency (`INR`), confirmationMode (`INSTANT|APPROVAL`), slotGranularityMin (15), defaultBufferMin, minNoticeMin, maxAdvanceDays, cancelCutoffMin, pendingExpiryHours, reminderOffsetsMin int[], channelsEnabled json, socials json. *Validation:* E.164 phone; timezone in IANA list.
- **BusinessHours**: weekday 0–6, openMin, closeMin (minutes from midnight; multiple rows per weekday allow breaks). *Rule:* close > open, no overlaps within a weekday.
- **BlockedPeriod**: staffId? (null = salon-wide), startsAt, endsAt, reason, kind (`HOLIDAY|TIME_OFF|BLOCK`).
- **ServiceCategory**: name, slug (unique), sortOrder, isVisible.
- **Service**: categoryId, name, slug (unique), description, priceInPaise int, isFromPrice, durationMin (5–480), bufferMin?, imageId?, isFeatured, isVisible, sortOrder. *Money as integer paise.*
- **Staff**: name, slug, bio, photoId, isActive, sortOrder. **StaffSchedule**: staffId, weekday, startMin, endMin. **StaffService** (M:N eligibility).
- **Customer**: name, phoneE164 (unique), email?, marketingConsent bool + consentAt, lastVisitAt. *Created/updated at booking; deduped by phone.*
- **Appointment**: customerId, staffId, serviceId, **snapshot** fields (serviceName, priceInPaise, durationMin, so history survives edits), startsAt timestamptz, endsAt, blockedUntil (endsAt+buffer), status enum, source (`ONLINE|ADMIN|WALK_IN`), notes, idempotencyKey (unique), manageTokenHash (unique), expiresAt? (pending).
  **Raw SQL migration:** `CREATE EXTENSION btree_gist; ALTER TABLE "Appointment" ADD CONSTRAINT no_overlap EXCLUDE USING gist ("staffId" WITH =, tstzrange("startsAt","blockedUntil") WITH &&) WHERE (status IN ('PENDING','CONFIRMED'));`
- **AppointmentEvent**: appointmentId, type (created/confirmed/rescheduled/cancelled/...), actor (`CUSTOMER|ADMIN:<id>|SYSTEM`), payload json. Audit trail.
- **GalleryImage**: cloudinaryPublicId, width, height, alt (required), caption, category enum/table, serviceId?, staffId?, focalX/Y, consentConfirmed bool, isVisible, sortOrder.
- **Offer**: title, description, serviceId? | categoryId?, discountType (`PERCENT|FIXED|PRICE`), value, startsAt, endsAt, isActive.
- **NotificationLog**: appointmentId, channel, template, status, providerId, error, sentAt.
- **EnquiryEvent**: type (`WHATSAPP_CLICK|CALL_CLICK|DIRECTIONS_CLICK|BOOKING_STARTED|BOOKING_SUBMITTED`), path, at. No PII.
- **AdminUser**: email (unique), passwordHash, role, totpSecret? (encrypted), lastLoginAt. Plus Auth.js `Session` tables.
- *Not created:* Loyalty (P2, design later), Payments (P2), Reviews (no fake data; external link only).

**Professional vs Premium without duplication:** components consume `ContentRepository` (`getServices`, `getGallery`, `getBusiness`). Professional = `StaticContentRepo` reading `src/content/*.ts` with the same TypeScript types as Prisma output. Premium = `PrismaContentRepo`. Booking components consume `BookingRepository` (`getAvailability`, `createBooking`, …) → `DemoBookingRepo` | `PrismaBookingRepo`.

**Availability algorithm (`lib/booking/availability.ts`, pure):**
`slots(date, service, staffIds, data)`: for each staff → intervals = businessHours(date) ∩ staffSchedule(date) − blockedPeriods − existing appointments [start, blockedUntil) → walk candidate starts at granularity → keep start if [start, start+duration+buffer) fits a free interval ∧ start ≥ now+minNotice ∧ date ≤ today+maxAdvance. "Any" = union with first-fit staff noted. All computation in salon TZ, output ISO UTC + local label.

**API (route handlers, zod-validated, JSON):**
| Method & path | Auth | Purpose |
|---|---|---|
| GET `/api/availability?serviceId&staffId|any&date` | public, rate-limited | slots for a day |
| GET `/api/availability/days?serviceId&staffId&from&to` | public | which days have any slot (calendar enabling) |
| POST `/api/bookings` (Idempotency-Key) | public, rate-limited | create → `201 {status, manageUrl}` · `409 SLOT_TAKEN` · `422` |
| GET/PATCH `/api/bookings/manage/[token]` | token | view / reschedule / cancel within cutoff |
| POST `/api/events` | public | enquiry beacon |
| GET/POST/PATCH/DELETE `/api/admin/{appointments,services,categories,offers,gallery,staff,hours,blocked,settings}` | admin session | CRUD (or server actions) |
| POST `/api/admin/appointments/[id]/status` | admin | state-machine transition (validated) |
| POST `/api/uploads/sign` | admin | Cloudinary signed upload params |
| GET `/api/cron/{reminders,expire-pending}` | `CRON_SECRET` | scheduled jobs |
After each admin content mutation: `revalidateTag('services'|'gallery'|'settings')`.


## 16. Security, privacy, accessibility, SEO, performance

- **Security:** zod validation on every input. Prisma parameterised queries. Rate limits on booking, availability, login and events. Argon2id. Session cookie flags. Admin re-auth for sensitive settings (P2). CSP headers (self + Cloudinary + Resend none client-side). `X-Frame-Options DENY`. Signed Cloudinary uploads with type/size limits. Manage tokens hashed. Cron endpoints secret-protected. Audit log. `npm audit` in CI. No secrets in the repo.
- **Privacy (India DPDP Act 2023 + Rules) [confirm with owner/legal]:** a clear notice at collection (what, why, how long, contact for requests). Minimal data. Separate optional marketing consent. Customer data deletion on request (admin "Delete customer" anonymises appointments). **Retention proposal:** appointment PII anonymised 24 months after last visit. Notification logs 90 days. Enquiry events have no PII. Access limited to admin users. Data stored in the India region (Supabase Mumbai).
- **Accessibility (WCAG 2.2 AA target):** semantic landmarks, one `h1` per page, skip link, visible 2px brass focus ring with offset, contrast verified for all token pairs, labelled inputs with inline + summary errors, full keyboard support (menu, lightbox, calendar, slot grid, admin tables), alt text required in CMS, `prefers-reduced-motion` honoured, touch targets ≥44px, no information by colour alone (status pills include text).
- **SEO:** per-page titles/descriptions ("Black Head Salon — Barber in [Area, City]" [OWNER]), heading hierarchy, `BarberShop` JSON-LD from verified settings only, sitemap/robots, OG/Twitter cards, NAP consistent with the Google Business Profile [OWNER], fast mobile pages. No fabricated ratings in schema.
- **Performance budgets (measured, not promised):** LCP < 2.5s on mid-range Android over 4G; CLS < 0.05; INP < 200ms; initial JS < 150 KB gzip on marketing routes (3D chunk lazy, excluded); hero image ≤ 180 KB AVIF/WebP; fonts: 2 variable files, preloaded display subset. Static generation + ISR for marketing. `content-visibility` for long sections. Lighthouse CI in PRs.


