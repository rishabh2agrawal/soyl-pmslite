"use client";
import { pageTransitionProps } from "@/lib/motion";

import { motion } from "framer-motion";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { BOOKINGS, GUESTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/formatters";

const registerEntries = BOOKINGS.filter(
  (b) => b.status === "checked_in" || b.status === "checked_out"
).map((b) => {
  const guest = GUESTS.find((g) => g.id === b.guest_id);
  return {
    id: b.id,
    guest_name: b.guest_name,
    id_type: guest?.id_type ?? "—",
    id_number: guest?.id_number_masked ?? "—",
    room_number: b.room_number,
    arrival: b.check_in,
    departure: b.check_out,
  };
});

function formatIdType(type: string): string {
  const map: Record<string, string> = {
    aadhaar: "Aadhaar",
    passport: "Passport",
    driving_license: "Driving License",
    voter_id: "Voter ID",
    pan: "PAN",
  };
  return map[type] ?? type;
}

export default function PoliceRegisterPage() {
  function handleExport() {
    toast.info("PDF export coming soon");
  }

  return (
    <motion.div
      {...pageTransitionProps}
      className="pb-8"
    >
      <div className="mx-auto max-w-4xl px-4">
        <PageHeader
          title="Police Register"
          action={
            <Button
              variant="outline"
              onClick={handleExport}
              className="min-h-touch gap-2 border-border text-foreground"
            >
              <FileDown className="size-4" />
              Export PDF
            </Button>
          }
        />

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/80 shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guest Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID Proof</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Room</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Arrival</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Departure</th>
                </tr>
              </thead>
              <tbody>
                {registerEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium text-foreground">{entry.guest_name}</td>
                    <td className="px-4 py-3 text-foreground">
                      {formatIdType(entry.id_type)}{" "}
                      <span className="text-muted-foreground">{entry.id_number}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{entry.room_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(entry.arrival)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(entry.departure)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {registerEntries.map((entry) => (
            <Card key={entry.id} className="border-white/[0.06] bg-white/80 p-3 shadow-soft">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-foreground">{entry.guest_name}</span>
                <span className="rounded bg-navy-500/80 px-2 py-0.5 text-xs font-medium text-foreground">
                  Room {entry.room_number}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatIdType(entry.id_type)} · {entry.id_number}
              </p>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span>In: {formatDate(entry.arrival)}</span>
                <span>Out: {formatDate(entry.departure)}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
