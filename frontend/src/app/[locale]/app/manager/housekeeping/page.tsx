"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { StatusBadge } from "@/components/shared/status-badge";
import { VoiceInput } from "@/components/shared/voice-input";
import { ROOMS, BOOKINGS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Room, RoomStatus } from "@/types";
import { pageTransitionProps, stagger, staggerItem } from "@/lib/motion";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "dirty", label: "Dirty" },
  { value: "cleaning", label: "Cleaning" },
  { value: "inspected", label: "Inspected" },
  { value: "available", label: "Available" },
];

const statusActions: Partial<
  Record<RoomStatus, { label: string; next: RoomStatus }>
> = {
  dirty: { label: "Start Cleaning", next: "cleaning" },
  cleaning: { label: "Mark Inspected", next: "inspected" },
  inspected: { label: "Mark Available", next: "available" },
};

const cardBorder: Record<RoomStatus, string> = {
  available: "border-l-teal",
  occupied: "border-l-plum",
  dirty: "border-l-[#C9A84C]",
  cleaning: "border-l-[#80B8E0]",
  maintenance: "border-l-destructive",
  blocked: "border-l-white/20",
  inspected: "border-l-teal/50",
};

const actionStyle: Record<string, string> = {
  cleaning:
    "border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C]/18",
  inspected:
    "border border-[#80B8E0]/30 bg-[#80B8E0]/10 text-[#80B8E0] hover:bg-[#80B8E0]/18",
  available:
    "border border-teal/35 bg-teal/10 text-teal hover:bg-teal/18",
};

function getLastGuest(room: Room): string | null {
  if (!room.current_booking_id) return null;
  const booking = BOOKINGS.find((b) => b.id === room.current_booking_id);
  return booking?.guest_name ?? null;
}

function getNextArrival(room: Room): string | null {
  if (room.status === "occupied" || room.status === "blocked") return null;
  const upcoming = BOOKINGS.find(
    (b) => b.room_id === room.id && b.status === "confirmed",
  );
  return upcoming?.guest_name ?? null;
}

export default function HousekeepingPage() {
  const [filter, setFilter] = useState("all");
  const [rooms, setRooms] = useState(ROOMS);
  const [voiceRoom, setVoiceRoom] = useState<string | null>(null);

  const filtered =
    filter === "all" ? rooms : rooms.filter((r) => r.status === filter);
  const floors = Array.from(new Set(filtered.map((r) => r.floor))).sort();

  function handleStatusChange(roomId: string, next: RoomStatus) {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: next } : r)),
    );
    toast.success("Room status updated");
  }

  return (
    <motion.div {...pageTransitionProps} className="pb-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Housekeeping" />
        <FilterChips
          options={FILTER_OPTIONS}
          activeValue={filter}
          onChange={setFilter}
          className="mb-4"
        />

        {floors.map((floor) => {
          const floorRooms = filtered.filter((r) => r.floor === floor);
          return (
            <div key={floor} className="mb-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-plum">
                Floor {floor}
              </h2>
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              >
                {floorRooms.map((room) => {
                  const action = statusActions[room.status];
                  const lastGuest = getLastGuest(room);
                  const nextArrival = getNextArrival(room);

                  const next = action?.next ?? null;
                  const cls =
                    next != null ? actionStyle[String(next)] ?? "" : "";

                  return (
                    <motion.div key={room.id} variants={staggerItem}>
                      <div
                        className={cn(
                          "liquid-glass rounded-xl border-l-2 p-3",
                          cardBorder[room.status],
                        )}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xl font-bold text-chalk">
                            {room.number}
                          </span>
                          <StatusBadge domain="room" status={room.status} />
                        </div>

                        {lastGuest && (
                          <p className="truncate text-xs text-plum">
                            Last: {lastGuest}
                          </p>
                        )}
                        {nextArrival && (
                          <p className="truncate text-xs text-teal">
                            Next: {nextArrival}
                          </p>
                        )}

                        <div className="mt-3 flex items-center gap-2">
                          {action ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(room.id, action.next)
                              }
                              className={cn(
                                "min-h-[36px] flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all",
                                cls,
                              )}
                            >
                              {action.label}
                            </button>
                          ) : room.status === "occupied" ? (
                            <Button
                              size="sm"
                              disabled
                              variant="outline"
                              className="min-h-[36px] flex-1 text-xs opacity-70"
                            >
                              Occupied
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              disabled
                              variant="outline"
                              className="min-h-[36px] flex-1 text-xs capitalize opacity-70"
                            >
                              {room.status}
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-9 shrink-0 text-plum hover:text-teal"
                            type="button"
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
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
