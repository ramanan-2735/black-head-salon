# 03 — Screen Specifications

> Black Head Salon — Phase 1 planning deliverable. Source: approved planning report (2026-10-18). Tags: P0/P1/P2 priority · [REAL] [PROTO] [3RD] [OWNER].

## 6. Screen 1 — Home ("The Wow Factor")  `/`

| Order | Section | Content & behaviour | Priority / type |
|---|---|---|---|
| 0 | Utility bar | Address short form · "Walk-ins welcome" [OWNER] · phone · Instagram. Hidden under 768px. | P0 [OWNER] |
| 1 | Nav | Wordmark · Services · Lookbook · About · Contact · **Book** (brass). Transparent over hero, solid ink + hairline after 80px of scroll. Mobile: wordmark + Book + menu button opening a full-screen overlay (focus-trapped). | P0 [REAL] |
| 2 | Hero | Asymmetric. Left 5 columns: eyebrow "PRECISION · CRAFT · CHARACTER" → Fraunces headline e.g. "Sharp is a *standard*." (copy placeholder) → 2-line support → **Book an Appointment** / Explore Services. Right 7 columns: darkened salon portrait (LCP image, `priority`) with the **3D razor** floating across the image edge, lit by warm key light. A huge ghost word "BLACK HEAD" is outlined at 4% opacity behind (from R4). Scroll unfolds the razor blade over the first ~60vh, then the hero recedes. | P0 [REAL]; 3D P0 [PROTO-quality visual] |
| 3 | Proof strip | 3–4 facts **only if confirmed** (e.g. "Since 20XX", "X barbers", "Open 7 days"). Otherwise use service-promise statements that aren't claims ("Hot towel finish", "Appointment or walk-in"). | P0 [OWNER] |
| 4 | Services preview | 5–6 ledger rows (name · short desc · dotted leader · "₹—" price) + "Full menu →". Hovering a row on desktop reveals a floating image. | P0 |
| 5 | Lookbook preview | Horizontal film-strip of 6 images (drag/scroll-snap), "View lookbook →". | P0 |
| 6 | The Chair (about) | Split band: interior photo + short story [OWNER copy] + barber portraits if multi-staff. | P1 [OWNER] |
| 7 | Reviews | **Only real reviews.** P2 option: Google Places rating + link ([3RD], API cost). Default: "Read our reviews on Google →" link. Never fabricated. | P2 [3RD][OWNER] |
| 8 | Visit | Map (static map image linking to Google Maps, so no heavy iframe on load), address, hours table (highlighting today), phone, WhatsApp, directions. | P0 [OWNER] |
| 9 | Booking CTA band | "Your chair is waiting." + Book button. | P0 |
| 10 | Footer | Wordmark, nav, services, hours, contact, socials, privacy link, "© Black Head Salon", demo badge in demo mode. | P0 |

States: hero degrades to the static razor render (no WebGL / reduced motion / slow connection). Map image fails → address text stays. Responsive: under 768px the hero stacks (headline → image with the static or lite razor), and a sticky bottom bar shows "Book" + WhatsApp.


## 7. Screen 2 — Services & Pricing  `/services`

- **Layout decision: editorial ledger rows, not cards.** Each category is a numbered chapter ("01 Haircuts", "02 Beard", "03 Shave & Face", "04 Colour", "05 Packages") [OWNER categories]. A row shows name, one-line description, duration ("45 min", only if confirmed), price (`₹—` placeholder; supports "from ₹X"), badges (Popular / Offer) and a **Book** link.
- Sticky category index (desktop left rail; mobile horizontal scroll-snap chip bar with scroll-spy). **No filters**, because the catalogue is small.
- **Packages/combos:** a highlighted panel with the included services, combined duration and package price; strike-through original price only when the owner sets a real offer.
- **Popular:** owner-flagged (`isFeatured`), never computed from fake data.
- **Offers:** an `Offer` attached to a service or package with valid-from/to dates. It is hidden automatically when expired. In demo it is labelled "Sample offer".
- Image: on desktop, hovering a row shows a cursor-following image (disabled for touch and reduced motion). On mobile, an optional thumbnail per category header.
- States: loading skeleton rows (prod, ISR-cached so rarely seen); empty category hidden; price missing → "Price on request".
- **Book** → `/book?service=<slug>`.
- Data contract: see `Service`/`ServiceCategory` (§14). Professional tier reads the same shape from `content/services.ts`.


