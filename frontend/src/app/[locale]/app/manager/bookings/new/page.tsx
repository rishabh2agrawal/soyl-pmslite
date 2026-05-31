"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
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
import { pageTransitionProps } from "@/lib/motion";
import type { BookingSource, InvoiceType, PaymentMethod, IdProofType } from "@/types";

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

const formLabelClass =
  "text-xs text-plum font-medium uppercase tracking-wide";

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
    <motion.div {...pageTransitionProps} className="space-y-6 pb-28">
      <PageHeader title="New Booking" showBack onBack={() => router.back()} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-6">
          <FormPhase phase={1} title="Stay" />

          <Card>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="check_in" className={formLabelClass}>
                  Check-in date
                </Label>
                <Input id="check_in" type="date" className="mt-1" {...register("check_in")} />
                {errors.check_in && (
                  <p className="mt-1 text-xs text-destructive">{errors.check_in.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="check_out" className={formLabelClass}>
                  Check-out date
                </Label>
                <Input id="check_out" type="date" className="mt-1" {...register("check_out")} />
                {errors.check_out && (
                  <p className="mt-1 text-xs text-destructive">{errors.check_out.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <Label className={formLabelClass}>Room</Label>
              <Controller
                control={control}
                name="room_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => handleRoomChange(val ?? "")}
                  >
                    <SelectTrigger className="mt-1 min-h-touch">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.number} - {room.type} ({formatCurrency(room.base_rate)}
                          /night)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.room_id && (
                <p className="mt-1 text-xs text-destructive">{errors.room_id.message}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <FormPhase phase={2} title="Guest" />

          <Card>
            <CardContent className="space-y-4">
              <div>
                <Label className={formLabelClass}>Guest name</Label>
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
                  <p className="mt-1 text-xs text-destructive">{errors.guest_name.message}</p>
                )}
              </div>
              <div>
                <Label className={formLabelClass}>Phone</Label>
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
                  <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4">
              <div>
                <Label className={formLabelClass}>ID proof type</Label>
                <Controller
                  control={control}
                  name="id_type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1 min-h-touch">
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
                <Label htmlFor="id_number" className={formLabelClass}>
                  ID number
                </Label>
                <Input
                  id="id_number"
                  placeholder="XXXX XXXX 1234"
                  className="mt-1"
                  {...register("id_number")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Label className={formLabelClass}>Adults</Label>
                <Stepper
                  value={adults}
                  min={1}
                  max={6}
                  onChange={(v) => setValue("adults", v)}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label className={formLabelClass}>Children</Label>
                <Stepper
                  value={children}
                  min={0}
                  max={4}
                  onChange={(v) => setValue("children", v)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <FormPhase phase={3} title="Pricing & billing" />

          <Card>
            <CardContent className="space-y-2">
              <Label className={formLabelClass}>Room rate (per night)</Label>
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
                <p className="mt-1 text-xs text-destructive">{errors.rate.message}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Label className={`mb-3 block ${formLabelClass}`}>Booking source</Label>
              <div className="flex flex-wrap gap-2">
                {SOURCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("source", opt.value)}
                    className={cn(
                      "min-h-touch rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                      source === opt.value
                        ? "border-transparent bg-teal text-ink shadow-glow-sm"
                        : "border border-white/[0.07] bg-white/[0.02] text-plum hover:border-white/[0.12] hover:text-chalk",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4">
              <div>
                <Label className={formLabelClass}>Advance amount</Label>
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
                <Label className={formLabelClass}>Payment method</Label>
                <Controller
                  control={control}
                  name="advance_method"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1 min-h-touch">
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

          <Card>
            <CardContent>
              <Label className={`mb-3 block ${formLabelClass}`}>Invoice type</Label>
              <div className="flex gap-2">
                {[
                  { value: "gst" as InvoiceType, label: "GST invoice" },
                  { value: "cash_receipt" as InvoiceType, label: "Cash receipt" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("invoice_type", opt.value)}
                    className={cn(
                      "min-h-touch flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                      invoiceType === opt.value
                        ? "border-teal/40 bg-teal/10 text-teal shadow-glow-sm"
                        : "border border-white/[0.07] bg-white/[0.02] text-plum hover:border-white/[0.12] hover:text-chalk",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <StickyCTA
          primaryLabel="Confirm Booking"
          onPrimary={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </form>
    </motion.div>
  );
}

function FormPhase({ phase, title }: { phase: number; title: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-white/[0.06] pb-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal/12 text-xs font-semibold text-teal">
        {phase}
      </span>
      <div className="min-w-0">
        <p className="text-2xs font-semibold uppercase tracking-widest text-plum">
          Phase {phase}
        </p>
        <p className="text-lg font-semibold tracking-tight text-chalk">{title}</p>
      </div>
    </div>
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
        aria-label="Decrease quantity"
        className="min-h-touch min-w-touch border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.07]"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </Button>
      <span className="w-8 text-center text-lg font-semibold text-chalk">{value}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Increase quantity"
        className="min-h-touch min-w-touch border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.07]"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </Button>
    </div>
  );
}
