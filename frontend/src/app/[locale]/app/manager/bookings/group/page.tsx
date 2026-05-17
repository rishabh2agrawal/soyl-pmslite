"use client";

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 pb-24"
    >
      <PageHeader
        title="Group Booking"
        showBack
        onBack={() => router.back()}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Primary contact */}
        <Card className="border-soyl-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-soyl-muted">
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
                <p className="mt-1 text-xs text-soyl-danger">
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
                <p className="mt-1 text-xs text-soyl-danger">
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
                <p className="mt-1 text-xs text-soyl-danger">
                  {errors.contact_email.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Room type selector */}
        <Card className="border-soyl-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-soyl-muted">
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
                  className="flex items-center justify-between rounded-lg border border-soyl-border p-3"
                >
                  <div>
                    <p className="font-medium text-soyl-text">{type}</p>
                    <p className="text-xs text-soyl-muted">
                      {formatCurrency(rate)}/night · {available} available
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-9 border-soyl-border"
                      disabled={roomCounts[type] <= 0}
                      onClick={() => updateCount(type, -1)}
                    >
                      −
                    </Button>
                    <span className="w-6 text-center font-semibold text-soyl-text">
                      {roomCounts[type]}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-9 border-soyl-border"
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
        <Card className="border-soyl-border">
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
        <Card className="border-soyl-border">
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-soyl-muted">Total Rooms</span>
              <span className="font-semibold text-soyl-text">{totalRooms}</span>
            </div>
            <Separator className="bg-soyl-border" />
            <div className="flex justify-between">
              <span className="font-medium text-soyl-text">
                Estimated Total / Night
              </span>
              <span className="text-lg font-bold text-soyl-text">
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
