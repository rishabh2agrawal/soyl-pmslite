"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { StickyCTA } from "@/components/shared/sticky-cta";
import { PhoneInput } from "@/components/shared/phone-input";
import { CurrencyInput } from "@/components/shared/currency-input";
import { ROOMS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/formatters";

const roomTypes = Array.from(new Set(ROOMS.map((r) => r.type)));

const groupSchema = z.object({
  contact_name: z.string().min(1, "Contact name is required"),
  contact_phone: z.string().min(10, "Valid phone required"),
  contact_email: z.string().email("Valid email required").or(z.literal("")),
  group_rate: z.string().optional(),
});

type GroupForm = z.infer<typeof groupSchema>;

export default function GroupBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>(
    Object.fromEntries(roomTypes.map((t) => [t, 0])),
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupForm>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      group_rate: "",
    },
  });

  const totalRooms = Object.values(roomCounts).reduce((s, c) => s + c, 0);

  const totalRate = Object.entries(roomCounts).reduce((sum, [type, count]) => {
    const room = ROOMS.find((r) => r.type === type);
    return sum + (room?.base_rate || 0) * count;
  }, 0);

  const updateCount = (type: string, delta: number) => {
    setRoomCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, (prev[type] || 0) + delta),
    }));
  };

  const onSubmit = () => {
    if (totalRooms === 0) {
      toast.error("Select at least one room");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Group booking created!", {
        description: `${totalRooms} rooms booked`,
      });
      router.push("/app/manager");
    }, 500);
  };

  return (
    <motion.div
      {...pageTransitionProps}
      className="space-y-6 px-4 pb-28"
    >
      <PageHeader
        title="Group Booking"
        showBack
        onBack={() => router.back()}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Primary contact */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="size-4" />
              Primary Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact_name">Name</Label>
              <Input
                id="contact_name"
                className="min-h-touch mt-1"
                placeholder="Contact person name"
                {...register("contact_name")}
              />
              {errors.contact_name && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.contact_name.message}
                </p>
              )}
            </div>
            <div>
              <Label>Phone</Label>
              <Controller
                control={control}
                name="contact_phone"
                render={({ field }) => (
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    className="mt-1"
                  />
                )}
              />
              {errors.contact_phone && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.contact_phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                className="min-h-touch mt-1"
                placeholder="email@example.com"
                {...register("contact_email")}
              />
              {errors.contact_email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.contact_email.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Room type selector */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Room Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roomTypes.map((type) => {
              const rate =
                ROOMS.find((r) => r.type === type)?.base_rate || 0;
              const available = ROOMS.filter(
                (r) => r.type === type && r.status === "available",
              ).length;
              return (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/70 p-3"
                >
                  <div>
                    <p className="font-medium text-foreground">{type}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(rate)}/night · {available} available
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Decrease rooms for ${type}`}
                      className="min-h-touch min-w-touch border-white/[0.06]"
                      disabled={roomCounts[type] <= 0}
                      onClick={() => updateCount(type, -1)}
                    >
                      −
                    </Button>
                    <span className="w-6 text-center font-semibold text-foreground">
                      {roomCounts[type]}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Increase rooms for ${type}`}
                      className="min-h-touch min-w-touch border-white/[0.06]"
                      disabled={roomCounts[type] >= available}
                      onClick={() => updateCount(type, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Group rate override */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardContent>
            <Label>Group Rate Override (optional)</Label>
            <Controller
              control={control}
              name="group_rate"
              render={({ field }) => (
                <CurrencyInput
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Leave blank for standard rates"
                  className="mt-1"
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border-white/[0.06] bg-white/80">
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Rooms</span>
              <span className="font-semibold text-foreground">{totalRooms}</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex justify-between">
              <span className="font-medium text-foreground">
                Estimated Total / Night
              </span>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(totalRate)}
              </span>
            </div>
          </CardContent>
        </Card>

        <StickyCTA
          primaryLabel="Create Group Booking"
          onPrimary={handleSubmit(onSubmit)}
          loading={loading}
          disabled={totalRooms === 0}
        />
      </form>
    </motion.div>
  );
}
