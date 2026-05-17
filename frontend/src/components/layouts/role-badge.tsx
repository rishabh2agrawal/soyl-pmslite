import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: "owner" | "manager";
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const label = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <span
      className={cn(
        "rounded-full border border-teal/25 bg-teal/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-teal",
        className,
      )}
    >
      {label}
    </span>
  );
}
