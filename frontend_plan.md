# SOYL Lite PMS - Frontend Build Plan (Phased)

This plan is derived from the PRD. It is focused only on the frontend and is structured to produce a premium, founder-impressing UI while staying faithful to the product pillars, screen specs, and tech constraints.

---

## 0) Product North Star (Read First)

These are non-negotiable and should influence every UI decision:
- Owner-first, manager-light: two modes, same data, different surfaces.
- Manager speed beats paper: measure flows on a real phone.
- Information never falls on the floor: request tracking and auditability are central.

Design constraints from the PRD:
- Three taps to anything.
- 48x48 touch targets minimum.
- Plain language; no jargon.
- i18n for every string; English is fallback.
- Offline-first; never lose data.
- One-thumb operation; bottom nav and sticky actions.
- No empty states without a CTA.
- Looks matter; aspirational like Mews, not cheap.

---

## 1) Phase 1 - Discovery and Visual Direction (Week 1)

### Goals
- Lock the visual direction and design system tokens.
- Produce clickable prototypes for Owner Pulse and Manager New Booking.

### Steps
1. Competitive audit (1 day)
   - Use Vyapar, Khatabook, Hostelworld manager app, Hotelogix, eZee, Djubo.
   - Capture screenshots of:
     - Booking flows
     - Calendar grid
     - Request logging
     - Day close / cash positions
     - Empty states and CTAs
2. Define the visual mood (0.5 day)
   - Aspirational, warm, Indian.
   - Avoid generic SaaS blue.
   - Use a textured or gradient background for marketing pages; keep app screens warm and minimal.
3. Create design tokens (0.5 day)
   - Colors (from PRD):
     - Primary: #B85518
     - Secondary: #1F5C3F
     - Accent: #C9971F
     - Text: #1A1A1A
     - Muted: #5C5C5C
     - Background: #F5F4F0
     - Surface: #FFFFFF
     - Border: #D9D5CC
     - Danger: #8B2C2C
   - Type scale: 12 / 14 / 16 / 18 / 20 / 24 / 32 / 48
   - Use Noto Sans (latin + devanagari + kannada)
4. Figma components (1 day)
   - Buttons: primary / secondary / ghost / destructive
   - Inputs: text / phone / OTP / date / currency / voice-enabled
   - Select / combobox
   - Card, badge, tabs, avatar
   - Modal (desktop) / bottom sheet (mobile)
   - Table + responsive card list variant
   - Empty state, loading skeleton, toast/alert
5. Prototype key flows (1 day)
   - Owner Pulse screen
   - Manager New Booking (walk-in flow)

### Deliverable
- Figma file with tokens + components + 2 prototypes.

---

## 2) Phase 2 - App Scaffold and Design System in Code (Week 2)

### Goals
- Set up Next.js 14 App Router scaffold and base UI system.
- Build a hidden /design route showcasing all components.

