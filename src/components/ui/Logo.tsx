import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

export function Logo({ className, size = "md", variant = "dark" }: LogoProps) {
  const sizes = { sm: "h-7", md: "h-9", lg: "h-12" };
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };

  return (
    <Link href="/" className={cn("flex items-center gap-2 select-none", className)}>
      <div className={cn("relative flex items-center justify-center", sizes[size])}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          className={cn("w-auto", sizes[size])}
          aria-hidden="true"
        >
          <rect width="36" height="36" rx="8" fill="#2563EB" />
          <path
            d="M21 6L12 19h7l-4 11 13-15h-8l5-9z"
            fill="#FACC15"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        className={cn(
          "font-bold tracking-tight",
          textSizes[size],
          variant === "dark" ? "text-gray-900" : "text-white"
        )}
      >
        volta
        <span className={variant === "dark" ? "text-blue-600" : "text-blue-400"}>
          mobile
        </span>
      </span>
    </Link>
  );
}
