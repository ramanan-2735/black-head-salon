# 07 — Implementation Roadmap

> Black Head Salon — Phase 1 planning deliverable. Source: approved planning report (2026-10-18). Tags: P0/P1/P2 priority · [REAL] [PROTO] [3RD] [OWNER].

## 17. Implementation roadmap

| Phase | Deliverables | Depends on | Needed for first demo? |
|---|---|---|---|
| 0 | Write `planning/01–08` from this report; user approval | — | ✔ |
| 1 | Scaffold Next.js + TS + Tailwind v4 + ESLint/Prettier + Vitest + Playwright; tokens, fonts, `config.ts` flags, repo interfaces, demo seed content | 0 | ✔ |
| 2 | Design system primitives (Button, Eyebrow, Ledger row, Section, Dialog, Stepper, SlotChip, Field) + **static razor render approved** | 1 | ✔ |
| 3 | Screens 1–3 static (Home, Services, Lookbook) with real responsive images and motion | 2 | ✔ |
| 4 | Pure availability engine + unit tests; booking flow UI on `DemoBookingRepo`; demo labels | 2 | ✔ |
| 5 | Demo dashboard (Overview, Appointments, Services) on demo repo, labelled sample data | 4 | ✔ |
| 6 | 3D hero (R3F, lazy, gated) + motion polish | 3 | ✔ (static fallback acceptable if time-boxed) |
| 7 | A11y/perf pass, demo deploy (`DEMO_MODE=true`) → **client demo & feedback** | 3–6 | ✔ |
| 8 | *(after purchase)* Prisma schema, migrations incl. exclusion constraint, `PrismaRepos`, booking API + concurrency tests | 7 + owner info | — |
| 9 | Auth.js admin, full CRUD (services, lookbook, staff, hours, settings, offers), revalidation | 8 | — |
| 10 | Notifications: email (Resend) + cron reminders/expiry. Optional WhatsApp/SMS after registration | 9 | — |
| 11 | Security hardening, privacy page, analytics, SEO/JSON-LD with real data, full regression | 9–10 | — |
| 12 | Production content swap (owner checklist), domain, prod env, backups, owner training + handover docs | 11 | — |

Professional tier = phases 1–3 + 7 + 12 (static content repo, no booking/admin).

**Testing strategy:** Vitest unit tests for availability (hours, breaks, buffers, blocks, notice, max advance, multi-staff "any", day boundaries in IST) and the status machine. Integration tests on a test Postgres asserting the exclusion constraint. **Concurrency test**: 20 parallel POSTs for one slot → exactly 1 × 201, 19 × 409. Playwright e2e: book→confirm, slot-taken path, manage/cancel, admin approve, walk-in, price edit reflects on site. `@axe-core/playwright` on every route. Lighthouse CI budgets. Manual device testing on a low-end Android + iPhone Safari.

**Definition of done (per feature):** meets acceptance criteria, typed (no `any`), tests passing, axe clean, keyboard verified, works at 360px, reduced-motion checked, no console errors, demo/prod behaviour verified, docs updated.

**Demo → production transition:** set `DEMO_MODE=false` · replace `src/content` and seed with owner-approved data (and move into DB) · real logo, photos (with consent) and copy · remove "sample" labels (automatic via flag) · create production DB + run migrations · create owner admin account · configure Resend domain (SPF/DKIM) · set real hours/rules · privacy notice approved · GBP-consistent NAP + JSON-LD · domain + HTTPS · backups verified · test bookings on prod, then delete.