## 8. Screen 3 — Lookbook  `/lookbook`

- **Composition:** an asymmetric editorial grid (12 columns, items spanning 4/5/7 columns with varied 3:4, 4:5 and 16:9 crops, deliberate vertical offsets). Not identical cards. Each image carries a small caption below: style name · category · barber (optional).
- **Categories:** All · Fades · Classic · Textured · Beard · Kids [OWNER]. A single-row chip filter, with the URL kept in sync (`?c=fades`). Motion layout animation when filtering (opacity only under reduced motion).
- **Lightbox:** full-screen `<dialog>` with focus trap, Esc to close, arrow keys and swipe, pinch-zoom left to the browser. It shows caption, alt text and **"Book this look"** → `/book?service=<linked>&note=<style>`.
- **Before/after (P2, consent required):** a draggable comparison slider for transformation pairs from R4, only with written customer consent [OWNER].
- **Images:** Cloudinary `f_auto,q_auto`, `srcset` 400–1600w, blur placeholder, lazy below the fold, explicit width/height (no CLS). Alt text is required at upload in admin.
- **Honesty:** demo uses licensed stock with "Sample image — not salon work" in captions and a page-level demo notice.
- States: empty category → "No looks here yet." Load error per image → ink tile with style name.


## 9. Screen 4 — Booking  `/book` (+ `/book/manage/[token]`)

**Flow (stepper from R3; each step is a URL search-param state so Back/refresh work):**
1. **Service** — grouped list, single select (P1: add-ons such as "+ Beard trim" that extend duration). Shows duration and price.
2. **Barber** — eligible staff for that service (`StaffService`) + **"Any available"** (default). Step skipped automatically if only one barber [OWNER].
3. **Date** — 14–30-day strip/calendar (`maxAdvanceDays` setting). Days with no availability are shown disabled with a reason ("Closed", "Fully booked").
4. **Time** — slots from the API grouped Morning / Afternoon / Evening, shown in salon local time (Asia/Kolkata). Refetched on focus. Unavailable at submit → friendly inline error + refreshed slots.
5. **Details** — name (required), mobile (required, Indian format +91 validation via `libphonenumber-js` min build), email (optional, for the confirmation), notes (optional, 300 chars), privacy consent checkbox (DPDP notice link). No account.
6. **Review** — full summary + edit links per step + cancellation policy text [OWNER].
7. **Submit** → server re-validates the slot inside a transaction. Result:
   - `instant` mode → **Confirmed** screen.
   - `approval` mode → **Request received — pending confirmation** screen ("We'll confirm by WhatsApp/SMS/email").
   Both offer `.ics` download, Google Calendar link, manage link, and WhatsApp the salon.
8. **Updates** — email via Resend (P1) and optional WhatsApp/SMS templates ([3RD], P2). Reminder 24h/2h before (cron).

**Desktop layout:** steps on the left (current step expanded, completed steps collapsed to summary lines) + a sticky **summary panel** on the right (from R3). **Mobile:** one step per screen, sticky bottom summary sheet ("Haircut · Any barber · —" + Continue).

