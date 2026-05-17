"use client";
import { pageTransitionProps } from "@/lib/motion";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { TimelineEntry } from "@/components/shared/timeline-entry";
import { EmptyState } from "@/components/shared/empty-state";
import { TIMELINE_EVENTS } from "@/lib/mock-data";
import type { TimelineEvent } from "@/types";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "booking", label: "Bookings" },
  { value: "request", label: "Requests" },
  { value: "payment", label: "Payments" },
  { value: "check_in", label: "Check-ins" },
  { value: "check_out", label: "Check-outs" },
];

export default function StoryPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const events = useMemo(() => {
    let filtered: TimelineEvent[] = [...TIMELINE_EVENTS];

    if (filter !== "all") {
      filtered = filtered.filter((e) => e.type === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.summary.toLowerCase().includes(q) ||
          e.actor.toLowerCase().includes(q),
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [filter, search]);

  return (
    <motion.div
      {...pageTransitionProps}
      className="space-y-5 px-4 pb-8"
    >
      <PageHeader
        title="Today's Story"
        showBack
        onBack={() => router.back()}
      />

      <FilterChips
        options={FILTER_OPTIONS}
        activeValue={filter}
        onChange={setFilter}
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={<Search className="size-10" />}
          title="No events found"
          description="Try changing the filter or search query."
        />
      ) : (
        <div className="pt-2">
          {events.map((event, i) => (
            <TimelineEntry
              key={event.id}
              event={event}
              isLast={i === events.length - 1}
            />
          ))}
        </div>
      )}

      <div className="pb-4" />
    </motion.div>
  );
}
