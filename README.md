# Black Head Salon

Premium website concept for Black Head Salon, a barber shop in India. Planning docs are in `planning/`.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Checks

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm test` (unit)
- `npm run build`
- `npm run test:e2e` (Playwright, needs `npx playwright install chromium` once; starts the dev server itself)

## Modes

- `NEXT_PUBLIC_SITE_TIER`: `premium` or `professional`
- `NEXT_PUBLIC_DEMO_MODE`: `true` shows sample content, keeps the site out of search engines, and runs the booking and owner dashboard in memory. Nothing is sent to a real phone or inbox.
- `NEXT_PUBLIC_BOOKING_MODE`: `instant` confirms bookings straight away. `approval` leaves them pending for the owner.
- `NEXT_PUBLIC_SITE_URL`: public address for the sitemap. Leave empty in demo.

## Deploying the demo

The demo is a Next.js app, so any host that runs Next.js works. Vercel is the simplest.

1. Push the repository to GitHub.
2. Import it in Vercel. Use the default Next.js build settings.
3. Set `NEXT_PUBLIC_DEMO_MODE=true`, `NEXT_PUBLIC_SITE_TIER=premium`, and `NEXT_PUBLIC_BOOKING_MODE=instant` for the client demo.
4. Open the deployment and check `/robots.txt` shows `Disallow: /`.

Commercial use of Vercel needs a paid plan. The hobby plan is for personal projects only.

Known demo limits: bookings and dashboard changes are held in server memory, so they reset on each deploy or restart and are shared between visitors.
