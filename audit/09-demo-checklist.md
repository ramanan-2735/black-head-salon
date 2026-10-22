# 09 — Demo Checklist

## Launch verification (30 min before)
- [ ] Stop the old dev server. Run `npm run build` then `npm start` (or use the redeployed Vercel URL). No "N" dev badge in the corner.
- [ ] Confirm the lookbook and "Our craft" show the intended photos, not website screenshots.
- [ ] Open the URL on your phone over mobile data (not just office Wi-Fi).

## Mobile demonstration
- [ ] Home loads; headline and Book button visible without scrolling.
- [ ] Menu → each link → menu closes after tapping.
- [ ] Floating Call / WhatsApp pill: tap Call (dialer opens with the right number), tap WhatsApp (message prefilled). Cancel both.

## Navigation and CTAs
- [ ] Header Book, hero Book, Explore services, Full menu, View the lookbook, bottom "Book now".
- [ ] Footer links and Instagram link open.
- [ ] Do NOT rely on "Book this look" to prefill.

## Booking flow
- [ ] Services → Book prefilled → pick a time → name + 10-digit number (use 9876543210) + consent → confirmation with the demo note.
- [ ] Open `/admin/appointments` → the new booking is listed → Confirm it. (Needs the fixed build; verify before the meeting.)

## Business details
- [ ] Address, phone, hours, Maps link against Google Maps/owner. Hours currently 10:00–21:00 Mon–Fri, 09:30–21:30 weekends: unconfirmed.

## Placeholder / demo-data checks
- [ ] Prices, services (4), barbers "Marcus"/"Aryan", admin "Sample customer" rows are SAMPLE data. Say so.
- [ ] Photos: be ready to say whose they are.

## Fallbacks
- [ ] Record a 60-second phone screen capture of home → booking → confirmation.
- [ ] Screenshots of `/`, `/lookbook`, `/admin` saved offline.
- [ ] Hotspot ready; local `npm start` works without internet except Google Fonts (cached after first load: load it once beforehand).

## Disclose honestly
- Demo content and prices; in-memory bookings that reset; no confirmation messages sent; admin has no login yet; no real photos/team yet; not indexed by search engines; production needs database, hosting, auth, notifications, privacy policy.
