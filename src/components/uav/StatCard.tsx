import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  tone = "default",
  tooltip,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  tone?: "default" | "warning" | "danger" | "success";
  tooltip?: string;
}) {
  const toneClass = {
    default: "text-primary",
    warning: "text-amber-500",
    danger: "text-destructive",
    success: "text-emerald-500",
  }[tone];

  const borderClass = {
    default: "border-border",
    warning: "border-amber-500/50",
    danger: "border-destructive/50",
    success: "border-emerald-500/30",
  }[tone];

  const iconBgClass = {
    default: "bg-secondary",
    warning: "bg-amber-500/10",
    danger: "bg-destructive/10",
    success: "bg-emerald-500/10",
  }[tone];

  const content = (
    <div className={cn("bg-card border rounded-xl p-4 flex items-center gap-4 transition-colors", borderClass)}>
      <div className={cn("h-11 w-11 rounded-lg flex items-center justify-center transition-colors", iconBgClass, toneClass)}>
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

  if (!tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {content}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}