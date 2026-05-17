"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StickyCTA } from "@/components/shared/sticky-cta";
import { ROOMS } from "@/lib/mock-data";

interface BlockFormData {
  room_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  note: string;
}

const availableRooms = ROOMS.filter((r) => r.status === "available");

export default function BlockRoomPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlockFormData>({
    defaultValues: {
      room_id: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      reason: "",
      note: "",
    },
  });

  const onSubmit = (data: BlockFormData) => {
    toast.success(`Room blocked successfully`);
    router.back();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-28"
    >
      <div className="mx-auto max-w-lg px-4">
        <PageHeader
          title="Block Room"
          showBack
          onBack={() => router.back()}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-soyl-border/70 bg-white/80 p-4 shadow-soft">
          <div className="space-y-2">
            <Label htmlFor="room_id">Room</Label>
            <Select
              onValueChange={(v) => setValue("room_id", v)}
              value={watch("room_id")}
            >
              <SelectTrigger className="min-h-touch">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    Room {room.number} — {room.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              className="min-h-touch"
              {...register("start_date", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">End Date (optional)</Label>
            <Input
              id="end_date"
              type="date"
              className="min-h-touch"
              {...register("end_date")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              placeholder="e.g. Renovation, VIP hold"
              className="min-h-touch"
              {...register("reason", { required: true })}
            />
            {errors.reason && (
              <p className="text-xs text-soyl-danger">Reason is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Additional details..."
              rows={3}
              {...register("note")}
            />
          </div>
        </form>

        <StickyCTA
          primaryLabel="Block Room"
          onPrimary={handleSubmit(onSubmit)}
        />
      </div>
    </motion.div>
  );
}
