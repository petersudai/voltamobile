"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Flips the `dark` class on <html> and remembers the choice.
 * Icons switch with CSS (not state), so server and client markup always match.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className={cn(
        "p-2.5 rounded-xl text-ink-3 hover:text-ink hover:bg-ink/10 transition-colors",
        className
      )}
    >
      <Sun className="hidden dark:block h-[18px] w-[18px]" />
      <Moon className="dark:hidden h-[18px] w-[18px]" />
    </button>
  );
}
