import Dexie, { type EntityTable } from "dexie";

interface DBBooking {
  id: string;
  room_id: string;
  room_number: string;
  guest_id: string;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  status: string;
  adults: number;
  children: number;
  rate: number;
  source: string;
  invoice_type: string;
  advance_amount?: number;
  advance_method?: string;
  notes?: string;
  created_at: string;
  _synced?: boolean;
}

interface DBGuest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  id_type?: string;
  id_number_masked?: string;
  notes?: string;
  tags?: string;
  last_stay?: string;
  lifetime_spend?: number;
  _synced?: boolean;
}

interface DBRoom {
  id: string;
  number: string;
  type: string;
  floor: number;
  base_rate: number;
  status: string;
  current_booking_id?: string;
  _synced?: boolean;
}

interface DBRequest {
  id: string;
  booking_id?: string;
  room: string;
  guest_name?: string;
  text: string;
  category: string;
  routed_to?: string;
  status: string;
  logged_at: string;
  resolved_at?: string;
  _synced?: boolean;
}

const db = new Dexie("soyl-pms") as Dexie & {
  bookings: EntityTable<DBBooking, "id">;
  guests: EntityTable<DBGuest, "id">;
  rooms: EntityTable<DBRoom, "id">;
  requests: EntityTable<DBRequest, "id">;
};

db.version(1).stores({
  bookings: "id, room_id, guest_id, status, check_in, check_out, _synced",
  guests: "id, phone, name, _synced",
  rooms: "id, number, status, floor, _synced",
  requests: "id, booking_id, room, status, category, _synced",
});

export { db };
export type { DBBooking, DBGuest, DBRoom, DBRequest };
