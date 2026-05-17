import type {
  Booking, Room, Guest, GuestRequest, TimelineEvent,
  PulseData, WeekData, DayClose, AuditEntry, StaffMember,
} from "@/types";

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

export const ROOMS: Room[] = [
  { id: "r1", number: "101", type: "Deluxe", floor: 1, base_rate: 2500, status: "occupied", current_booking_id: "b1" },
  { id: "r2", number: "102", type: "Deluxe", floor: 1, base_rate: 2500, status: "occupied", current_booking_id: "b2" },
  { id: "r3", number: "103", type: "Standard", floor: 1, base_rate: 1800, status: "available" },
  { id: "r4", number: "104", type: "Standard", floor: 1, base_rate: 1800, status: "dirty" },
  { id: "r5", number: "201", type: "Suite", floor: 2, base_rate: 4500, status: "occupied", current_booking_id: "b3" },
  { id: "r6", number: "202", type: "Suite", floor: 2, base_rate: 4500, status: "available" },
  { id: "r7", number: "203", type: "Deluxe", floor: 2, base_rate: 2500, status: "blocked" },
  { id: "r8", number: "204", type: "Deluxe", floor: 2, base_rate: 2500, status: "available" },
  { id: "r9", number: "301", type: "Standard", floor: 3, base_rate: 1800, status: "occupied", current_booking_id: "b4" },
  { id: "r10", number: "302", type: "Standard", floor: 3, base_rate: 1800, status: "maintenance" },
];

