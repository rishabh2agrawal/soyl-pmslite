"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StickyCTA } from "@/components/shared/sticky-cta";
import { BOOKINGS, ROOMS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatters";

export default function RoomChangePage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const [loading, setLoading] = useState(false);

  const booking = useMemo(
    () => BOOKINGS.find((b) => b.id === bookingId),
    [bookingId],
  );

  const currentRoom = useMemo(
    () => (booking ? ROOMS.find((r) => r.id === booking.room_id) : null),
    [booking],
  );

  const availableRooms = useMemo(
    () => ROOMS.filter((r) => r.status === "available"),
    [],
  );

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      new_room_id: "",
      effective_datetime: new Date().toISOString().slice(0, 16),
      reason: "",
    },
  });

  const selectedRoomId = watch("new_room_id");
  const newRoom = useMemo(
    () => ROOMS.find((r) => r.id === selectedRoomId),
    [selectedRoomId],
  );

  if (!booking || !currentRoom) {
    return (
      <div className="flex items-center justify-center py-20 text-soyl-muted">
        Booking not found
      </div>
    );
  }

  const rateDiff = newRoom ? newRoom.base_rate - booking.rate : 0;

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Room changed!", {
        description: `Moved to Room ${newRoom?.number}`,
      });
      router.push(`/app/manager/bookings/${booking.id}`);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 px-4 pb-28"
    >
      <PageHeader
        title="Change Room"
        subtitle={booking.guest_name}
        showBack
        onBack={() => router.back()}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current room */}
        <Card className="border-soyl-border/70 bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-soyl-muted">
              Current Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-xl bg-soyl-bg/80 p-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-soyl-primary/10 shadow-soft">
                <span className="text-lg font-bold text-soyl-primary">
                  {currentRoom.number}
                </span>
              </div>
              <div>
                <p className="font-semibold text-soyl-text">{currentRoom.type}</p>
                <p className="text-sm text-soyl-muted">
                  Floor {currentRoom.floor} · {formatCurrency(booking.rate)}/night
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <ArrowRight className="size-5 text-soyl-muted rotate-90" />
        </div>

        {/* New room */}
        <Card className="border-soyl-border/70 bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-soyl-muted">
              New Room
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Room</Label>
              <Controller
                control={control}
                name="new_room_id"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-h-touch mt-1">
                      <SelectValue placeholder="Choose available room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.number} - {room.type} ({formatCurrency(room.base_rate)}/night)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {newRoom && rateDiff !== 0 && (
              <div className="rounded-xl bg-soyl-accent/10 p-3 text-sm">
                <span className="text-soyl-muted">Rate adjustment: </span>
                <span className="font-medium text-soyl-text">
                  {rateDiff > 0 ? "+" : ""}
                  {formatCurrency(rateDiff)}/night
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Effective date & reason */}
        <Card className="border-soyl-border/70 bg-white/80">
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="effective_datetime">Effective Date/Time</Label>
              <Input
                id="effective_datetime"
                type="datetime-local"
                className="min-h-touch mt-1"
                {...register("effective_datetime")}
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="e.g. Guest requested upgrade"
                className="min-h-touch mt-1"
                {...register("reason")}
              />
            </div>
          </CardContent>
        </Card>

        <StickyCTA
          primaryLabel="Confirm Room Change"
          onPrimary={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!selectedRoomId}
        />
      </form>
    </motion.div>
  );
}
