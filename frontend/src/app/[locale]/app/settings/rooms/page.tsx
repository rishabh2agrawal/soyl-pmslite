"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ROOMS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatters";
import type { Room } from "@/types";

export default function ManageRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Room>>({});

  function startEdit(room: Room) {
    setEditingId(room.id);
    setEditData({ number: room.number, type: room.type, floor: room.floor, base_rate: room.base_rate });
  }

  function saveEdit(id: string) {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...editData } : r))
    );
    setEditingId(null);
    toast.success("Room updated");
  }

  function addRoom() {
    const newRoom: Room = {
      id: `r${Date.now()}`,
      number: String(100 + rooms.length + 1),
      type: "Standard",
      floor: 1,
      base_rate: 1800,
      status: "available",
    };
    setRooms((prev) => [...prev, newRoom]);
    startEdit(newRoom);
  }

  return (
    <motion.div
      {...pageTransitionProps}
      className="pb-8"
    >
      <div className="mx-auto max-w-3xl px-4">
        <PageHeader
          title="Manage Rooms"
          showBack
          onBack={() => router.back()}
          action={
            <Button
              onClick={addRoom}
              className="min-h-touch gap-2 bg-primary text-white hover:bg-primary-light"
            >
              <Plus className="size-4" /> Add Room
            </Button>
          }
        />

        <div className="space-y-3">
          {rooms.map((room) => {
            const isEditing = editingId === room.id;

            return (
              <Card key={room.id} className="border-white/[0.06] bg-white/80 p-4 shadow-soft">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Number</label>
                        <Input
                          value={editData.number ?? ""}
                          onChange={(e) => setEditData({ ...editData, number: e.target.value })}
                          className="min-h-touch"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Type</label>
                        <Select
                          value={editData.type ?? "Standard"}
                          onValueChange={(v) => setEditData({ ...editData, type: v })}
                        >
                          <SelectTrigger className="min-h-touch">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Deluxe">Deluxe</SelectItem>
                            <SelectItem value="Suite">Suite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Floor</label>
                        <Input
                          type="number"
                          value={editData.floor ?? 1}
                          onChange={(e) => setEditData({ ...editData, floor: parseInt(e.target.value) || 1 })}
                          className="min-h-touch"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Base Rate</label>
                        <Input
                          type="number"
                          value={editData.base_rate ?? 0}
                          onChange={(e) => setEditData({ ...editData, base_rate: parseInt(e.target.value) || 0 })}
                          className="min-h-touch"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        className="min-h-[36px] gap-1"
                      >
                        <X className="size-4" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(room.id)}
                        className="min-h-[36px] gap-1 bg-primary text-white hover:bg-primary-light"
                      >
                        <Check className="size-4" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-foreground">{room.number}</span>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">{room.type} · Floor {room.floor}</span>
                        <span className="text-xs text-muted-foreground">{formatCurrency(room.base_rate)}/night</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge domain="room" status={room.status} />
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit room ${room.number}`}
                        onClick={() => startEdit(room)}
                        className="size-9 text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
