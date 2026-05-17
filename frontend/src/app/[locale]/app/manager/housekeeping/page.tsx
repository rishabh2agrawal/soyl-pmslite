"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { StatusBadge } from "@/components/shared/status-badge";
import { VoiceInput } from "@/components/shared/voice-input";
import { ROOMS, BOOKINGS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Room, RoomStatus } from "@/types";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "dirty", label: "Dirty" },
  { value: "cleaning", label: "Cleaning" },
  { value: "inspected", label: "Inspected" },
  { value: "available", label: "Available" },
];

const statusActions: Partial<Record<RoomStatus, { label: string; next: RoomStatus }>> = {
  dirty: { label: "Start Cleaning", next: "cleaning" },
  cleaning: { label: "Mark Inspected", next: "inspected" },
  inspected: { label: "Mark Available", next: "available" },
};

const statusCardBorder: Record<RoomStatus, string> = {
  available: "border-l-soyl-secondary",
  occupied: "border-l-soyl-primary",
  blocked: "border-l-soyl-accent",
  maintenance: "border-l-soyl-danger",
  dirty: "border-l-soyl-accent",
  cleaning: "border-l-soyl-secondary",
  inspected: "border-l-soyl-secondary",
};

function getLastGuest(room: Room): string | null {
  if (!room.current_booking_id) return null;
  const booking = BOOKINGS.find((b) => b.id === room.current_booking_id);
  return booking?.guest_name ?? null;
}

function getNextArrival(room: Room): string | null {
  if (room.status === "occupied" || room.status === "blocked") return null;
  const upcoming = BOOKINGS.find(
    (b) => b.room_id === room.id && b.status === "confirmed"
  );
  return upcoming?.guest_name ?? null;
}

export default function HousekeepingPage() {
  const [filter, setFilter] = useState("all");
  const [rooms, setRooms] = useState(ROOMS);
  const [voiceRoom, setVoiceRoom] = useState<string | null>(null);

  const filtered = filter === "all" ? rooms : rooms.filter((r) => r.status === filter);
  const floors = Array.from(new Set(filtered.map((r) => r.floor))).sort();

  function handleStatusChange(roomId: string, next: RoomStatus) {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: next } : r))
    );
    toast.success(`Room status updated`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-8"
    >
      <div className="mx-auto max-w-5xl px-4">
        <PageHeader title="Housekeeping" />
        <FilterChips options={FILTER_OPTIONS} activeValue={filter} onChange={setFilter} className="mb-4" />

        {floors.map((floor) => {
          const floorRooms = filtered.filter((r) => r.floor === floor);
          return (
            <div key={floor} className="mb-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-soyl-muted">
                Floor {floor}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {floorRooms.map((room) => {
                  const action = statusActions[room.status];
                  const lastGuest = getLastGuest(room);
                  const nextArrival = getNextArrival(room);

                  return (
                    <Card
                      key={room.id}
                      className={cn(
                        "border-l-4 bg-white/80 p-3 shadow-soft",
                        statusCardBorder[room.status]
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xl font-bold text-soyl-text">
                          {room.number}
                        </span>
                        <StatusBadge domain="room" status={room.status} />
                      </div>

                      {lastGuest && (
                        <p className="truncate text-xs text-soyl-muted">
                          Last: {lastGuest}
                        </p>
                      )}
                      {nextArrival && (
                        <p className="truncate text-xs text-soyl-secondary">
                          Next: {nextArrival}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-2">
                        {action ? (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(room.id, action.next)}
                            className="min-h-[36px] flex-1 bg-soyl-primary text-xs text-white hover:bg-soyl-primary-light"
                          >
                            {action.label}
                          </Button>
                        ) : room.status === "occupied" ? (
                          <Button size="sm" disabled className="min-h-[36px] flex-1 text-xs">
                            Occupied
                          </Button>
                        ) : (
                          <Button size="sm" disabled className="min-h-[36px] flex-1 text-xs">
                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-9 shrink-0 text-soyl-muted hover:text-soyl-primary"
                          onClick={() =>
                            setVoiceRoom(voiceRoom === room.id ? null : room.id)
                          }
                        >
                          <Mic className="size-4" />
                        </Button>
                      </div>

                      {voiceRoom === room.id && (
                        <div className="mt-2">
                          <VoiceInput
                            placeholder="Voice note..."
                            onVoiceResult={(t) => toast.info(`Note: ${t}`)}
                          />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
