# 06 — Client Sellability

## Honest assessment
A convincing, good-looking **concept with a genuinely working booking engine**, honestly labelled as demo. It is sellable as "design + working prototype, here's what's needed to go live". It is not sellable as "finished and ready for customers".

## Best things to show
1. Mobile home → tap **Book** → service → barber → time → confirm (instant, live slots, demo disclaimer).
2. Open `/admin`: pending queue, today's schedule, confirm/decline/complete.
3. Floating **Call / WhatsApp** pill on phone.
4. Services & prices ledger, lookbook with filters and enlarged view, location + hours + directions.

## Safe to demonstrate
Browsing, services, lookbook, booking flow (from a production build or the redeployed Vercel URL), admin status buttons, directions link.

## Must be labelled as prototype / needs implementation
- Booking persistence (in-memory), SMS/WhatsApp/email confirmations (none sent), admin login, editing services in admin (read-only), real service menu/prices, real barbers, real photos, privacy policy, search-engine indexing.
- "Book this look" does not prefill.

## Likely objections
- "Are these my photos / my prices?" (No — samples. Have the real ones requested.)
- "Will customers get a confirmation message?" (Not yet; costs apply.)
- "Who hosts it, who edits prices, what does it cost per month?"
- "Can my staff log in securely?" (Premium work.)

## Professional vs Premium (from `planning/04-feature-matrix.md`, estimates not commitments)
- **Professional**: static brand site — home, services, lookbook, contact/WhatsApp, hours/location. Fits an owner who just wants to be found and called. (`NEXT_PUBLIC_SITE_TIER=professional` flag exists; I did not test that tier.)
- **Premium**: adds online booking, owner dashboard, reminders. The demo already shows this, so the difference is easy to *show*; it is the harder to *deliver* (database, auth, notifications, hosting, ongoing support).

## Questions to ask the owner
Real menu and prices; staff names and whether they're happy being named; which days/hours (and holidays); does the owner want approval or instant booking; who answers WhatsApp; own photos and customer consent; domain/Google Business profile; budget for SMS/WhatsApp API; who maintains content.

## Suggested walkthrough (8 min)
Say upfront it's a concept with sample content → phone: home → services → lookbook → Book end-to-end → show confirmation → laptop: admin → confirm the booking → show Professional vs Premium → ask the questions above → agree what you need from them.

## Production work and ongoing costs to discuss
Domain, hosting, database (e.g. managed Postgres), auth for the owner, notification provider fees, privacy policy, photo shoot or licensed photos, SEO/LocalBusiness setup, Google Business profile, backups, monthly maintenance retainer, content-change policy.