export const GUESTS: Guest[] = [
  { id: "g1", name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@email.com", id_type: "aadhaar", id_number_masked: "XXXX XXXX 4321", last_stay: today, lifetime_spend: 45000, tags: ["repeat"] },
  { id: "g2", name: "Priya Sharma", phone: "+91 87654 32109", id_type: "driving_license", id_number_masked: "KA-XX-XXXX2109", last_stay: yesterday, lifetime_spend: 12500 },
  { id: "g3", name: "Amit Patel", phone: "+91 76543 21098", email: "amit.p@email.com", id_type: "passport", id_number_masked: "XXXXXXX098", last_stay: today, lifetime_spend: 67000, tags: ["vip", "repeat"] },
  { id: "g4", name: "Sunita Devi", phone: "+91 65432 10987", id_type: "voter_id", id_number_masked: "XXX1098XX7", last_stay: today, lifetime_spend: 8500 },
  { id: "g5", name: "Vikram Singh", phone: "+91 54321 09876", email: "vikram.s@email.com", last_stay: yesterday, lifetime_spend: 32000, tags: ["corporate"] },
  { id: "g6", name: "Meera Joshi", phone: "+91 43210 98765", id_type: "aadhaar", id_number_masked: "XXXX XXXX 8765", lifetime_spend: 5600 },
];

export const BOOKINGS: Booking[] = [
  { id: "b1", room_id: "r1", room_number: "101", guest_id: "g1", guest_name: "Rajesh Kumar", guest_phone: "+91 98765 43210", check_in: yesterday, check_out: tomorrow, status: "checked_in", adults: 2, children: 0, rate: 2500, source: "walk_in", invoice_type: "gst", advance_amount: 2500, advance_method: "upi", created_at: yesterday },
  { id: "b2", room_id: "r2", room_number: "102", guest_id: "g2", guest_name: "Priya Sharma", guest_phone: "+91 87654 32109", check_in: today, check_out: tomorrow, status: "checked_in", adults: 1, children: 1, rate: 2500, source: "phone", invoice_type: "cash_receipt", advance_amount: 1000, advance_method: "cash", created_at: yesterday },
  { id: "b3", room_id: "r5", room_number: "201", guest_id: "g3", guest_name: "Amit Patel", guest_phone: "+91 76543 21098", check_in: yesterday, check_out: today, status: "checked_in", adults: 2, children: 1, rate: 4500, source: "ota", invoice_type: "gst", advance_amount: 4500, advance_method: "card", created_at: yesterday },
  { id: "b4", room_id: "r9", room_number: "301", guest_id: "g4", guest_name: "Sunita Devi", guest_phone: "+91 65432 10987", check_in: today, check_out: tomorrow, status: "checked_in", adults: 2, children: 0, rate: 1800, source: "walk_in", invoice_type: "cash_receipt", advance_amount: 1800, advance_method: "cash", created_at: today },
  { id: "b5", room_id: "r3", room_number: "103", guest_id: "g5", guest_name: "Vikram Singh", guest_phone: "+91 54321 09876", check_in: today, check_out: `${tomorrow}`, status: "confirmed", adults: 1, children: 0, rate: 1800, source: "phone", invoice_type: "gst", created_at: yesterday },
  { id: "b6", room_id: "r6", room_number: "202", guest_id: "g6", guest_name: "Meera Joshi", guest_phone: "+91 43210 98765", check_in: tomorrow, check_out: new Date(Date.now() + 172800000).toISOString().split("T")[0], status: "confirmed", adults: 2, children: 0, rate: 4500, source: "walk_in", invoice_type: "cash_receipt", created_at: today },
];

export const REQUESTS: GuestRequest[] = [
  { id: "req1", booking_id: "b1", room: "101", guest_name: "Rajesh Kumar", text: "Need extra towels", category: "housekeeping", routed_to: "Housekeeping", status: "open", logged_at: `${today}T09:30:00` },
  { id: "req2", booking_id: "b3", room: "201", guest_name: "Amit Patel", text: "AC not cooling properly", category: "maintenance", routed_to: "Maintenance", status: "in_progress", logged_at: `${today}T08:15:00` },
  { id: "req3", booking_id: "b2", room: "102", guest_name: "Priya Sharma", text: "Room service - 2 chai, 1 sandwich", category: "food", routed_to: "Kitchen", status: "resolved", logged_at: `${today}T07:00:00`, resolved_at: `${today}T07:25:00` },
  { id: "req4", booking_id: "b4", room: "301", guest_name: "Sunita Devi", text: "WiFi password not working", category: "amenity", status: "open", logged_at: `${today}T10:00:00` },
  { id: "req5", booking_id: "b1", room: "101", guest_name: "Rajesh Kumar", text: "Late checkout request for 2 PM", category: "other", status: "escalated", logged_at: `${yesterday}T20:00:00` },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "e1", type: "check_in", timestamp: `${today}T06:30:00`, summary: "Priya Sharma checked into Room 102", actor: "Ravi (Manager)", ref_id: "b2" },
  { id: "e2", type: "request", timestamp: `${today}T07:00:00`, summary: "Room service request from Room 102", actor: "Priya Sharma", ref_id: "req3" },
  { id: "e3", type: "request", timestamp: `${today}T08:15:00`, summary: "AC complaint logged for Room 201", actor: "Amit Patel", ref_id: "req2" },
  { id: "e4", type: "payment", timestamp: `${today}T09:00:00`, summary: "₹1,800 advance received for Room 301", actor: "Ravi (Manager)", ref_id: "b4" },
  { id: "e5", type: "check_in", timestamp: `${today}T09:15:00`, summary: "Sunita Devi checked into Room 301", actor: "Ravi (Manager)", ref_id: "b4" },
  { id: "e6", type: "request", timestamp: `${today}T09:30:00`, summary: "Extra towels requested for Room 101", actor: "Rajesh Kumar", ref_id: "req1" },
  { id: "e7", type: "booking", timestamp: `${today}T10:30:00`, summary: "New booking: Meera Joshi, Room 202, tomorrow", actor: "Ravi (Manager)", ref_id: "b6" },
  { id: "e8", type: "request", timestamp: `${today}T10:00:00`, summary: "WiFi issue reported in Room 301", actor: "Sunita Devi", ref_id: "req4" },
];

export const PULSE_DATA: PulseData = {
  date: today,
  occupancy: { occupied: 4, total: 10, percent: 40 },
  today: { check_ins: 2, check_outs: 1, earnings: 12600 },
  attention_count: 3,
  attention_overdue: 1,
  arrivals: [
    { guest_name: "Vikram Singh", room: "103", eta: "2:00 PM", status: "confirmed" },
  ],
  departures: [
    { guest_name: "Amit Patel", room: "201", balance_due: 4500 },
  ],
  in_house_count: 4,
};

