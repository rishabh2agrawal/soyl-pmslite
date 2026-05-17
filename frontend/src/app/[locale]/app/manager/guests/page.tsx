"use client";

import { pageTransitionProps } from "@/lib/motion";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { FilterChips } from "@/components/shared/filter-chips";
import { ListRow } from "@/components/shared/list-row";
import { EmptyState } from "@/components/shared/empty-state";
import { GUESTS, BOOKINGS } from "@/lib/mock-data";
import { formatCurrency, formatRelativeDate, getInitials } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "current", label: "Current" },
  { value: "past", label: "Past" },
  { value: "vip", label: "VIP" },
];

export default function GuestsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const currentGuestIds = useMemo(
    () =>
      new Set(
        BOOKINGS.filter((b) => b.status === "checked_in").map((b) => b.guest_id),
      ),
    [],
  );

  const filtered = useMemo(() => {
    let list = GUESTS;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.phone.includes(q),
      );
    }

    switch (filter) {
      case "current":
        list = list.filter((g) => currentGuestIds.has(g.id));
        break;
      case "past":
        list = list.filter((g) => !currentGuestIds.has(g.id));
        break;
      case "vip":
        list = list.filter((g) => g.tags?.includes("vip"));
        break;
    }

    return list;
  }, [search, filter, currentGuestIds]);

  return (
    <motion.div
      {...pageTransitionProps}
      className="space-y-5 px-4 pb-8"
    >
      <PageHeader title="Guests" />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="min-h-touch pl-10"
        />
      </div>

      <FilterChips
        options={FILTER_OPTIONS}
        activeValue={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="size-10" />}
          title="No guests found"
          description="Try adjusting your search or filter"
        />
      ) : (
        <div className="space-y-1">
          {filtered.map((guest) => (
            <Link
              key={guest.id}
              href={`/app/manager/guests/${guest.id}`}
            >
              <ListRow
                title={guest.name}
                subtitle={guest.phone}
                avatar={getInitials(guest.name)}
                right={
                  <div className="flex flex-col items-end gap-1">
                    {guest.last_stay && (
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(guest.last_stay)}
                      </span>
                    )}
                    {guest.lifetime_spend != null && (
                      <span className="text-xs font-medium text-foreground">
                        {formatCurrency(guest.lifetime_spend)}
                      </span>
                    )}
                    {guest.tags && guest.tags.length > 0 && (
                      <div className="flex gap-1">
                        {guest.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={cn(
                              "text-[10px] px-1.5 py-0",
                              tag === "vip" && "border-amber text-amber-light",
                              tag === "repeat" && "border-emerald text-emerald-light",
                              tag === "corporate" && "border-primary text-primary",
                            )}
                          >
                            {tag.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
