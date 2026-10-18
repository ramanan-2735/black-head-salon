# 01 — Product Vision

> Black Head Salon — Phase 1 planning deliverable. Source: approved planning report (2026-10-18). Tags: P0/P1/P2 priority · [REAL] [PROTO] [3RD] [OWNER].

## Context

A freelance pitch to a real barber/salon in India. The goal is a premium, 3D-enhanced website with real booking and an owner dashboard. It must be demoed convincingly to win the Premium package, and it must reduce cleanly to a cheaper Professional package. The project folder is **greenfield**: there is no application code, only four reference JPGs, `skills-lock.json`, and installed agent skills (`vercel-react-best-practices`, `prisma-database-setup`, `ui-ux-pro-max`, `web-design-guidelines`, `codebase-design`, `improve-codebase-architecture`). These skills point toward Next.js/React + Prisma, and the stack below follows them.

**Decisions confirmed with the user:** region **India** (INR ₹, `Asia/Kolkata`, TRAI DLT rules for SMS, DPDP Act 2023 for privacy). Visual base **dark + brass**. Booking confirmation is an **owner setting** (instant or approval).

**Plan-mode note:** this report is the source content for the eight `planning/0X-*.md` deliverables. **Step 1 after approval** is writing those files into `planning/` by splitting this document, as mapped in §21. That is still planning-only. No app code, dependency installs or scaffolding happen until the user approves again.

Priority tags: **P0** = needed for the first demo · **P1** = premium product · **P2** = optional/later.
Type tags: **[REAL]** functional requirement · **[PROTO]** prototype-only interaction · **[3RD]** optional third-party integration · **[OWNER]** needs owner confirmation.

---


## 1. Executive summary

- **What we build:** one Next.js codebase in two tiers (`professional` | `premium`) and two modes (`demo` | `production`). Each is controlled by an environment flag, with no separate builds.
- **Design:** "Barber's Ledger." Near-black and warm charcoal with a single restrained brass accent. A large editorial serif (Fraunces) is paired with a clean grotesk (Geist). The service menu is a printed price ledger instead of a card grid. The lookbook is editorial and asymmetric. There is one purposeful 3D object: a **brass-and-horn straight razor** in the hero. It unfolds on scroll, lazy-loads after first paint, and has a static render as fallback.
- **Booking:** a real availability engine (pure TypeScript, unit-tested) runs on PostgreSQL. A **GiST exclusion constraint** makes double-booking physically impossible. Customers need no account. They manage a booking through a signed link.
- **Pre-sale demo:** the same UI and the same availability engine run on a **seeded in-memory demo repository**. Nothing is sent and nothing persists, and everything is labelled "Demo — sample data." The expensive backend work (Postgres, auth, notifications) is built only once the owner buys Premium.
- **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS v4 + Motion + React Three Fiber (hero only, lazy-loaded) + Prisma + PostgreSQL (Supabase, Mumbai region) + Auth.js + Cloudinary + Resend (email). WhatsApp/SMS are optional paid integrations.


## 3. Product vision & target users

**Business objectives:** more booked appointments with less phone and WhatsApp back-and-forth. A premium perception that supports premium pricing. The owner can update prices and photos without a developer. Clear visibility of upcoming work.
**Audiences:** (a) local men aged 18–45 on mobile, coming from Google Maps or Instagram, deciding quickly; (b) regulars rebooking; (c) parents booking kids' cuts [OWNER: if the service exists]; (d) the owner/manager (non-technical, phone-first); (e) barbers (read-only view of their day, P2).
**Success criteria (measured after launch, not promised):** booking completion rate, share of bookings made online, WhatsApp/call clicks, Lighthouse mobile ≥90 performance and ≥95 accessibility on the demo build, and the owner able to change a price unaided in under 2 minutes.


## 4. Customer & owner journeys

**Customer, new:** Instagram/Maps → Home hero → "Explore services" → ledger row "Book this" → Booking (service preselected) → barber (or "Any available") → date → slot → name + phone (+ optional email) → review → submit → Confirmed / Pending screen with "Add to calendar" (.ics) and a manage link.
**Customer, from the lookbook:** Lookbook → open image → "Book this look" → booking with the linked service preselected and the style name copied into the notes.
**Customer, quick question:** sticky WhatsApp button → `wa.me` link with a prefilled message (no API).
**Customer, change of plans:** manage link → reschedule (same engine) or cancel, within the cutoff window.
**Owner, daily:** login → Overview (today's timeline, pending requests) → approve/decline → mark completed or no-show at the end of the day.
**Owner, walk-in:** Appointments → "+ Walk-in" → service/barber/now → saved, so the slot is blocked for others.
**Owner, upkeep:** Services → edit price → publish. Lookbook → upload → crop focus → category → publish. Hours → add a holiday closure.


## 18. Risks, assumptions, open questions

**Risks:** 3D asset quality (mitigate: static render approval gate) · owner photo supply (the design relies on photography, so plan a photo session [OWNER]) · scope creep into POS/loyalty · notification setup lead time (DLT/Meta verification takes weeks) · Vercel Hobby can't be used commercially (cost) · owner never approving pending bookings (mitigate: expiry + instant mode default suggestion) · stock imagery mistaken for real work (labelled).
**Assumptions:** English-only. Single location. IST only. No online payments at launch. Customers don't need accounts. 1–5 barbers. Owner uses a smartphone for admin.
**Open questions / unresolved decisions:**
1. Number of barbers, and whether customers choose a barber.
2. Default confirmation mode (instant vs approval) and cancellation policy wording.
3. Who sources the razor 3D model (commission vs licensed + re-material), and budget.
4. Notification channels wanted at launch (email only vs WhatsApp/SMS paid).
5. Is the Professional fallback a static site only, or Professional + embedded managed booking (Fresha/Setmore)?
6. Hosting account ownership (owner's accounts vs developer-managed).
7. Final hero headline/copy tone.


