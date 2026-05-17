# SOYL Lite PMS - Frontend Master Plan

Executive summary
This master plan consolidates the frontend roadmap, screen checklists, build sequence, and component acceptance criteria. Follow the phase plan for delivery, use the screen checklist for completeness, execute in the reuse-first sequence to save time, and validate each component against the acceptance checklist.

---

## 1) Phased build plan (summary)

Phase 1 - Discovery and visual direction
- Competitive audit and visual mood
- Design tokens and Figma components
- Prototype Pulse + New Booking

Phase 2 - App scaffold and design system in code
- Next.js 14 setup, Tailwind tokens
- /design component gallery

Phase 3 - Routing, i18n, core layouts
- Locale routing and next-intl
- Owner + Manager shells

Phase 4 - Owner Mode core
- Pulse, Attention, Story, Week, Summary

Phase 5 - Manager booking core
- Today, Calendar, New Booking, Check-in/out
- Booking detail + lifecycle flows

Phase 6 - Trust features
- Requests, Guests, Housekeeping, Day Close
- Reports, Audit Log, Police register

Phase 7 - Settings, compliance, notifications
- GST, C-forms, ID proof, Push

Phase 8 - Offline, PWA, polish
- Offline UX, install flow, motion, a11y

---

## 2) Screen-by-screen checklist

Source of truth
- See frontend_screen_checklist.md

Usage
- Before building a screen, copy its checklist into your task and ensure every component and data field is implemented.

---

## 3) Reuse-first build sequence

Source of truth
- See frontend_build_sequence.md

Usage
- Build in order to minimize rework and keep UI consistent.

---

## 4) Component acceptance checklist

Source of truth
- See frontend_component_acceptance.md

Usage
- Every reusable component must pass this list before being used across screens.

---

## 5) Recommended weekly focus

Week 1
- Figma tokens + two prototypes

Week 2
- Design system + app scaffold

Week 3
- i18n + onboarding + shells

Week 4
- Owner Mode core

Week 5
- Manager booking core

Week 6
- Trust features + housekeeping + day close

Week 7
- Settings + compliance + notifications

Week 8
- Offline, PWA, polish

---

## 6) Quick links (local docs)

- frontend_plan.md
- frontend_screen_checklist.md
- frontend_build_sequence.md
- frontend_component_acceptance.md
