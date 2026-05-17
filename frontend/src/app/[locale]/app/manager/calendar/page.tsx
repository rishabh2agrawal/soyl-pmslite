"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { addDays, format, parseISO, isWithinInterval, differenceInDays } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { ROOMS, BOOKINGS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

const DAY_OPTIONS = [
  { value: "7", label: "7 Days" },
  { value: "14", label: "14 Days" },
  { value: "30", label: "30 Days" },
];

const statusColors: Record<BookingStatus, string> = {
  confirmed: "bg-blue-400",
  checked_in: "bg-soyl-secondary",
  checked_out: "bg-gray-400",
  cancelled: "bg-soyl-danger",
  no_show: "bg-orange-400",
};

const CELL_WIDTH = 64;

export default function CalendarPage() {
  const [dayRange, setDayRange] = useState("7");
  const numDays = parseInt(dayRange, 10);
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const dates = useMemo(
    () => Array.from({ length: numDays }, (_, i) => addDays(startDate, i)),
    [numDays],
  );

  const bookingMap = useMemo(() => {
    const map = new Map<string, typeof BOOKINGS>();
    ROOMS.forEach((r) => map.set(r.id, []));
    BOOKINGS.forEach((b) => {
      const existing = map.get(b.room_id) || [];
      existing.push(b);
      map.set(b.room_id, existing);
    });
    return map;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 pb-6"
    >
      <PageHeader title="Calendar" subtitle="Room availability grid" />

      <FilterChips
        options={DAY_OPTIONS}
        activeValue={dayRange}
        onChange={setDayRange}
      />

      <div className="overflow-x-auto rounded-xl border border-soyl-border bg-soyl-surface">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `120px repeat(${numDays}, ${CELL_WIDTH}px)`,
          }}
        >
          {/* Header row */}
          <div className="sticky left-0 z-20 border-b border-r border-soyl-border bg-soyl-bg px-3 py-2">
            <span className="text-xs font-medium text-soyl-muted">Room</span>
          </div>
          {dates.map((d) => (
            <div
              key={d.toISOString()}
              className="border-b border-r border-soyl-border bg-soyl-bg px-1 py-2 text-center"
            >
              <div className="text-[10px] font-medium text-soyl-muted">
                {format(d, "EEE")}
              </div>
              <div className="text-xs font-semibold text-soyl-text">
                {format(d, "dd")}
              </div>
            </div>
          ))}

          {/* Room rows */}
          {ROOMS.map((room) => {
            const roomBookings = bookingMap.get(room.id) || [];
            return (
              <RoomRow
                key={room.id}
                roomNumber={room.number}
                roomType={room.type}
                roomId={room.id}
                bookings={roomBookings}
                dates={dates}
                numDays={numDays}
                startDate={startDate}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-1">
        {(Object.entries(statusColors) as [BookingStatus, string][]).map(
          ([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={cn("size-3 rounded-sm", color)} />
              <span className="text-xs capitalize text-soyl-muted">
                {status.replace("_", " ")}
              </span>
            </div>
          ),
        )}
      </div>
    </motion.div>
  );
}

function RoomRow({
  roomNumber,
  roomType,
  roomId,
  bookings,
  dates,
  numDays,
  startDate,
}: {
  roomNumber: string;
  roomType: string;
  roomId: string;
  bookings: typeof BOOKINGS;
  dates: Date[];
  numDays: number;
  startDate: Date;
}) {
  return (
    <>
      {/* Sticky room label */}
      <div className="sticky left-0 z-10 flex flex-col justify-center border-b border-r border-soyl-border bg-soyl-surface px-3 py-2">
        <span className="text-sm font-semibold text-soyl-text">
          {roomNumber}
        </span>
        <span className="text-[10px] text-soyl-muted">{roomType}</span>
      </div>

      {/* Date cells */}
      {dates.map((date, colIndex) => {
        const booking = bookings.find((b) => {
          const ci = parseISO(b.check_in);
          const co = parseISO(b.check_out);
          ci.setHours(0, 0, 0, 0);
          co.setHours(0, 0, 0, 0);
          return isWithinInterval(date, { start: ci, end: addDays(co, -1) });
        });

        if (booking) {
          const ci = parseISO(booking.check_in);
          ci.setHours(0, 0, 0, 0);
          const isStart =
            date.getTime() === ci.getTime() ||
            (colIndex === 0 && ci < startDate);

          return (
            <Link
              key={date.toISOString()}
              href={`/app/manager/bookings/${booking.id}`}
              className={cn(
                "relative flex items-center border-b border-r border-soyl-border",
                isStart ? "justify-start" : "justify-center",
              )}
            >
              <div
                className={cn(
                  "absolute inset-y-1 inset-x-0 rounded-sm",
                  statusColors[booking.status],
                  "opacity-80 hover:opacity-100 transition-opacity",
                )}
              />
              {isStart && (
                <span className="relative z-10 truncate px-1 text-[10px] font-medium text-white">
                  {booking.guest_name.split(" ")[0]}
                </span>
              )}
            </Link>
          );
        }

        const dateStr = format(date, "yyyy-MM-dd");
        return (
          <Link
            key={date.toISOString()}
            href={`/app/manager/bookings/new?room=${roomId}&date=${dateStr}`}
            className="border-b border-r border-soyl-border bg-soyl-surface transition-colors hover:bg-soyl-bg"
          />
        );
      })}
    </>
  );
}
