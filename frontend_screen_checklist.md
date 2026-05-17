# SOYL Lite PMS - Screen-to-Component and Data Checklist

This document maps every PRD screen to: (1) UI component checklist and (2) data dependencies (mock data shape or API expectations). Use it to build consistently and avoid missing details.

---

## Legend
- Components: UI pieces to build or reuse.
- Data: fields needed for mock data and eventual API integration.
- Notes: UX rules, speed targets, and special requirements.

---

## A) Onboarding Flow (5 steps)

### 1. Welcome + language pick
Components
- Full-screen selection tiles
- Progress bar
- Primary CTA

Data
- languages: [{ code: "en" | "hi" | "kn", label }]
- selected_language

Notes
- Selection persists across sessions.

### 2. Property details
Components
- Text inputs
- File upload (logo)
- Select (property type)

Data
- property: { name, address, gstin?, phone, logo_url?, type }
- type options: hotel | homestay | guesthouse | lodge

### 3. Add rooms (bulk)
Components
- Stepper / number input
- Room type selector
- Base rate input
- Generated room list preview

Data
- room_types: [{ name, base_rate, count, auto_numbering }]

### 4. Set base rates
Components
- Rate input per room type
- Edit row

Data
- room_types: [{ id, name, base_rate }]

### 5. Set roles
Components
- Phone input list
- Add/remove manager
- Invite confirmation

Data
- managers: [{ phone }]

---

## B) Owner Mode - Pulse (home)
Components
- Greeting header
- Metric cards
- Attention banner
- Arrivals and departures lists
- In-house summary
- Quick actions footer

Data
- date
- occupancy: { occupied, total, percent }
- today: { check_ins, check_outs, earnings }
- attention_count, attention_overdue
- arrivals: [{ guest_name, room, eta, status }]
- departures: [{ guest_name, room, balance_due }]
- in_house_count

Notes
- Must be scannable in 15 seconds.

---

## C) Owner Mode - What needs attention
Components
- Sectioned list
- Overdue badges
- Acknowledge action

Data
- open_requests_over_4h: [{ id, guest, room, request, routed_to, elapsed }]
- unconfirmed_arrivals: [{ id, guest, room, eta, overdue_by }]
- payments_due: [{ id, guest, room, balance }]
- rooms_blocked_long: [{ room, blocked_for }]
- yday_misses: [{ type, description, resolved_late_at }]

Notes
- Each item links to its source entity.

---

## D) Owner Mode - Today’s story
Components
- Timeline list
- Filters (chips)
- Search input

Data
- events: [{ id, type, timestamp, summary, actor, ref_id }]

Notes
- This is the trust layer. Readable, chronological.

---

## E) Owner Mode - This week
Components
- Line chart
- Bar chart
- Stacked bar
- Metric card
- Table
- Date range toggle

Data
- occupancy_by_day: [{ date, percent }]
- revenue_by_day: [{ date, amount }]
- requests_vs_resolved: [{ date, open, resolved }]
- avg_response_time: { value, delta }
- per_room: [{ room, nights, revenue, avg_rate }]

---

## F) Owner Mode - Daily summary
Components
- Summary card
- WhatsApp CTA

Data
- summary: { hotel_name, date, occupancy, check_ins, check_outs, earnings, open_requests, link }

---

## G) Manager Mode - Today
Components
- Room availability card
- Arrivals list with swipe
- Departures list
- In-house list
- Requests badge

Data
- available_rooms_count
- arrivals: [{ booking_id, guest_name, room, status }]
- departures: [{ booking_id, guest_name, room }]
- in_house: [{ booking_id, guest_name, room }]
- open_requests_count

Notes
- No revenue or analytics.

---

## H) Manager Mode - Calendar (room grid)
Components
- Horizontal grid
- Sticky room column
- Booking bars
- Day range toggle
- Bottom sheet for booking detail

Data
- rooms: [{ id, number, type }]
- bookings: [{ id, room_id, start, end, status }]
- view_range: 7 | 14 | 30

Notes
- Tap cell -> new booking for room/date.
- Tap bar -> booking detail.

---

## I) Manager Mode - New booking
Components
- Date picker
- Room selector
- Voice input fields
- ID proof capture
- Rate input
- Source selector
- Payment section
- Sticky confirm CTA

