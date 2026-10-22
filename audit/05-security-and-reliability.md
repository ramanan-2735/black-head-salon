# 05 — Security and Reliability

Scope: code review plus read-only HTTP probes of a local production build. No real systems attacked, no secret values printed. `npm audit` was **not run** (needs network/registry access; not attempted). This is not an exhaustive security verification.

## Confirmed
- **S1 (P1 for production, acceptable for demo): `/admin` has no authentication.** In demo mode, anyone with the URL can view and change appointment statuses via a Server Action. The public Vercel deployment (`black-head-salon.vercel.app`, status 200 for `/admin`) exposes it. Mitigations today: `robots.txt` blocks indexing; data is sample-only. Don't enter real customer data into it. With `NEXT_PUBLIC_DEMO_MODE=false` admin returns 404 and booking returns 503, i.e. there is no "real" mode yet.
- **S2: Data is in memory.** Resets on restart/redeploy; on serverless (Vercel) different instances hold different data, so bookings can vanish or not be visible. (The `globalThis` fix helps within one process, not across instances.)
- **S3: No rate limiting or bot protection** on `/api/bookings` (spam can fill the day). Idempotency key and duplicate-phone check exist.
- **S4: No CSP or HSTS header.** Present: X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy (verified via `curl -I`).

## Good practice observed
- Zod validation on all inputs; E.164 phone normalisation; consent required server-side (`z.literal(true)`).
- No `dangerouslySetInnerHTML`, no secrets in repo (`.env.example` only has non-secret flags; no `.env` tracked).
- Errors don't leak stack traces (400/422/409 JSON).
- `NEXT_PUBLIC_*` flags only; no private keys in the bundle.

## Privacy / data integrity
- Customer name/phone/email are collected with a consent checkbox, but there is no privacy policy page (404) and no retention/deletion process. Needed before real use (India DPDP Act considerations: confirm with a professional; not legal advice).
- Photos of real people (lookbook) need consent/licence; provenance of current images is unverified.

## Repository hygiene
- An 86 MB `Godot_v4.7.2-stable_win64.exe.zip` is untracked in the project root. Don't `git add .`; delete or move it.
- Reference images (`1551…jpg`, `29ec…jpg`, `Barber Shop Website Design…jpg`, `jpg.jpg`) are **tracked** in git at the repo root; they are third-party design inspiration screenshots. Remove from the public repo before sharing it with anyone.

## Priorities
1. Before pitch: nothing blocking beyond disclosing "demo, no login".
2. Before launch: real DB, admin auth, rate limiting, privacy page, CSP/HSTS, `npm audit`, backup/ops plan.
