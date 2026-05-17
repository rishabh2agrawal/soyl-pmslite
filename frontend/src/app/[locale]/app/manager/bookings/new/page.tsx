"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { PageHeader } from "@/components/shared/page-header";
import { StickyCTA } from "@/components/shared/sticky-cta";
import { VoiceInput } from "@/components/shared/voice-input";
import { PhoneInput } from "@/components/shared/phone-input";
import { CurrencyInput } from "@/components/shared/currency-input";
import { ROOMS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { BookingSource, InvoiceType, PaymentMethod, IdProofType } from "@/types";

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

const bookingSchema = z.object({
  check_in: z.string().min(1, "Check-in date is required"),
  check_out: z.string().min(1, "Check-out date is required"),
  room_id: z.string().min(1, "Room is required"),
  guest_name: z.string().min(1, "Guest name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  id_type: z.string().optional(),
  id_number: z.string().optional(),
  adults: z.number().min(1).max(6),
  children: z.number().min(0).max(4),
  rate: z.string().min(1, "Rate is required"),
  source: z.string().min(1),
  advance_amount: z.string().optional(),
  advance_method: z.string().optional(),
  invoice_type: z.string().min(1),
});

type BookingForm = z.infer<typeof bookingSchema>;

const SOURCE_OPTIONS: { value: BookingSource; label: string }[] = [
  { value: "walk_in", label: "Walk-in" },
  { value: "phone", label: "Phone" },
  { value: "ota", label: "OTA" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

const ID_TYPES: { value: IdProofType; label: string }[] = [
  { value: "aadhaar", label: "Aadhaar" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "voter_id", label: "Voter ID" },
  { value: "pan", label: "PAN" },
];

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledRoom = searchParams?.get("room") ?? "";
  const prefilledDate = searchParams?.get("date") ?? today;

  const availableRooms = useMemo(
    () => ROOMS.filter((r) => r.status === "available" || r.id === prefilledRoom),
    [prefilledRoom],
  );

  const selectedRoomDefault = prefilledRoom || "";
  const defaultRate = prefilledRoom
    ? ROOMS.find((r) => r.id === prefilledRoom)?.base_rate?.toString() || ""
    : "";

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      check_in: prefilledDate,
      check_out: tomorrow,
      room_id: selectedRoomDefault,
      guest_name: "",
      phone: "",
      id_type: "",
      id_number: "",
      adults: 1,
      children: 0,
      rate: defaultRate,
      source: "walk_in",
      advance_amount: "",
      advance_method: "cash",
      invoice_type: "cash_receipt",
    },
  });

  const adults = watch("adults");
  const children = watch("children");
  const invoiceType = watch("invoice_type");
  const source = watch("source");

  const onSubmit = (data: BookingForm) => {
    toast.success("Booking confirmed!", {
      description: `${data.guest_name} - Room booked successfully`,
    });
    router.push("/app/manager");
  };

  const handleRoomChange = (roomId: string) => {
    setValue("room_id", roomId);
    const room = ROOMS.find((r) => r.id === roomId);
    if (room) {
      setValue("rate", room.base_rate.toString());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 pb-24"
    >
      <PageHeader
        title="New Booking"
        showBack
        onBack={() => router.back()}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Dates */}
        <Card className="border-soyl-border">
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="check_in">Check-in Date</Label>
              <Input
                id="check_in"
                type="date"
                className="min-h-touch mt-1"
                {...register("check_in")}
              />
              {errors.check_in && (
                <p className="mt-1 text-xs text-soyl-danger">{errors.check_in.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="check_out">Check-out Date</Label>
              <Input
                id="check_out"
                type="date"
                className="min-h-touch mt-1"
                {...register("check_out")}
              />
              {errors.check_out && (
                <p className="mt-1 text-xs text-soyl-danger">{errors.check_out.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Room */}
        <Card className="border-soyl-border">
          <CardContent>
            <Label>Room</Label>
            <Controller
              control={control}
              name="room_id"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => handleRoomChange(val ?? "")}
                >
                  <SelectTrigger className="min-h-touch mt-1">
                    <SelectValue placeholder="Select room" />
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
            {errors.room_id && (
              <p className="mt-1 text-xs text-soyl-danger">{errors.room_id.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Guest info */}
        <Card className="border-soyl-border">
          <CardContent className="space-y-4">
            <div>
              <Label>Guest Name</Label>
              <Controller
                control={control}
                name="guest_name"
                render={({ field }) => (
                  <VoiceInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter guest name"
                    className="mt-1"
                  />
                )}
              />
              {errors.guest_name && (
                <p className="mt-1 text-xs text-soyl-danger">{errors.guest_name.message}</p>
              )}
            </div>
            <div>
              <Label>Phone</Label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    className="mt-1"
                  />
                )}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-soyl-danger">{errors.phone.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Occupancy */}
        <Card className="border-soyl-border">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Adults</Label>
              <Stepper
                value={adults}
                min={1}
                max={6}
                onChange={(v) => setValue("adults", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Children</Label>
              <Stepper
                value={children}
                min={0}
                max={4}
                onChange={(v) => setValue("children", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ID Proof */}
        <Card className="border-soyl-border">
          <CardContent className="space-y-4">
            <div>
              <Label>ID Proof Type</Label>
              <Controller
                control={control}
                name="id_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-h-touch mt-1">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ID_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="id_number">ID Number</Label>
              <Input
                id="id_number"
                placeholder="XXXX XXXX 1234"
                className="min-h-touch mt-1"
                {...register("id_number")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Rate */}
        <Card className="border-soyl-border">
          <CardContent>
            <Label>Room Rate (per night)</Label>
            <Controller
              control={control}
              name="rate"
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  className="mt-1"
                />
              )}
            />
            {errors.rate && (
              <p className="mt-1 text-xs text-soyl-danger">{errors.rate.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Source */}
        <Card className="border-soyl-border">
          <CardContent>
            <Label className="mb-3 block">Booking Source</Label>
            <div className="flex flex-wrap gap-2">
              {SOURCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("source", opt.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors min-h-touch",
                    source === opt.value
                      ? "border-soyl-primary bg-soyl-primary text-white"
                      : "border-soyl-border bg-soyl-surface text-soyl-text hover:bg-soyl-bg",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card className="border-soyl-border">
          <CardContent className="space-y-4">
            <div>
              <Label>Advance Amount</Label>
              <Controller
                control={control}
                name="advance_amount"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="0"
                    className="mt-1"
                  />
                )}
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Controller
                control={control}
                name="advance_method"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-h-touch mt-1">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice type */}
        <Card className="border-soyl-border">
          <CardContent>
            <Label className="mb-3 block">Invoice Type</Label>
            <div className="flex gap-2">
              {[
                { value: "gst" as InvoiceType, label: "GST Invoice" },
                { value: "cash_receipt" as InvoiceType, label: "Cash Receipt" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("invoice_type", opt.value)}
                  className={cn(
                    "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors min-h-touch",
                    invoiceType === opt.value
                      ? "border-soyl-primary bg-soyl-primary/5 text-soyl-primary"
                      : "border-soyl-border bg-soyl-surface text-soyl-text hover:bg-soyl-bg",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <StickyCTA
          primaryLabel="Confirm Booking"
          onPrimary={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </form>
    </motion.div>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="min-h-touch min-w-touch border-soyl-border"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </Button>
      <span className="w-8 text-center text-lg font-semibold text-soyl-text">
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="min-h-touch min-w-touch border-soyl-border"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </Button>
    </div>
  );
}
