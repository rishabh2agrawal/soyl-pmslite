"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { AUDIT_LOG } from "@/lib/mock-data";
import { formatDate, formatTime } from "@/lib/formatters";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "booking", label: "Bookings" },
  { value: "payment", label: "Payments" },
  { value: "check_in", label: "Check-ins" },
  { value: "rate", label: "Rate Changes" },
];

function matchesFilter(action: string, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "booking") return action.includes("booking");
  if (filter === "payment") return action.includes("payment");
  if (filter === "check_in") return action.includes("check_in");
  if (filter === "rate") return action.includes("rate");
  return false;
}

export default function AuditLogPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const entries = useMemo(() => {
    return AUDIT_LOG.filter((e) => {
      if (!matchesFilter(e.action, filter)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          e.user.toLowerCase().includes(q) ||
          e.action.toLowerCase().includes(q) ||
          e.entity.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, search]);

  return (
    <motion.div
      {...pageTransitionProps}
      className="pb-8"
    >
      <div className="mx-auto max-w-4xl px-4">
        <PageHeader title="Audit Log" />
        <FilterChips options={FILTER_OPTIONS} activeValue={filter} onChange={setFilter} className="mb-4" />

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-h-touch pl-10"
          />
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/80 shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Timestamp</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Entity</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Changes</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border last:border-b-0">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(entry.timestamp, "dd MMM")} {formatTime(entry.timestamp)}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{entry.user}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                        {entry.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{entry.entity}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {entry.before && <span className="line-through">{entry.before}</span>}
                      {entry.before && entry.after && " → "}
                      {entry.after && <span className="font-medium text-foreground">{entry.after}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {entries.map((entry) => (
            <Card key={entry.id} className="border-white/[0.06] bg-white/80 p-3 shadow-soft">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDate(entry.timestamp, "dd MMM")} {formatTime(entry.timestamp)}
                </span>
                <span className="inline-flex rounded-full bg-navy-500/80 px-2 py-0.5 text-xs font-medium text-foreground">
                  {entry.action.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{entry.entity}</p>
              <p className="text-xs text-muted-foreground">by {entry.user}</p>
              {(entry.before || entry.after) && (
                <div className="mt-2 rounded-md bg-muted p-2 text-xs text-muted-foreground">
                  {entry.before && <span className="line-through">{entry.before}</span>}
                  {entry.before && entry.after && " → "}
                  {entry.after && <span className="font-medium text-foreground">{entry.after}</span>}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