**Rules & logic [REAL]:**
- Slot granularity 15 min (setting). Service duration + `bufferMinutes` (setting, per service override).
- `minNoticeMinutes` (e.g. 60), `maxAdvanceDays` (e.g. 30), cancellation/reschedule cutoff (e.g. 3h) — all owner settings [OWNER values].
- Duplicate prevention: (a) DB exclusion constraint per staff on `tstzrange(start, end+buffer)` for `PENDING|CONFIRMED`; (b) `Idempotency-Key` header from the client (UUID per review screen) stored on the appointment with a unique index; (c) reject if the same phone already has an overlapping active booking; (d) rate limiting per IP and per phone (Upstash or a Postgres counter).
- "Any available": the server tries eligible staff ordered by fewest bookings that day, inside the transaction, and catches the exclusion violation (`23P01`) to try the next one.
- Pending holds: a pending request blocks the slot. It auto-expires after `pendingExpiryHours` (setting), and the customer is told.
- **Status machine:** `PENDING → CONFIRMED | DECLINED | EXPIRED`; `CONFIRMED → COMPLETED | NO_SHOW | CANCELLED_BY_CUSTOMER | CANCELLED_BY_SALON`; reschedule = same row, new times, logged in `AppointmentEvent`.
- **Time zone:** store `timestamptz` (UTC). All business rules are evaluated in `settings.timezone` ("Asia/Kolkata", no DST). Date math via `date-fns` + `@date-fns/tz`.
- **Manage link:** `/book/manage/[token]`. The token is 32 random bytes; only its SHA-256 hash is stored. It expires after the appointment end + 7 days.
- **Privacy:** collect only name + phone (+ optional email/notes). Purpose-limited notice. Retention per §16.
- **Accessibility:** each step's heading gets focus on change. Slot buttons use `aria-pressed`. The calendar is a proper grid with arrow-key navigation. Errors are linked via `aria-describedby`. A live region announces "3 slots available".
- **States:** loading slot skeleton chips; empty day → "No times left on Tue 14. Next available: Wed 15, 10:30" (one-tap jump); network error → retry; slot taken → refresh + message; server error → "Couldn't complete booking. Nothing was booked." + WhatsApp fallback.
- **Demo [PROTO]:** identical UI. Slots come from the same `availability` engine over seeded demo data in a `DemoRepository` (per-browser session, resets). The confirmation reads "**Demo booking — no appointment was made and no message was sent.**"
- **WhatsApp stays separate:** "Prefer WhatsApp?" link only. It never creates a booking record.


## 10. Screen 5 — Owner dashboard  `/admin/*` (Premium only)

Same tokens and type, but functional: denser Geist UI, Fraunces only for page titles, ink surfaces, status colours. Mobile-first because the owner will mostly use a phone.

| Route | Content | Priority |
|---|---|---|
| `/admin/login` | Email + password (Argon2id), optional TOTP (P2), rate-limited, lockout after 5 failures. | P1 [REAL]; demo: "Enter demo dashboard" button, no auth [PROTO] |
| `/admin` Overview | Today timeline (by barber column on desktop, list on mobile) · Pending requests with Approve/Decline inline · counts (today, this week, pending, no-shows this month) · popular services (last 30 days, from real data) · enquiry clicks (WhatsApp/call/directions, own cookieless counter) · quick actions (+ Walk-in, Block time, Edit hours). Charts: simple bars via a light lib or hand-rolled SVG; label "Sample data" in demo. | P0 demo / P1 real |
| `/admin/appointments` | List + day/week calendar toggle; search by name/phone; filter by status/barber/date; detail drawer (customer, history, notes, status buttons, reschedule using the same slot picker, reassign barber, call/WhatsApp customer). | P0 demo / P1 real |
| `/admin/appointments/new` | Walk-in/manual booking; allowed to override notice rules but **not** the overlap constraint. | P1 |
| `/admin/services` | Categories (reorder by drag + up/down buttons for a11y) · service CRUD: name, slug, description, price, "from" flag, duration, buffer, eligible staff, featured, visible, image · offers: price/percent, date range, active. | P0 demo / P1 real |
| `/admin/lookbook` | Upload (Cloudinary signed upload, JPEG/PNG/WebP/HEIC ≤10 MB, min 1200px wide) → required alt text, caption, category, linked service, focal point → publish/hide → reorder. Consent checkbox "Customer agreed to publish". | P1 |
| `/admin/staff` | Barber profile (name, photo, bio, services), weekly schedule, time off. | P1 [OWNER: if >1 barber] |
| `/admin/settings` | Business info (name, address, phone, WhatsApp, map URL) · opening hours per weekday (multi-interval for lunch breaks) · closures/holidays · booking rules (confirmation mode, notice, advance window, granularity, buffer, cutoff, pending expiry) · notification preferences · admin users. | P1 |

No inventory, payroll, POS or multi-branch features. Out of scope by design.