Data
- booking_form: {
  check_in, check_out, room_id, guest_name, phone,
  id_type?, id_number_masked?, guests_adults, guests_children,
  rate, source, advance_amount?, advance_method?,
  invoice_type
}

Notes
- Target: walk-in cash booking < 30s.

---

## J) Manager Mode - Check-in
Components
- Verify guest details
- Room assignment
- Payment capture
- C-form generator
- WhatsApp welcome CTA

Data
- booking: { id, guest, room, is_foreign }
- pending_advance
- cform_pdf_url

---

## K) Manager Mode - Check-out
Components
- Stay summary
- Add charges
- GST calc
- Payment capture
- Invoice / receipt PDF
- WhatsApp share CTA

Data
- folio: { charges, payments, balance }
- invoice_type
- gst_rate

---

## L) Manager Mode - Requests
Components
- Request list
- FAB new request
- Request form
- Status toggle

Data
- requests: [{ id, room, text, category, routed_to, status, logged_at }]

Notes
- New request < 15s.

---

## M) Guests (list + detail)
Components
- Search
- Filters
- Detail profile
- Stay history list

Data
- guests: [{ id, name, phone, last_stay, lifetime_spend }]
- guest_detail: { name, phone, email, id_type, id_number_masked, notes, tags, stays[] }

---

## N) Reports (Owner)
Components
- Charts and export buttons

Data
- occupancy_report: [{ date, percent }]
- revenue_report: [{ date, amount }]
- gst_report: { taxable, cgst, sgst, igst }

---

## O) Settings
Components
- Sectioned settings
- Form rows

Data
- property, rooms, rates, tax, staff, language, notifications

---

## P) Booking detail + modification
Components
- Bottom sheet / side panel
- Editable fields
- Confirmation dialogs

Data
- booking: { dates, room, guests, rate, source, invoice_type, notes }
- booking_history: [{ field, before, after, changed_by, changed_at }]

---

## Q) Cancellation + no-show
Components
- Reason selector
- Refund inputs

Data
- cancellation: { reason, refund_amount, refund_method, comment }

---

## R) Stay extension
Components
- Date picker
- Room availability check

Data
- extension: { new_check_out, new_room_id?, rate_override? }

---

## S) Room change mid-stay
Components
- Room picker
- Effective date/time
- Reason field

Data
- change: { new_room_id, effective_at, reason, rate_adjustment }

---

## T) Group bookings
Components
- Group mode toggle
- Primary contact form
- Room type counts

Data
- group: { primary_contact, rooms: [{ type, count }], group_rate? }

---

## U) Folio (stay account)
Components
- Charges list
- Payments list
- Balance summary
- Actions (add charge, payment)

Data
- folio: { charges[], payments[], balance }

---

## V) Housekeeping board
Components
- Room cards grouped by floor
- Status filters
- Status change controls
- Voice note input

Data
- rooms: [{ number, status, last_guest, next_arrival }]

---

## W) Block room
Components
- Room selector
- Date range
- Reason input

Data
- block: { room_id, start, end?, reason, note? }

---

## X) Day close + cash position
Components
- Summary cards
- Cash breakdown table
- Variance highlight
- Submit button

Data
- day_close: { date, opening_cash, cash_collected, cash_refunds, expected_closing, actual_closing, variance, breakdown }

---

## Y) Pre-arrival and post-stay messaging
Components
- Template editor
- Send CTA

Data
- templates: { pre_arrival, post_stay, placeholders }
- whatsapp_link

---

## Z) Notifications
Components
- Push permission modal
- Toggle list

Data
- notifications: [{ type, enabled }]
- subscription: { endpoint, keys }

---

## AA) Police register + audit log
Components
- PDF export
- Table with filters

Data
- police_register: [{ guest, id, room, arrival, departure }]
- audit_log: [{ timestamp, user, action, entity, before, after }]

---

## Shared UI Components (Build Once)
- Metric card
- List item row
- Status badge
- Timeline entry
- Room status pill
- Sticky CTA bar
- Bottom sheet
- Confirmation dialog
- Empty state panel
- Skeleton loader
- Offline banner + sync queue badge

---

## Shared Data Utilities (Mock + API)
- Currency formatter (INR)
- Date formatter (locale-aware)
- Status mapping (booking, room, request)
- Voice input helper state
- Offline queue model (pending mutations)
