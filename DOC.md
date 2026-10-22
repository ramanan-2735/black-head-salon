# Black Head Salon — Technical Documentation (DOC.md)

> **Document Status**: Production-grade Codebase Audit & Reference Architecture  
> **Last verified**: 2026-10-22 against the working tree (`src/`, `e2e/`, `next.config.ts`).
> **Source of Truth**: Active codebase (`src/`, `package.json`, configuration files, test suites)  
> **Repository**: `ramanan-2735/black-head-salon`  
> **Target Framework**: Next.js 16.4.2 (App Router with Turbopack) & React 19.3.0

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Feature Inventory & Implementation Status](#2-feature-inventory--implementation-status)
3. [Technology Stack](#3-technology-stack)
4. [Project Directory Structure](#4-project-directory-structure)
5. [Architecture and Data Flow](#5-architecture-and-data-flow)
6. [Routes and Screens](#6-routes-and-screens)
7. [Component Reference](#7-component-reference)
8. [Design System and Visual Effects](#8-design-system-and-visual-effects)
9. [Business Logic and Feature Status](#9-business-logic-and-feature-status)
10. [API and Integrations](#10-api-and-integrations)
11. [Data Model and Database](#11-data-model-and-database)
12. [Environment Variables and Configuration](#12-environment-variables-and-configuration)
13. [Installation and Local Development](#13-installation-and-local-development)
14. [Testing and Quality Assurance](#14-testing-and-quality-assurance)
15. [Security, Privacy, and Reliability](#15-security-privacy-and-reliability)
16. [Deployment and Production Readiness Checklist](#16-deployment-and-production-readiness-checklist)
17. [Known Issues, Limitations, and Technical Debt](#17-known-issues-limitations-and-technical-debt)
18. [Developer Handover & Navigation Guide](#18-developer-handover--navigation-guide)
19. [Recommended Next Steps](#19-recommended-next-steps)

---

## 1. Project Overview

### Project Name & Purpose
**Black Head Salon** is a web application created for a premier salon/barbershop brand. It delivers an editorial brand presence, dynamic service pricing ledger, curated haircut lookbook, and a real-time booking reservation system accompanied by an internal salon owner management dashboard.

### Business Context
The application is tailored for Black Head Salon (salon-local timezone: `Asia/Kolkata`, operating currency: `INR` / Indian Rupee with prices specified in paise). It balances brand distinction with high-conversion appointment reservations.

### Primary Target Audience
1. **Salon Clients (Mobile & Desktop)**: Seeking appointment booking, service pricing, haircut inspiration, and instant salon contact (phone call or WhatsApp enquiry).
2. **Salon Owner / Staff**: Reviewing incoming appointment requests, managing capacity, confirming or declining requests, marking attendance (completed vs. no-show).

### Main User Journeys
1. **Client Booking Journey**: Land on Homepage $\rightarrow$ click "Book an appointment" $\rightarrow$ select service & barber $\rightarrow$ select available date & time slot $\rightarrow$ enter contact details & submit $\rightarrow$ instant confirmation or pending confirmation notice.
2. **Mobile Direct Contact Journey**: Open site on mobile $\rightarrow$ tap the floating pill on phones ("Call shop" via `tel:` or "WhatsApp us" via a prefilled WhatsApp message). It is hidden on `/book`.
3. **Lookbook Discovery Journey**: Browse `/lookbook` $\rightarrow$ filter styles (fades, classic, beard) $\rightarrow$ open look detail modal $\rightarrow$ click "Book this look". It links to `/book?look=<id>`, but the booking flow reads only the `service` parameter, so nothing is pre-filled yet.
4. **Owner Appointment Management Journey**: Access `/admin` $\rightarrow$ view today's schedule, pending queue, and 7-day volume $\rightarrow$ filter appointments by status (`/admin/appointments`) $\rightarrow$ accept, decline, complete, or cancel appointments via Server Actions.

### Current Project Status
- **Current Architecture**: **High-Fidelity Functional Demo / Prototype with In-Memory Persistence**.
- **Public Surface**: Fully functional Next.js App Router application deployed on Vercel (`https://black-head-salon.vercel.app`).
- **Data Persistence**: In-memory repository with comprehensive scheduling, collision prevention, and idempotency logic. Production database integration (PostgreSQL with Prisma) is planned for the next development tier.

---

## 2. Feature Inventory & Implementation Status

Implementation status categories:
- **Fully Implemented**: Code is written, tested, and actively functioning end-to-end.
- **Partially Implemented**: Working logic exists, but secondary capabilities or configurations are pending.
- **Mocked / Simulated**: Architectural contracts, UI, and business logic exist, but operate against mock memory or static mock data.
- **Planned / Unimplemented**: Architected or referenced in planning, but no execution code exists yet.

| Feature | Status | Key Source Files | Dependencies / Libraries | Limitations & Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Section & Brand Statement** | Fully Implemented | `src/app/(site)/page.tsx`<br>`src/components/ui/eyebrow.tsx` | Next.js, Tailwind CSS | Copy contains placeholder slogans awaiting client confirmation. |
| **Services & Pricing Menu** | Fully Implemented | `src/app/(site)/services/page.tsx`<br>`src/components/ui/ledger-row.tsx`<br>`src/content/services.ts` | Next.js, static content repo | Prices and categories are sample figures defined in `src/content/services.ts`. |
| **Curated Lookbook & Filter** | Fully Implemented | `src/app/(site)/lookbook/page.tsx`<br>`src/app/(site)/lookbook/lookbook-browser.tsx`<br>`src/components/ui/dialog.tsx` | Next.js, `@phosphor-icons/react` | Gallery items currently render styled SVG/CSS placeholder tiles (`src: null`). Real customer photography is pending. |
| **Lookbook Barber Attribution** | Fully Implemented | `src/components/site/barber-badge.tsx`<br>`src/lib/gallery.ts` | React | Displays barber credits (e.g. "Cut by Sample barber 1 · Fade & Beard Sculpt"). |
| **3-Stage Booking Engine** | Fully Implemented (Demo Repository) | `src/app/(site)/book/booking-flow.tsx`<br>`src/app/api/bookings/route.ts`<br>`src/app/api/availability/route.ts` | Zod, `@phosphor-icons/react` | Full frontend client state with slots loaded via API. Submits to `/api/bookings`. In-memory state resets on server restart. |
| **Slot Availability Engine** | Fully Implemented | `src/lib/booking/availability.ts`<br>`src/lib/booking/time.ts` | Pure TypeScript | Computes 15-minute granularity slots against working hours, staff schedules, advance booking limits, buffer times (10m), and notice periods. |
| **Floating Mobile Action Bar** | Fully Implemented | `src/components/site/mobile-book-bar.tsx`<br>`src/lib/site-nav.ts` | `@phosphor-icons/react` | Hides on `/book`, where the sticky booking action bar takes the bottom edge. Only renders call/WhatsApp buttons when phone/WhatsApp numbers are non-null in business config. |
| **Instagram Community Banner** | Fully Implemented | `src/components/site/instagram-callout.tsx` | Phosphor Icons | Direct link to `@blackheadsalon` with accessible tab notices. |
| **Owner Admin Dashboard** | Fully Implemented (Demo Mode) | `src/app/admin/page.tsx`<br>`src/app/admin/appointments/page.tsx`<br>`src/app/admin/actions.ts` | Next.js Server Actions, Suspense | Unauthenticated demo mode. Displays live in-memory stats, queue filtering, and status action triggers. |
| **Admin Services View** | Partially Implemented | `src/app/admin/services/page.tsx` | Next.js | Read-only presentation in demo mode. Service editing is planned for the database tier. |
| **Database Persistence** | Mocked / Simulated | `src/lib/booking/booking-repository.ts`<br>`src/lib/booking/seed.ts` | In-Memory Map & Array | All bookings, slot holds, and status transitions persist in process memory. Resets on redeploy or restart. |
| **Authentication & RBAC** | Planned / Unimplemented | `src/app/admin/layout.tsx` | N/A | In demo mode, admin has no login requirement (`NEXT_PUBLIC_DEMO_MODE=true`). If `isDemo=false`, admin routes return `404 notFound()`. |
| **SMS / Email Dispatch** | Planned / Unimplemented | `src/lib/booking/repository.ts` | N/A | Booking confirmations currently return status in API response only; external notifications (Twilio, Resend) are not hooked up. |

---

## 3. Technology Stack

| Technology / Library | Detected Version | Purpose | Usage in Project |
| :--- | :--- | :--- | :--- |
| **Next.js** | `16.4.2` | Core Full-Stack React Framework | App Router (`src/app`), Server Components, Server Actions, Route Handlers (`/api`), Turbopack build engine. |
| **React** | `19.3.0` | Frontend UI Runtime | Component rendering, hooks, progressive hydration. |
| **React DOM** | `19.3.0` | DOM Renderer for React | Web document mounting and portal management. |
| **TypeScript** | `^5` | Strict Static Type Checking | Full codebase coverage (`tsconfig.json` with strict type checking enabled). |
| **Tailwind CSS** | `^4` | Utility-First Styling System | Modern Tailwind v4 engine using `@import "tailwindcss"` and `@theme inline` in `src/app/globals.css`. |
| **@tailwindcss/turbopack** | `^4` | Turbopack CSS Loader Integration | Configured inside `next.config.ts` for fast hot-module replacement and styling compilation. |
| **Three.js** | `^0.186.1` | WebGL 3D Scene Graph Engine | Unused since the razor was removed from the site. Kept for the 3D code that is still in the repository. |
| **@react-three/fiber** | `^9.8.2` | React Declarative Wrapper for Three.js | Declarative canvas `<Canvas>`, `<primitive>`, and `useFrame` animation hook. |
| **Zod** | `^4.6.7` | Schema Validation & Type Inference | Request body validation in `/api/bookings`, `/api/availability`, admin status mutations, and environment parsing. |
| **@phosphor-icons/react** | `^2.1.10` | Accessible Vector Icon Library | Interface iconography: `Clock`, `Phone`, `WhatsappLogo`, `InstagramLogo`, `Scissors`, `ArrowRight`, `Check`. |
| **Vitest** | `^5.0.5` | Fast Unit Test Runner | Unit and integration testing across business logic, date calculations, and booking state machines (72 tests passing). |
| **Playwright** | `^1.64.1` | End-to-End Browser Automation | E2E functional test suites (`e2e/`), mobile emulation, and accessibility validation. |
| **@axe-core/playwright** | `^4.14.0` | Automated Accessibility Testing | Integrated into Playwright tests to detect WCAG violation regressions. |
| **ESLint & Prettier** | ESLint `^9`, Prettier `^3.9.10` | Code Quality, Linting & Formatting | Code consistency and style enforcement. |
| **Vercel** | Edge / Node.js 24 | Deployment & Serverless Hosting | Continuous deployment linked to GitHub `ramanan-2735/black-head-salon`. |

---

## 4. Project Directory Structure

```
c:\Users\Ramanan\Desktop\Black Head Salon\
├── .agents/                 # Local agent customizations and installed agent skills
├── e2e/                     # Playwright end-to-end test specs
│   ├── admin.spec.ts        # Admin overview, queue, and status transition tests
│   ├── booking.spec.ts      # Multi-step booking flow and slot selection tests
│   ├── design-system.spec.ts# Primitives showroom verification
│   └── site.spec.ts         # Navigation, accessibility, and public page smoke tests
├── planning/                # Product specifications and architectural design documents
│   ├── 01-product-vision.md
│   ├── 02-design-reference-analysis.md
│   ├── 03-screen-specifications.md
│   ├── 04-feature-matrix.md
│   ├── 05-technical-architecture.md
│   ├── 06-3d-and-motion-plan.md
│   ├── 07-implementation-roadmap.md
│   └── 08-owner-information-checklist.md
├── public/                  # Static assets served at root
│   └── file.svg, globe.svg, next.svg, vercel.svg, window.svg
├── src/
│   ├── app/                 # Next.js App Router root
│   │   ├── (site)/          # Route group: Public customer-facing marketing pages
│   │   │   ├── book/        # /book — 3-stage interactive appointment booking flow
│   │   │   ├── lookbook/    # /lookbook — Style gallery with filters and modals
│   │   │   ├── services/    # /services — Complete service catalog and ledger
│   │   │   ├── layout.tsx   # Site shell (Header, Main, Footer, MobileBookBar)
│   │   │   └── page.tsx     # Homepage (Hero, Ledger preview, Lookbook preview, Visit)
│   │   ├── admin/           # /admin — Salon owner dashboard (Demo mode)
│   │   │   ├── appointments/# /admin/appointments — Status-filtered appointment list
│   │   │   ├── services/    # /admin/services — Catalog oversight (read-only)
│   │   │   ├── actions.ts   # Server Actions: setAppointmentStatus
│   │   │   ├── appointment-row.tsx # Individual appointment UI with actions
│   │   │   ├── layout.tsx   # Admin dashboard shell with navigation
│   │   │   ├── page.tsx     # Admin overview: stats, pending queue, today's schedule
│   │   │   └── status-actions.tsx # Interactive action triggers (Confirm, Decline, Complete)
│   │   ├── api/             # HTTP Route Handlers
│   │   │   ├── availability/# GET /api/availability — Slot availability calculation
│   │   │   └── bookings/    # POST /api/bookings — Appointment creation & conflict detection
│   │   ├── ui/              # /ui — Internal design system primitives showroom
│   │   ├── favicon.ico
│   │   ├── globals.css      # Core theme tokens, CSS animations, surfaces
│   │   ├── layout.tsx       # Root HTML document, font loading (Fraunces & Geist)
│   │   ├── robots.ts        # Search crawler directives
│   │   └── sitemap.ts       # XML sitemap generator
│   ├── components/
│   │   ├── site/            # Domain-specific site layout components
│   │   │   ├── barber-badge.tsx    # Styled staff attribution badge
│   │   │   ├── hours-list.tsx      # Formatted opening hours display
│   │   │   ├── instagram-callout.tsx# Instagram handle card
│   │   │   ├── mobile-book-bar.tsx # Sticky mobile floating Call/WhatsApp actions
│   │   │   ├── placeholder-image.tsx# Styled SVG fallback tile for images
│   │   │   ├── reveal.tsx          # CSS scroll-linked entry reveal wrapper
│   │   │   ├── site-footer.tsx     # Site footer with hours, address, and legal credits
│   │   │   └── site-header.tsx     # Sticky top navigation with disclosure mobile menu
│   │   ├── three/           # 3D Graphics & progressive enhancement
│   │   │   ├── razor-canvas.tsx    # Three.js fiber canvas with material shaders & lights
│   │   │   └── razor-hero.tsx      # Progressive loader & device-capability gate
│   │   └── ui/              # Reusable design system primitives
│   │       ├── button.tsx          # Standardized button variants & ButtonLink
│   │       ├── demo-badge.tsx      # Explicit demo mode banner
│   │       ├── dialog.tsx          # Accessible modal dialog with focus traps
│   │       ├── eyebrow.tsx         # Tracked uppercase typography eyebrow
│   │       ├── field.tsx           # Form text and telephone inputs with error hints
│   │       ├── ledger-row.tsx      # Editorial pricing row with duration and direct CTA
│   │       ├── section.tsx         # Standardized content section with titles
│   │       ├── slot-chip.tsx       # Interactive time-slot radio chip
│   │       └── stepper.tsx         # Multi-step progress indicator
│   ├── content/             # Structured business data & configuration
│   │   ├── booking-rules.ts # Granularity (15m), buffers (10m), advance windows
│   │   ├── business.ts      # Address, phone, WhatsApp, Instagram, timezone
│   │   ├── gallery.ts       # Lookbook image catalog and style tags
│   │   ├── services.ts      # Service categories, prices in paise, durations
│   │   └── staff.ts         # Barber profiles and individual weekly shifts
│   └── lib/                 # Core utilities, state machines, and business domain logic
│       ├── booking/         # Scheduling engine, availability algorithms, memory repository
│       ├── repos/           # Content repository interfaces & static implementations
│       ├── cn.ts            # Class name merger helper
│       ├── config.ts        # Environment schema parsing and feature flags
│       ├── format.ts        # Currency (INR) and duration formatting
│       ├── gallery.ts       # Lookbook filtering and attribution logic
│       ├── hours.ts         # Salon opening hours formatting
│       ├── site-nav.ts      # Navigation constants, telephone, and WhatsApp URL builders
│       └── three-gate.ts    # Hardware and accessibility capability evaluator
├── .env.example             # Documented environment variable definitions
├── next.config.ts           # Next.js configuration and security headers
├── package.json             # NPM dependencies, scripts, and engine specifications
├── playwright.config.ts     # Playwright test configuration
├── tsconfig.json            # TypeScript configuration
└── vitest.config.ts         # Vitest unit test configuration
```

---

## 5. Architecture and Data Flow

### Architectural Pattern
The application follows a **Modular Clean Architecture** pattern leveraging Next.js React Server Components (RSC) for zero-client-JS presentation, coupled with focused Client Components (`"use client"`) for rich interactive states (booking stepper, modals).

```mermaid
graph TD
    User([Customer / Client]) -->|HTTP Request| NextRouter[Next.js App Router]
    
    subgraph Public Surface
        NextRouter -->|/ (Home)| PageHome[Page RSC: Homepage]
        NextRouter -->|/services| PageServices[Page RSC: Services Menu]
        NextRouter -->|/lookbook| PageLookbook[Page RSC: Lookbook Browser]
        NextRouter -->|/book| PageBook[Page Client: BookingFlow]
    end

    subgraph Internal & Admin Surface
        NextRouter -->|/admin| AdminOverview[Page RSC: Admin Overview]
        NextRouter -->|/admin/appointments| AdminAppts[Page RSC: Appointments List]
        AdminAppts -->|Server Action: setAppointmentStatus| AdminActions[actions.ts]
    end

    subgraph Content & Domain Layer
        PageHome --> ContentRepo[Static Content Repository]
        PageServices --> ContentRepo
        PageLookbook --> ContentRepo
        ContentRepo --> StaticFiles[(src/content/)]
        
        PageBook -->|GET /api/availability| RouteAvail[Route: availability]
        PageBook -->|POST /api/bookings| RouteBook[Route: bookings]
        
        RouteAvail --> BookingRepo[Booking Repository Singleton]
        RouteBook --> BookingRepo
        AdminOverview --> BookingRepo
        AdminActions --> BookingRepo
        
        BookingRepo --> AvailabilityEngine[Availability Engine<br>availability.ts]
        BookingRepo --> InMemoryStore[(In-Memory Appointment Storage)]
    end
```

### Data Flow Lifecycle

1. **Static Content Flow**:
   - `contentRepository` (`src/lib/repos/static-content-repo.ts`) abstracts access to business data, services, and lookbook images.
   - Server Components call repository methods asynchronously (`getServiceCategories()`, `getGallery()`, `getBusiness()`), which currently read from typed data structures in `src/content/`.
   - Invisible or unconfirmed items are filtered out at the repository layer.

2. **Booking Flow & Availability**:
   - Customer selects a service $\rightarrow$ `BookingFlow` fires an HTTP `GET /api/availability?serviceId=...&staffId=...&date=...`.
   - The route handler invokes `BookingRepository.getAvailability(...)`.
   - The scheduling engine computes valid start times:
     - Discards past times or times violating `minNoticeMin` (60m).
     - Checks salon-level opening hours for that weekday.
     - Checks individual barber shifts and breaks.
     - Excludes collisions against active appointments (`PENDING` or `CONFIRMED`) and adds a 10-minute post-cut buffer.
     - Returns available 15-minute slot intervals as ISO timestamps.

3. **Appointment Submission & Collision Locking**:
   - Customer submits details $\rightarrow$ `POST /api/bookings` receives request with a client-generated UUID `idempotencyKey`.
   - Zod validates parameters (including Indian mobile number normalization).
   - In-memory repository checks:
     - **Idempotency**: Replays appointment if key was previously processed.
     - **Duplicate Customer Bookings**: Prevents the same phone number from booking overlapping slots.
     - **Slot Contention**: Ensures no other booking has taken the slot in the interim.
   - Status defaults to `CONFIRMED` if `NEXT_PUBLIC_BOOKING_MODE=instant` or `PENDING` if `approval`.

4. **Owner Status Transitions**:
   - Admin triggers a status change (e.g. Confirm, Decline, No-show).
   - Server Action `setAppointmentStatus(id, newStatus)` validates allowed state transitions against the `canTransition` state machine.
   - Calls `revalidatePath("/admin", "layout")` to refresh server-streamed administrative statistics.

---

## 6. Routes and Screens

| Route Path | Type / Rendering | Purpose | Main Components | Data Sources | Access / Auth Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`/`** | Server Component (Static) | Main landing page: brand hero, menu highlights, lookbook preview, shop visit details. | `LedgerRow`<br>`BarberBadge`<br>`HoursList` | `contentRepository` | Public |
| **`/services`** | Server Component (Static) | Comprehensive catalog of salon services grouped by category. | `LedgerRow`<br>`DemoBadge` | `contentRepository` | Public |
| **`/lookbook`** | Server / Client Hybrid | Style inspiration gallery with category filters and high-res detail modals. | `LookbookBrowser`<br>`Dialog`<br>`BarberBadge` | `contentRepository` | Public |
| **`/book`** | Client Component (Interactive) | 3-stage customer booking engine with real-time slot selection and a sticky price summary. | `BookingFlow`<br>`Stepper`<br>`SlotChip`<br>`Field` | `/api/availability`<br>`/api/bookings` | Public |
| **`/admin`** | Server Component (Dynamic Stream) | Executive overview: today's appointments, pending approval requests, weekly volume. | `Overview`<br>`AppointmentRow`<br>`Stat` | `getBookingRepository()` | Demo Only (`404` if not demo mode). Unauthenticated. |
| **`/admin/appointments`** | Server Component (Dynamic Stream) | Search/filter appointments by status (`PENDING`, `CONFIRMED`, `COMPLETED`, etc.). | `AppointmentList`<br>`AppointmentRow` | `getBookingRepository()` | Demo Only (`404` if not demo mode). Unauthenticated. |
| **`/admin/services`** | Server Component (Static) | Read-only administrative inspection of service categories, prices, and visibility. | `ServicesAdminPage` | `src/content/services.ts` | Demo Only (`404` if not demo mode). |
| **`/ui`** | Server Component (Static) | Internal design system showroom displaying tokens, typography, and interactive components. | `InteractiveDemo`<br>`LedgerRow`<br>`Stepper` | Static primitives | Demo Only (`404` if not demo mode). |
| **`/robots.txt`** | Route Handler | Search engine indexing rules (blocks indexation in demo mode). | `robots.ts` | `config.isDemo` | Public |
| **`/sitemap.xml`** | Route Handler | Search engine XML sitemap (empty in demo mode). | `sitemap.ts` | `config.isDemo` | Public |

---

## 7. Component Reference

### UI Primitives (`src/components/ui/`)

#### 1. `Button` & `ButtonLink` (`button.tsx`)
- **Responsibility**: Standardized interactive triggers adhering to design system tokens.
- **Props**:
  - `variant`: `"primary"` (brass filled), `"secondary"` (bone-bordered outline), `"tertiary"` (clean text).
  - Standard button or anchor HTML attributes.
- **Key Behavior**: Touch targets are at least 44px. Primary and secondary are 48px (`min-h-12`), tertiary is 44px (`min-h-11`).

#### 2. `Dialog` (`dialog.tsx`)
- **Responsibility**: Accessible modal wrapper for lookbook style details.
- **Props**: `open: boolean`, `onClose: () => void`, `title: string`, `children: ReactNode`.
- **Key Behavior**: Built on the native `<dialog>`, so `showModal()` gives focus trapping, Escape to close, and an inert background. A click on the backdrop also closes it.

#### 3. `Field` (`field.tsx`)
- **Responsibility**: Labelled input with the label above the field, plus a hint and an error message. Both are linked with `aria-describedby`, and `aria-invalid` is set on error.
- **Props**: `id`, `label`, `hint?`, `error?`, `required?`, standard input props.

#### 4. `LedgerRow` (`ledger-row.tsx`)
- **Responsibility**: Editorial pricing list item displaying service name, description, duration, price, and booking CTA.
- **Props**: `service: Service`, `bookHref: string`.

#### 5. `SlotChip` (`slot-chip.tsx`)
- **Responsibility**: Toggle chip for one bookable time. `aria-pressed` shows the selection, and `disabled` marks a slot as unavailable.
- **Props**: `time: string`, `selected: boolean`, `disabled?: boolean`, `onSelect: () => void`.

#### 6. `Stepper` (`stepper.tsx`)
- **Responsibility**: Visual progress indicator displaying step names and active/completed states.
- **Props**: `steps: string[]`, `current: number`.

### Domain & Site Components (`src/components/site/`)

#### 1. `BarberBadge` (`barber-badge.tsx`)
- **Responsibility**: Subtle bronze badge attributing haircuts or appointments to a specific barber.
- **Props**: `label: string`.

#### 2. `MobileBookBar` (`mobile-book-bar.tsx`)
- **Responsibility**: Floating action pill for mobile viewports providing one-tap phone calling and WhatsApp inquiries.
- **Props**: `phone: string | null`, `whatsapp: string | null`.
- **Key Behavior**: Returns `null` when current pathname starts with `/book` or when phone/WhatsApp numbers are missing.

#### 3. `HoursList` (`hours-list.tsx`)
- **Responsibility**: Renders formatted weekly opening hours or an explicit placeholder if unconfirmed.

#### 4. `PlaceholderImage` (`placeholder-image.tsx`)
- **Responsibility**: Renders a dark CSS tile with a visible label when a photo is `null`. It is not an SVG and has no texture.

#### 5. `RazorHero` & `RazorCanvas` (`src/components/three/`), not used
- **Responsibility**: Progressive 3D straight-razor presentation. Not rendered anywhere since the razor was removed from the site. The files remain in the repository.
- **Key Behavior**: Evaluates device hardware and accessibility preferences via `canRunRazor3D`. Lazy-loads the Three.js bundle only after the primary hero layout has painted.

---

## 8. Design System and Visual Effects

### Visual Theme: "The Barber's Ledger"
The aesthetic draws inspiration from traditional gentlemen's barber ledgers and lamplit grooming parlours. The theme is strictly dark-only—there is deliberately no light mode.

### Curated Color Palette (`src/app/globals.css`)
- **Base Surfaces**:
  - `--color-ink-950` (`#13110f`): Core background surface.
  - `--color-ink-900` (`#1c1917`): Elevated card and section surface.
  - `--color-ink-800` (`#252019`): Highlighted surfaces and inputs.
- **Hairlines & Dividers**:
  - `--color-line` (`#3d3428`): Subtle bronze dividing lines.
  - `.surface-warm` (`globals.css`): raised surface with a faint warm backlight, used on cards, the booking summary, the floating bar and dialogs.
- **Typography & Foreground**:
  - `--color-bone-100` (`#f1ebe1`): High-contrast primary headings and text.
  - `--color-bone-300` (`#cbc4b8`): Secondary body copy.
  - `--color-bone-500` (`#9a9184`): Muted labels, captions, and metadata.
- **Metallic Accents (strictly $\le 5\%$ viewport coverage)**:
  - `--color-brass-400` (`#c9a46a`): Primary brand gold/brass accent.
  - `--color-brass-300` (`#ddc08f`): Hover state accent.
  - `--color-brass-600` (`#9c7a45`): Darker metallic border tones.
- **Functional Semantics**:
  - `--color-ok` (`#7fa27b`): Confirmed status.
  - `--color-warn` (`#d9a74a`): Pending status.
  - `--color-err` (`#d2675a`): Collision or validation error.

### Typography
- **Headlines / Display**: `Fraunces` (`--font-fraunces`), a warm, high-character serif loaded via `next/font/google`.
- **Interface / Body Copy**: `Geist Sans` (`--font-geist-sans`), clean modern geometric sans-serif loaded via `next/font/google`.
- **Numbers**: Configured with `tabular-nums` across the entire document for aligned pricing and time slots.

### Motion, 3D & Accessibility
- **CSS Scroll Reveals**: Key sections incorporate pure CSS view-timeline animations (`@keyframes reveal`) with zero JavaScript overhead.
- **Prefers-Reduced-Motion**: Fully respected via global CSS overrides (`animation-duration: 0.01ms !important; transition-duration: 0.01ms !important;`).
- **Progressive 3D Gate**: `canRunRazor3D` is still defined in `src/lib/three-gate.ts`, but nothing renders the razor, so it has no effect on the site today.

---

## 9. Business Logic and Feature Status

### Scheduling Engine (`src/lib/booking/`)
- **Slot Granularity**: Configured at 15-minute intervals.
- **Turnaround Buffer**: 10-minute sanitation and prep buffer enforced after every booking (`blockedUntil = endsAt + 10m`).
- **Minimum Notice**: Customers cannot book appointments starting within 60 minutes of the current time.
- **Booking Window**: Appointments can be scheduled up to 30 days in advance.
- **Collision Protection**: Strict interval overlap checks prevent double-booking the same barber or slot.
- **Customer Conflict Prevention**: Prevents the same phone number from having two overlapping appointments.

### Appointment State Machine (`src/lib/booking/status.ts`)
Valid status states and permitted transitions:
- `PENDING` $\rightarrow$ `CONFIRMED`, `DECLINED`, `CANCELLED`
- `CONFIRMED` $\rightarrow$ `COMPLETED`, `NO_SHOW`, `CANCELLED`
- `DECLINED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`: Terminal states (no transitions permitted).

### Persistence & Data Reality
- **Current Data**: In-memory array initialized with realistic sample appointments (`src/lib/booking/seed.ts`).
- **Limitation**: Any server reboot, deployment, or serverless cold restart discards modified booking statuses and resets to initial seed data.

---

## 10. API and Integrations

All API routes are located in `src/app/api/`.

### 1. `GET /api/availability`
- **Purpose**: Calculate free start times for a service, date, and barber.
- **Query Parameters**:
  - `serviceId` (string, required): ID of bookable service.
  - `staffId` (string, required): Specific barber ID or `"any"`.
  - `date` (string, required): Date in format `YYYY-MM-DD`.
- **Validation**: Enforced via Zod (`availabilityQuerySchema`).
- **Responses**:
  - `200 OK`: `{ "slots": [{ "startsAt": "...", "label": "10:00" }, ...] }`
  - `404 Not Found`: `{ "error": "SERVICE_NOT_BOOKABLE" | "BARBER_NOT_FOUND" }`
  - `422 Unprocessable Entity`: `{ "error": "INVALID_QUERY" }`
  - `503 Service Unavailable`: `{ "error": "BOOKING_NOT_CONFIGURED" }` when `NEXT_PUBLIC_DEMO_MODE=false`. No database is wired yet.

### 2. `POST /api/bookings`
- **Purpose**: Create a new appointment booking.
- **Request Body**:
  ```json
  {
    "serviceId": "svc-classic-cut",
    "staffId": "barber-sample-1",
    "startsAt": "2026-10-23T10:00:00.000Z",
    "name": "Arun Kumar",
    "phone": "+91 98765 43210",
    "email": "arun@example.com",
    "notes": "Low taper fade please",
    "consent": true,
    "idempotencyKey": "uuid-v4-string"
  }
  ```
- **Validation**: Enforced via Zod (`bookingRequestSchema`).
- **Responses**:
  - `201 Created`: `{ "appointment": { id, serviceName, barberName, startsAt, endsAt, status } }`.
  - `200 OK`: Replayed existing booking (idempotency key match).
  - `409 Conflict`: `{ "error": "SLOT_TAKEN" | "DUPLICATE_BOOKING" }`
  - `422 Unprocessable Entity`: Validation failure with structured field errors.
  - `400 Bad Request`: `{ "error": "INVALID_JSON" }`.
  - `503 Service Unavailable`: `{ "error": "BOOKING_NOT_CONFIGURED" }` when `NEXT_PUBLIC_DEMO_MODE` is `false`.

### 3. Server Action: `setAppointmentStatus`
- **File**: `src/app/admin/actions.ts`
- **Signature**: `setAppointmentStatus(id: string, status: string): Promise<{ ok: true } | { ok: false; error: string }>`
- **Execution**: Validates the input against `APPOINTMENT_STATUSES`, then calls the repository `transition`, which enforces the state machine. It returns `NOT_AVAILABLE` outside demo mode, and it calls `revalidatePath("/admin", "layout")`.

### External Integrations
- **WhatsApp**: Built-in deep linking via `https://wa.me/<number>?text=<encoded_message>`.
- **External Notifications (SMS/Email)**: None connected currently.

---

## 11. Data Model and Database

### Current State
There is **no database engine running**. The application uses in-memory domain models.

### TypeScript Domain Models (`src/lib/repos/types.ts`, `src/content/staff.ts` and `src/lib/booking/booking-repository.ts`)

```typescript
interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceInPaise: number | null; // e.g., 30000 = ₹300.00
  isFromPrice: boolean;
  durationMin: number | null;
  isFeatured: boolean;
  isVisible: boolean;
}

interface Barber {
  id: string;
  name: string;
  serviceIds: string[];
  schedule: Record<number, { start: number; end: number }[]>; // Minutes from midnight
}

interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  startsAt: string;          // ISO Date string
  endsAt: string;            // ISO Date string
  blockedUntil: string;      // endsAt + bufferMin
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  idempotencyKey: string;
  createdAt: string;
}
```

`Business` (`types.ts`) also carries `instagram`. `GalleryImage` carries `barberId` (`null` means no credit) and `styleName`, which the barber credit line uses.

### Planned Database Migration
Prisma ORM setup (`.agents/skills/prisma-database-setup`) has been installed in the repository to facilitate mapping these models to PostgreSQL tables during the production hardening phase.

---

## 12. Environment Variables and Configuration

Validated via Zod in `src/lib/config.ts`, except `NEXT_PUBLIC_SITE_URL`, which `src/app/sitemap.ts` reads directly.

| Variable Name | Required / Optional | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_TIER` | Optional | `"premium"` | Read into `config.isPremium`, but no page checks it yet, so the tier does not change behaviour today. |
| `NEXT_PUBLIC_DEMO_MODE` | Optional | `"true"` | When `"true"`, renders demo banners, enables `/admin` without authentication, and allows in-memory booking. |
| `NEXT_PUBLIC_BOOKING_MODE` | Optional | `"instant"` | `"instant"` auto-confirms new bookings; `"approval"` leaves new bookings in `PENDING` status for owner review. |
| `NEXT_PUBLIC_SITE_URL` | Optional | `""` | Base URL for the sitemap. Used only when `NEXT_PUBLIC_DEMO_MODE` is `false`. Falls back to `https://example.invalid` when empty. |

> [!IMPORTANT]
> Never commit `.env` or `.env.local` files containing live credentials. The project includes `.env.example` as a template.

---

## 13. Installation and Local Development

### Prerequisites
- **Node.js**: Version `20.x` or `24.x` (Recommended: Node 24.x).
- **Package Manager**: `npm` (version `10.x` or higher).
- **Git**: Installed and configured.

### Step-by-Step Setup
1. **Clone Repository**:
   ```bash
   git clone https://github.com/ramanan-2735/black-head-salon.git
   cd "Black Head Salon"
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Server boots at `http://localhost:3000`.

### Available NPM Scripts
- `npm run dev`: Boots Next.js Turbopack development server.
- `npm run build`: Validates TypeScript and creates optimized production bundle.
- `npm run start`: Boots production server locally from built bundle.
- `npm run typecheck`: Runs `next typegen && tsc --noEmit` to verify type safety.
- `npm run lint`: Executes ESLint checks across the codebase.
- `npm test`: Runs Vitest unit test suite.
- `npm run test:e2e`: Runs Playwright end-to-end browser tests.
- `npm run format:check`: Validates formatting against Prettier rules.

---

## 14. Testing and Quality Assurance

### 1. Unit & Integration Tests (Vitest)
- **Suite Command**: `npm test`
- **Execution Status**: **Verified (13 Test Files, 72 Tests Passing)**.
- **Coverage Areas**:
  - `availability.test.ts`: Slot calculation, edge times, shift boundaries.
  - `booking-repository.test.ts`: Conflict detection, idempotency replaying, memory persistence.
  - `dashboard.test.ts`: Appointment count summarization and popular service ranking.
  - `schemas.test.ts`: Indian phone number normalization and booking request validation.
  - `status.test.ts` & `transition.test.ts`: State machine transition enforcement.
  - `three-gate.test.ts`: 3D hardware capability gating conditions.
  - `hours.test.ts`, `site-nav.test.ts`, `format.test.ts`: Helper utilities.

### 2. End-to-End Tests (Playwright)
- **Suite Command**: `npm run test:e2e`
- **Last run**: 52 tests across the mobile and desktop projects. 50 passed, and 2 were skipped by the existing config.
- **Specs Covered**:
  - `e2e/site.spec.ts`: Axe WCAG 2.x A/AA checks on `/`, `/services` and `/lookbook`. No horizontal scroll. Homepage CTA and services preview. Lookbook filter and lightbox. Skip link. Lookbook barber credits and the Instagram link.
  - `e2e/booking.spec.ts`: Axe check on `/book`. "Any available" is preselected. A full demo booking through the three stages. The server rejects a non-Indian number. No horizontal scroll on phones.
  - `e2e/admin.spec.ts`: Each admin page is labelled as sample data and passes Axe. Overview figures. Approving a pending request. Marking a confirmed appointment completed.
  - `e2e/design-system.spec.ts`: `/ui` passes Axe. The dialog opens and closes with Escape. An unavailable slot cannot be selected. A short name shows a linked error.

---

## 15. Security, Privacy, and Reliability

### Implemented Safeguards
1. **HTTP Security Headers** (`next.config.ts`):
   - `X-Frame-Options: DENY` (prevents clickjacking).
   - `X-Content-Type-Options: nosniff` (prevents MIME sniffing).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`.
2. **Idempotency Protection**: Every booking submission generates a client UUID to prevent double charges/bookings on network retries.
3. **Data Validation**: Strict input sanitization via Zod on all API endpoints.
4. **Privacy Consent**: Mandatory privacy agreement checkbox prior to booking submission.

### Observed Security & Reliability Gaps
- **Unauthenticated Admin**: `/admin` currently has no password or OAuth authentication barrier (governed only by `NEXT_PUBLIC_DEMO_MODE=true`).
- **In-Memory Storage Risk**: Unpersisted appointments will be erased whenever Vercel spins down or recycles the serverless instance.
- **Rate Limiting**: No rate-limiting middleware is currently configured on `/api/bookings` or `/api/availability`.

---

## 16. Deployment and Production Readiness Checklist

### Current Deployment
- **Hosting Provider**: Vercel (Edge network + Serverless Node.js).
- **Live URL**: `https://black-head-salon.vercel.app`
- **CI/CD Integration**: Automatically redeploys on pushes to branch `main` of `ramanan-2735/black-head-salon`.

### Handover Readiness Checklist

| Item | Status | Verification Detail |
| :--- | :--- | :--- |
| **Business Address & Maps** | Needs testing | Currently `null` in `src/content/business.ts`. Renders placeholder copy. |
| **Contact Phone & WhatsApp** | Needs testing | Currently `null` in `src/content/business.ts`. Floating bar is hidden until set. |
| **Opening Hours** | Needs testing | Currently `null` in `src/content/business.ts`. Renders fallback copy. |
| **Instagram Handle** | Needs confirming | Set to `blackheadsalon` in `src/content/business.ts`. Confirm the salon owns this account. |
| **Services & Real Pricing** | Needs testing | Currently contains sample catalogue prices in paise in `src/content/services.ts`. |
| **Staff & Barber Consent** | Needs testing | Staff profiles use sample names in `src/content/staff.ts`. |
| **Real Photography** | Needs testing | Lookbook uses CSS placeholder tiles (`src: null`). Requires client photos with consent, plus a barber and style for each credit. |
| **Database Persistence** | Not implemented | Currently in-memory only. Requires PostgreSQL + Prisma integration. |
| **Admin Authentication** | Not implemented | Requires NextAuth / Auth.js before disabling demo mode. |
| **Mobile UX & Tap Targets** | Checked in code | Buttons and chips are at least 44px. Not tested on a real phone. |
| **Accessibility (a11y)** | Checked by automated tests | Axe WCAG 2.x A/AA passes on the public, booking and admin pages in Playwright. `prefers-reduced-motion` is honoured. No manual audit yet. |
| **SEO Meta Tags & Robots** | Verified | OpenGraph and robots configured; indexation disabled during demo mode. |

---

## 17. Known Issues, Limitations, and Technical Debt

1. **Ephemeral Booking Storage**:
   - *Issue*: Bookings made on the live site are stored in volatile Node.js server memory.
   - *Impact*: Any redeployment or container recycle clears customer appointments.
2. **Admin Authentication Absence**:
   - *Issue*: In demo mode, anyone with the `/admin` URL can view demo appointments and trigger status changes.
3. **Vite Native Config Deprecation Notice during Vitest**:
   - *Issue*: Vitest displays a minor warning regarding ESM in `vitest.config.ts`.
   - *Fix*: Rename `vitest.config.ts` to `vitest.config.mts` or configure `"type": "module"`.
4. **Placeholder Imagery**:
   - *Issue*: The website does not bundle unverified stock photographs; placeholder tiles are rendered instead.
5. **Look Links Do Not Pre-fill**:
   - *Issue*: "Book this look" links to `/book?look=<id>`, but the booking flow reads only `service`.
   - *Impact*: The customer starts from step one with nothing pre-filled.
6. **Tier Flag Has No Effect**:
   - *Issue*: `NEXT_PUBLIC_SITE_TIER` is parsed into `config.isPremium`, but no page or route checks it.
   - *Impact*: The `professional` and `premium` builds behave the same today.

---

## 18. Developer Handover & Navigation Guide

### Where to Start Reading
1. **Core Configuration**: Check `src/lib/config.ts` to understand active feature flags.
2. **Business Content**: Review `src/content/business.ts` and `src/content/services.ts` where all customer-facing details originate.
3. **Booking Logic**: Start at `src/app/(site)/book/booking-flow.tsx`, then trace into `src/lib/booking/booking-repository.ts` and `src/lib/booking/availability.ts`.
4. **Styling & Tokens**: Review `src/app/globals.css` to inspect the theme tokens and surface utilities.

### Making Common Changes Safely
- **Updating Salon Details**: Modify `src/content/business.ts` (phone, WhatsApp, opening hours, address). The UI, footer, and mobile action bar will automatically react.
- **Updating Services & Prices**: Modify `src/content/services.ts`. Prices must be integer paise (`35000` = ₹350).
- **Adding Real Haircut Photos**: Place image files in `public/lookbook/` and update `src/content/gallery.ts` by setting `src: "/lookbook/filename.jpg"`, plus `barberId` (or `null`) and `styleName`.
- **Adding a 3D model later**: Keep uncompressed source models outside the repository, or in Git LFS, and put only optimised files in `public/`. The razor model was removed from the site. Its files are still in git history from the initial commit.

---

## 19. Recommended Next Steps

### Priority 1: Production Data & Business Hardening
1. Collect verified business details from the salon owner (phone number, WhatsApp number, physical address, and weekly operating hours) and populate `src/content/business.ts`.
2. Replace sample menu items with confirmed services, descriptions, durations, and prices in `src/content/services.ts`.

### Priority 2: Database Persistence
1. Initialize Prisma with a hosted PostgreSQL instance (e.g. Supabase, Neon, or Vercel Postgres).
2. Create schema models mirroring the existing TypeScript interfaces in `src/lib/repos/types.ts`.
3. Implement `PrismaBookingRepository` implementing `BookingRepository` to replace `createDemoBookingRepository`.

### Priority 3: Authentication & Security
1. Add an authentication layer (e.g. Auth.js or NextAuth) protecting `/admin` and Server Actions.
2. Implement rate limiting on `/api/bookings` using Upstash Redis or Vercel KV.

### Priority 4: Assets & Visual Polish
1. Obtain real customer haircut photography from the barbershop with client consent and replace the placeholder gallery items.
2. Connect an automated booking notification webhook (WhatsApp Business Cloud API or Twilio) to notify the salon owner immediately upon new bookings.