export const WEEK_DATA: WeekData = {
  occupancy_by_day: [
    { date: "Mon", percent: 30 },
    { date: "Tue", percent: 40 },
    { date: "Wed", percent: 50 },
    { date: "Thu", percent: 60 },
    { date: "Fri", percent: 70 },
    { date: "Sat", percent: 80 },
    { date: "Sun", percent: 40 },
  ],
  revenue_by_day: [
    { date: "Mon", amount: 8500 },
    { date: "Tue", amount: 12000 },
    { date: "Wed", amount: 15500 },
    { date: "Thu", amount: 18000 },
    { date: "Fri", amount: 22500 },
    { date: "Sat", amount: 28000 },
    { date: "Sun", amount: 12600 },
  ],
  requests_vs_resolved: [
    { date: "Mon", open: 2, resolved: 2 },
    { date: "Tue", open: 3, resolved: 3 },
    { date: "Wed", open: 1, resolved: 1 },
    { date: "Thu", open: 4, resolved: 3 },
    { date: "Fri", open: 2, resolved: 2 },
    { date: "Sat", open: 5, resolved: 4 },
    { date: "Sun", open: 3, resolved: 1 },
  ],
  avg_response_time: { value: 28, delta: -5 },
  per_room: [
    { room: "101", nights: 6, revenue: 15000, avg_rate: 2500 },
    { room: "102", nights: 4, revenue: 10000, avg_rate: 2500 },
    { room: "201", nights: 5, revenue: 22500, avg_rate: 4500 },
    { room: "301", nights: 3, revenue: 5400, avg_rate: 1800 },
  ],
};

export const DAY_CLOSE_DATA: DayClose = {
  date: today,
  opening_cash: 5000,
  cash_collected: 8300,
  cash_refunds: 0,
  expected_closing: 13300,
  actual_closing: 13300,
  variance: 0,
  breakdown: [
    { label: "Room 301 - Advance", amount: 1800 },
    { label: "Room 102 - Advance", amount: 1000 },
    { label: "Room 101 - Room Service", amount: 500 },
    { label: "Room 201 - Checkout", amount: 5000 },
  ],
};

export const AUDIT_LOG: AuditEntry[] = [
  { id: "a1", timestamp: `${today}T06:30:00`, user: "Ravi (Manager)", action: "check_in", entity: "Booking #b2" },
  { id: "a2", timestamp: `${today}T09:00:00`, user: "Ravi (Manager)", action: "payment_received", entity: "Booking #b4", after: "₹1,800 cash" },
  { id: "a3", timestamp: `${today}T09:15:00`, user: "Ravi (Manager)", action: "check_in", entity: "Booking #b4" },
  { id: "a4", timestamp: `${today}T10:30:00`, user: "Ravi (Manager)", action: "booking_created", entity: "Booking #b6" },
  { id: "a5", timestamp: `${today}T11:00:00`, user: "Ravi (Manager)", action: "rate_override", entity: "Room 103", before: "₹1,800", after: "₹1,600" },
];

export const STAFF: StaffMember[] = [
  { id: "s1", name: "Ravi Kumar", phone: "+91 99887 76655", role: "manager" },
  { id: "s2", name: "Anil Verma", phone: "+91 88776 65544", role: "manager" },
];

export const ATTENTION_ITEMS = {
  open_requests_over_4h: [
    { id: "req5", guest: "Rajesh Kumar", room: "101", request: "Late checkout request", routed_to: "Owner", elapsed: "14h" },
  ],
  unconfirmed_arrivals: [
    { id: "b5", guest: "Vikram Singh", room: "103", eta: "2:00 PM", overdue_by: "" },
  ],
  payments_due: [
    { id: "b3", guest: "Amit Patel", room: "201", balance: 4500 },
  ],
  rooms_blocked_long: [
    { room: "203", blocked_for: "3 days" },
  ],
  yday_misses: [] as { type: string; description: string; resolved_late_at: string }[],
};
