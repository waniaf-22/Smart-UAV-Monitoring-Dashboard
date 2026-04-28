import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  tone?: "default" | "warning" | "danger" | "success";
}) {
  const toneClass = {
    default: "text-primary",
    warning: "text-[oklch(var(--warning))]",
    danger: "text-destructive",
    success: "text-[oklch(var(--success))]",
  }[tone];

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      <div className={cn("h-11 w-11 rounded-lg bg-secondary flex items-center justify-center", toneClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-foreground tabular-nums">
          {value}
          {unit && <span className="text-sm font-medium text-muted-foreground ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}