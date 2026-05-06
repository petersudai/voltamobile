"use client";

import { batteryColor, batteryBarColor } from "@/lib/format";
import { cn } from "@/lib/utils";

interface BatteryBadgeProps {
  health: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BatteryBadge({ health, size = "md", className }: BatteryBadgeProps) {
  const colorClass = batteryColor(health);
  const barColor = batteryBarColor(health);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
  };

  const barSizes = {
    sm: "w-8 h-1.5",
    md: "w-10 h-2",
    lg: "w-14 h-2.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      <BatteryIcon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      <span>{health}%</span>
      <div className={cn("rounded-full bg-current/20 overflow-hidden", barSizes[size])}>
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${health}%` }}
        />
      </div>
    </div>
  );
}

function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M3 6a2 2 0 012-2h9a2 2 0 012 2v1h.5a1.5 1.5 0 010 3H16v1a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm2-1a1 1 0 00-1 1v6a1 1 0 001 1h9a1 1 0 001-1V6a1 1 0 00-1-1H5z"
        clipRule="evenodd"
      />
    </svg>
  );
}
