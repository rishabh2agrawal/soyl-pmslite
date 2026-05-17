"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { StatusBadge } from "@/components/shared/status-badge";
import { VoiceInput } from "@/components/shared/voice-input";
import { EmptyState } from "@/components/shared/empty-state";
import { REQUESTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { GuestRequest, RequestStatus, RequestCategory } from "@/types";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "escalated", label: "Escalated" },
];

const CATEGORIES: { value: RequestCategory; label: string }[] = [
  { value: "housekeeping", label: "Housekeeping" },
  { value: "maintenance", label: "Maintenance" },
  { value: "food", label: "Food & Beverage" },
  { value: "amenity", label: "Amenity" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
];

const categoryColors: Record<RequestCategory, string> = {
  housekeeping: "bg-secondary/15 text-emerald-light",
  maintenance: "bg-destructive/15 text-destructive",
  food: "bg-amber/20 text-amber-light",
  amenity: "bg-primary/15 text-primary",
  complaint: "bg-destructive/15 text-destructive",
  other: "bg-muted/60 text-muted-foreground",
};

function getElapsed(loggedAt: string): string {
  const diff = Date.now() - new Date(loggedAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const nextStatus: Record<RequestStatus, RequestStatus | null> = {
  open: "in_progress",
  in_progress: "resolved",
  resolved: null,
  escalated: "in_progress",
};

export default function RequestsPage() {
  const [filter, setFilter] = useState("all");
  const [requests, setRequests] = useState<GuestRequest[]>(REQUESTS);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? requests
        : requests.filter((r) => r.status === filter),
    [filter, requests],
  );

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      room: "",
      text: "",
      category: "other" as string,
      routed_to: "",
    },
  });

  const toggleStatus = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = nextStatus[r.status];
        if (!next) return r;
        toast.success(`Request updated to ${next.replace("_", " ")}`);
        return {
          ...r,
          status: next,
          resolved_at: next === "resolved" ? new Date().toISOString() : r.resolved_at,
        };
      }),
    );
  };

  const onNewRequest = (data: { room: string; text: string; category: string; routed_to: string }) => {
    const newReq: GuestRequest = {
      id: `req-${Date.now()}`,
      room: data.room,
      text: data.text,
      category: data.category as RequestCategory,
      routed_to: data.routed_to || undefined,
      status: "open",
      logged_at: new Date().toISOString(),
    };
    setRequests((prev) => [newReq, ...prev]);
    setSheetOpen(false);
    reset();
    toast.success("Request logged");
  };

  return (
    <motion.div
      {...pageTransitionProps}
      className="space-y-5 px-4 pb-24"
    >
      <PageHeader title="Requests" />

      <FilterChips
        options={FILTER_OPTIONS}
        activeValue={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Clock className="size-10" />}
          title="No requests"
          description="No requests match this filter"
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((req) => (
            <Card
              key={req.id}
              className="cursor-pointer border-white/[0.06] bg-white/80 shadow-soft transition-colors hover:bg-muted"
              onClick={() => toggleStatus(req.id)}
            >
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        Room {req.room}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.02em]",
                          categoryColors[req.category],
                        )}
                      >
                        {req.category}
                      </span>
                    </div>
                    <p className="text-sm text-foreground truncate">{req.text}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {req.guest_name && <span>{req.guest_name}</span>}
                      {req.guest_name && <span>·</span>}
                      <span>{getElapsed(req.logged_at)}</span>
                    </div>
                  </div>
                  <StatusBadge domain="request" status={req.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 z-30 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-card transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="size-6" />
      </button>

      {/* New request sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>New Request</SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleSubmit(onNewRequest)}
            className="mt-4 space-y-4"
          >
            <div>
              <Label htmlFor="req_room">Room Number</Label>
              <Input
                id="req_room"
                placeholder="e.g. 101"
                className="min-h-touch mt-1"
                {...register("room")}
              />
            </div>
            <div>
              <Label>Request</Label>
              <Controller
                control={control}
                name="text"
                render={({ field }) => (
                  <VoiceInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Describe the request"
                    className="mt-1"
                  />
                )}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-h-touch mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="routed_to">Route To (optional)</Label>
              <Input
                id="routed_to"
                placeholder="e.g. Housekeeping, Maintenance"
                className="min-h-touch mt-1"
                {...register("routed_to")}
              />
            </div>
            <Button
              type="submit"
              className="min-h-touch w-full bg-primary text-white hover:bg-primary-light"
            >
              Log Request
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
