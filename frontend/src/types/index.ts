export type Locale = "en" | "hi" | "kn";

export type UserRole = "owner" | "manager";

export type PropertyType = "hotel" | "homestay" | "guesthouse" | "lodge";

export type BookingStatus =
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";

export type RoomStatus =
  | "available"
  | "occupied"
  | "blocked"
  | "maintenance"
  | "dirty"
  | "cleaning"
  | "inspected";

export type RequestStatus = "open" | "in_progress" | "resolved" | "escalated";

export type RequestCategory =
  | "housekeeping"
  | "maintenance"
  | "food"
  | "amenity"
  | "complaint"
  | "other";

export type PaymentMethod = "cash" | "upi" | "card" | "bank_transfer";

export type BookingSource = "walk_in" | "phone" | "ota" | "website" | "referral";

export type InvoiceType = "gst" | "cash_receipt";

export type IdProofType = "aadhaar" | "passport" | "driving_license" | "voter_id" | "pan";

export interface Property {
  id: string;
  name: string;
  address: string;
  gstin?: string;
  phone: string;
  logo_url?: string;
  type: PropertyType;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  floor: number;
  base_rate: number;
  status: RoomStatus;
  current_booking_id?: string;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  id_type?: IdProofType;
  id_number_masked?: string;
  notes?: string;
  tags?: string[];
  last_stay?: string;
  lifetime_spend?: number;
}

export interface Booking {
  id: string;
  room_id: string;
  room_number: string;
  guest_id: string;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  adults: number;
  children: number;
  rate: number;
  source: BookingSource;
  invoice_type: InvoiceType;
  advance_amount?: number;
  advance_method?: PaymentMethod;
  notes?: string;
  is_foreign?: boolean;
  created_at: string;
}

export interface BookingFormData {
  check_in: string;
  check_out: string;
  room_id: string;
  guest_name: string;
  phone: string;
  id_type?: IdProofType;
  id_number_masked?: string;
  guests_adults: number;
  guests_children: number;
  rate: number;
  source: BookingSource;
  advance_amount?: number;
  advance_method?: PaymentMethod;
  invoice_type: InvoiceType;
}

export interface GuestRequest {
  id: string;
  booking_id?: string;
  room: string;
  guest_name?: string;
  text: string;
  category: RequestCategory;
  routed_to?: string;
  status: RequestStatus;
  logged_at: string;
  resolved_at?: string;
}

export interface FolioCharge {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface FolioPayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference?: string;
}

export interface Folio {
  charges: FolioCharge[];
  payments: FolioPayment[];
  balance: number;
}

export interface DayClose {
  date: string;
  opening_cash: number;
  cash_collected: number;
  cash_refunds: number;
  expected_closing: number;
  actual_closing: number;
  variance: number;
  breakdown: { label: string; amount: number }[];
}

export interface TimelineEvent {
  id: string;
  type: "booking" | "check_in" | "check_out" | "request" | "payment" | "cancellation" | "room_change";
  timestamp: string;
  summary: string;
  actor: string;
  ref_id?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  before?: string;
  after?: string;
}

export interface OccupancyData {
  occupied: number;
  total: number;
  percent: number;
}

export interface TodayData {
  check_ins: number;
  check_outs: number;
  earnings: number;
}

export interface PulseData {
  date: string;
  occupancy: OccupancyData;
  today: TodayData;
  attention_count: number;
  attention_overdue: number;
  arrivals: {
    guest_name: string;
    room: string;
    eta?: string;
    status: string;
  }[];
  departures: {
    guest_name: string;
    room: string;
    balance_due: number;
  }[];
  in_house_count: number;
}

export interface WeekData {
  occupancy_by_day: { date: string; percent: number }[];
  revenue_by_day: { date: string; amount: number }[];
  requests_vs_resolved: { date: string; open: number; resolved: number }[];
  avg_response_time: { value: number; delta: number };
  per_room: { room: string; nights: number; revenue: number; avg_rate: number }[];
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface NotificationSetting {
  type: string;
  enabled: boolean;
}
