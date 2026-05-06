import { CONDITION_LABELS, CONDITION_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Condition } from "@/types";

interface ConditionBadgeProps {
  condition: Condition;
  className?: string;
}

export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        CONDITION_COLORS[condition],
        className
      )}
    >
      {condition === "EX_UK" && (
        <span className="mr-1">🇬🇧</span>
      )}
      {CONDITION_LABELS[condition]}
    </span>
  );
}