### Steps
1. Project setup (in repo)
   - Create app with Next.js 14 App Router, TypeScript, Tailwind, src dir, alias @/*.
   - Install: shadcn/ui, lucide-react, zustand, tanstack query, react-hook-form, zod, next-intl, @ducanh2912/next-pwa, dexie, framer-motion.
2. App shell
   - Layout with app-level providers: theme, i18n, query client.
   - Sticky bottom nav for Manager Mode; top action row for Owner Mode.
   - Use one-thumb ergonomics: primary actions at bottom.
3. Design system implementation
   - Map PRD tokens into Tailwind config.
   - Create base UI components under src/components/ui.
   - Add voice-input variant for text inputs.
4. /design route
   - Render every component variant with usage examples.
   - Include responsive examples (mobile and desktop).

### Deliverable
- Working design system in code and /design page.

---

## 3) Phase 3 - Routing, i18n, and Core Layouts (Week 3)

### Goals
- Implement the structure for both modes and onboarding.
- Set up i18n for EN/HI/KN with strict rules.

### Steps
1. Routing structure
   - /[locale]/(marketing)
   - /[locale]/(auth)
   - /[locale]/onboarding
   - /[locale]/app/owner/*
   - /[locale]/app/manager/*
2. next-intl setup
   - messages/en.json, messages/hi.json, messages/kn.json
   - All strings via i18n keys, nested
   - Use ICU for plurals
3. Typography + number formatting
   - Noto Sans with subsets
   - Indian number formatting for INR
4. Implement shared layouts
   - Owner Mode shell: top summary bar, alerts slot, quick actions
   - Manager Mode shell: bottom nav with central action button

### Deliverable
- Fully wired route structure with locale switching.

---

## 4) Phase 4 - Owner Mode Core (Week 4)

### Goals
- Build the owner-facing screens that sell the product.

### Screens
1. Pulse (home)
2. What needs attention
3. Today’s story (timeline)
4. This week (charts + table)
5. Daily summary (WhatsApp-ready message)

### Implementation notes
- Pulse is scannable in 15 seconds.
- Attention screen surfaces issues with strong visual priority.
- Timeline uses a clear vertical rhythm and timestamps.
- Charts are simple, high-contrast, and readable on small screens.

### Deliverable
- Owner Mode functional with mock data.

---

## 5) Phase 5 - Manager Mode Booking Core (Week 5)

### Goals
- Make Manager Mode faster than paper for daily actions.

### Screens
1. Today (arrivals, departures, in-house, open requests)
2. Calendar room grid (7/14/30 day)
3. New booking (single screen, voice-first)
4. Check-in flow
5. Check-out flow
6. Booking detail + modification
7. Cancellation + no-show
8. Stay extension
9. Room change
10. Group booking (basic)

### Speed-first UX
- Single-screen forms with smart defaults.
- Sticky bottom CTA for key actions.
- Voice input prominent on every text field.

### Deliverable
- Demo: create, modify, cancel, extend, and check-out.

---

## 6) Phase 6 - Requests, Guests, Housekeeping, Day Close (Week 6)

### Goals
- Ship the trust and transparency features that owners buy.

### Screens
1. Requests (log, route, resolve)
2. Guests list + detail
3. Housekeeping board
4. Day close + cash position
5. Reports (Occupancy, Revenue, GST)
6. Audit log (read-only)
7. Police register (PDF flow)

### Deliverable
- Owner sees request status in real time and cash variance clearly.

---

## 7) Phase 7 - Settings, Compliance, Notifications (Week 7)

### Goals
- Finalize compliance workflows and system settings.

### Screens
1. Settings
   - Property profile
   - Rooms
   - Rates + overrides
   - Tax (GST)
   - Staff
   - Language
   - Notifications
2. Compliance flows
   - GST invoice generation
   - C-form PDF
   - ID proof capture + consent
3. Notifications
   - Web Push subscription flow
   - Deep links to relevant screens

### Deliverable
- All compliance and notification UX working end to end.

---

## 8) Phase 8 - Offline, PWA, Polish (Week 8)

### Goals
- Ensure offline-first behavior and premium UX polish.

### Steps
1. Offline UX
   - Persistent offline banner
   - Queue count badge
   - Clear sync status feedback
2. PWA
   - Install prompt flow
   - App icon set
   - Splash screen design
3. Motion and micro-interactions
   - Page transitions only (Framer Motion)
   - Staggered list reveal for focus
4. Accessibility and QA
   - Lighthouse >= 90 performance, >= 95 a11y, 100 PWA
   - Test on real Android device

### Deliverable
- PWA-ready, polished frontend.

---

## 9) Visual Craft Checklist (For Founder-Impressing UI)

- Use bold type hierarchy with strong headings (24/32/48) on key dashboards.
- Use a warm surface background (#F5F4F0) and clean cards with soft borders (#D9D5CC).
- Introduce subtle texture on marketing pages (gradient or paper-like).
- Use consistent metric cards: icon + big number + small label.
- Provide meaningful empty states with a clear CTA.
- Ensure Manager Mode is quieter and more functional; Owner Mode is richer.

---

## 10) Recommended Build Order (Per Screen Dependencies)

1. Core UI components
2. App shells (owner + manager)
3. Onboarding
4. Owner Pulse
5. Manager Today + Calendar
6. New Booking
7. Booking detail + lifecycle flows
8. Requests
9. Guests
10. Housekeeping
11. Day Close
12. Reports
13. Settings + Compliance
14. Notifications

---

## 11) Final Acceptance Criteria (Frontend)

- All UI strings live in i18n keys.
- All screens work in EN/HI/KN.
- All screens responsive across 360px to desktop.
- Offline-first behavior present where required.
- No greyed-out pro features.
- Touch targets >= 48px.
- Owner Mode and Manager Mode feel distinct yet consistent.

---

If you want, I can also create a second document mapping each screen to a UI component checklist and a data dependency checklist (for mock data or API shape).