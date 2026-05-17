# SOYL Lite PMS - UI Build Sequence (Reuse-First)

This sequence minimizes rework by building shared components before screen-specific ones. Use it as the frontend execution order.

---

## 1) Foundations (Week 2)

Build once and reuse everywhere:
- App shell layouts (Owner + Manager)
- Navigation: bottom nav, top action row, sticky CTA bar
- Tokens in Tailwind (colors, spacing, type scale)
- Typography and number formatting utilities
- Skeleton loader, empty state, toast/alert
- Status badge, metric card, list row
- Bottom sheet / modal

Deliverable
- /design page showing core primitives and patterns.

---

## 2) Forms and Inputs (Week 2-3)

These power 70% of screens:
- Text input with voice button
- Phone input
- Date range picker
- Currency input
- Select / combobox
- Toggle / checkbox
- File upload (ID proof)
- Confirmation dialog

Deliverable
- Form kit usable by onboarding, booking, check-in/out.

---

## 3) Lists, Tables, and Timeline (Week 3)

Reusable list and data views:
- List row with avatar + subtitle + status
- Timeline entry
- Table + mobile card list variant
- Filters + search input

Deliverable
- Usable in Pulse, Today, Story, Guests, Audit Log.

---

## 4) Booking Core (Week 4-5)

Screen-specific but central:
- Calendar grid
- Booking detail bottom sheet
- New booking form
- Check-in and check-out flows

Dependencies
- Date picker, room selector, guest input, payment inputs.

---

## 5) Owner Dashboards (Week 4)

Build on existing components:
- Pulse cards and lists
- Attention list (overdue styling)
- Today’s story timeline
- This week charts + table
- Daily summary card

---

## 6) Manager Operations (Week 5)

Compose from existing blocks:
- Today screen
- Requests
- Guests list + detail

---

## 7) Compliance and Trust (Week 6)

Add audit and compliance surfaces:
- Folio
- GST invoice / cash receipt PDF view
- C-form PDF view
- Police register view
- Audit log view
- Day close

---

## 8) Housekeeping and Room Controls (Week 6)

Room-level operations:
- Housekeeping board
- Room block
- Room change mid-stay

---

## 9) Settings and Notifications (Week 7)

- Settings sections
- Web push subscription UI
- Notification toggles

---

## 10) Offline, PWA, Polish (Week 8)

- Offline banner + queue badge
- PWA install prompt
- Page transitions (Framer Motion)
- Accessibility pass + QA

---

## Quick Reuse Map

Build in this order to reuse early:
1. Buttons, inputs, badges, cards
2. Lists, tables, timeline
3. Calendar grid + booking sheet
4. Owner Pulse + Manager Today
5. Requests + Guests + Folio
6. Compliance + Day Close
7. Housekeeping + Room block
8. Settings + Notifications

---

If you want, I can also add a component library checklist with acceptance criteria for each component (a11y, states, i18n, loading, error).