"use client";

export function SectionLabel({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="h-4 w-0.5 rounded-full bg-indigo" />
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </span>
    </div>
  );
}
