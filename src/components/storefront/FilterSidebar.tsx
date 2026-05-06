"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { CONDITION_LABELS, PRICE_RANGES, STORAGE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const conditions = Object.entries(CONDITION_LABELS);

const COLOR_FAMILIES = [
  { label: "Black",    value: "Black",    hex: "#1a1a1a" },
  { label: "White",    value: "White",    hex: "#e5e7eb", border: true },
  { label: "Silver",   value: "Silver",   hex: "#9ca3af" },
  { label: "Gold",     value: "Gold",     hex: "#f59e0b" },
  { label: "Blue",     value: "Blue",     hex: "#3b82f6" },
  { label: "Purple",   value: "Purple",   hex: "#8b5cf6" },
  { label: "Green",    value: "Green",    hex: "#22c55e" },
  { label: "Pink",     value: "Pink",     hex: "#ec4899" },
  { label: "Red",      value: "Red",      hex: "#ef4444" },
  { label: "Titanium", value: "Titanium", hex: "#6b7280" },
];

interface FilterSidebarProps {
  brands: Array<{ name: string; slug: string; _count: { products: number } }>;
}

export function FilterSidebar({ brands }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── URL param helpers ────────────────────────────────────────────────────
  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => router.push(pathname, { scroll: false });

  // ── Active filter state ──────────────────────────────────────────────────
  const activeBrand     = searchParams.get("brand");
  const activeCondition = searchParams.get("condition");
  const activeStorage   = searchParams.get("storage");
  const activeColor     = searchParams.get("color");
  const activeMinPrice  = searchParams.get("minPrice");
  const activeMaxPrice  = searchParams.get("maxPrice");

  const activePriceRange = PRICE_RANGES.find(
    (r) =>
      r.min === parseInt(activeMinPrice ?? "-1") &&
      r.max === parseInt(activeMaxPrice ?? "-1")
  );

  const hasFilters =
    !!activeBrand || !!activeCondition || !!activeMinPrice || !!activeStorage || !!activeColor;

  const activeCount = [activeBrand, activeCondition, activeStorage, activeColor, activePriceRange]
    .filter(Boolean).length;

  // ── Lock body scroll when mobile drawer is open ──────────────────────────
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // ── Filter content (shared between mobile sheet + desktop sidebar) ───────
  const filterContent = (
    <>
      {/* Brand */}
      <Section title="Brand">
        {brands.map((brand) => (
          <Chip
            key={brand.slug}
            label={brand.name}
            count={brand._count.products}
            active={activeBrand === brand.slug}
            onClick={() =>
              setParam("brand", activeBrand === brand.slug ? null : brand.slug)
            }
          />
        ))}
      </Section>

      {/* Condition */}
      <Section title="Condition">
        {conditions.map(([value, label]) => (
          <Chip
            key={value}
            label={label}
            active={activeCondition === value}
            onClick={() =>
              setParam("condition", activeCondition === value ? null : value)
            }
          />
        ))}
      </Section>

      {/* Color */}
      <Section title="Color">
        <div className="flex flex-wrap gap-2">
          {COLOR_FAMILIES.map((c) => (
            <button
              key={c.value}
              onClick={() =>
                setParam("color", activeColor === c.value ? null : c.value)
              }
              title={c.label}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200",
                activeColor === c.value
                  ? "border-blue-500/50 bg-blue-950/40 text-blue-300"
                  : "border-white/8 text-gray-500 hover:border-white/20 hover:text-gray-300"
              )}
            >
              <span
                className={cn(
                  "w-3 h-3 rounded-full flex-shrink-0",
                  c.border ? "border border-gray-600" : ""
                )}
                style={{ background: c.hex }}
              />
              {c.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price">
        {PRICE_RANGES.map((range) => {
          const isActive =
            activePriceRange?.min === range.min &&
            activePriceRange?.max === range.max;
          return (
            <Chip
              key={range.label}
              label={range.label}
              active={isActive}
              onClick={() => {
                if (isActive) {
                  setParam("minPrice", null);
                  setParam("maxPrice", null);
                } else {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("minPrice", range.min.toString());
                  params.set("maxPrice", range.max.toString());
                  params.delete("page");
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }
              }}
            />
          );
        })}
      </Section>

      {/* Storage */}
      <Section title="Storage" last>
        <div className="flex flex-wrap gap-1.5">
          {STORAGE_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() =>
                setParam("storage", activeStorage === s ? null : s)
              }
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200",
                activeStorage === s
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-900/30"
                  : "bg-transparent text-gray-500 border-white/8 hover:border-white/20 hover:text-gray-300"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>
    </>
  );

  return (
    <>
      {/* ── Mobile: filter trigger button ─────────────────────────────────── */}
      <div className="lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200",
            activeCount > 0
              ? "bg-blue-600/10 border-blue-500/40 text-blue-300"
              : "bg-[#0e0e12] border-white/[0.08] text-gray-300 hover:border-white/20"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold leading-none">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile: backdrop ─────────────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── Mobile: bottom sheet ─────────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 bottom-0 z-50 bg-[#0c0c10] rounded-t-3xl border-t border-white/[0.08]",
          "transition-transform duration-300 ease-out will-change-transform",
          "flex flex-col",
          drawerOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ maxHeight: "88vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Sheet header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] flex-shrink-0">
          <h2 className="font-bold text-white flex items-center gap-2 text-sm">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            Filters
            {activeCount > 0 && (
              <span className="text-gray-400 font-normal text-xs">
                ({activeCount} active)
              </span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                onClick={() => {
                  clearAll();
                  setDrawerOpen(false);
                }}
                className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable filter content */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {filterContent}
        </div>

        {/* Show results button */}
        <div className="p-4 border-t border-white/[0.06] flex-shrink-0">
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors"
          >
            Show Results
          </button>
        </div>
      </div>

      {/* ── Desktop: sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:block w-60 flex-shrink-0">
        <div className="bg-gray-950 rounded-3xl border border-white/[0.06] p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              Filters
            </h2>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Section({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn("", last ? "" : "border-b border-white/5 pb-4 mb-4")}>
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">
        {title}
      </h3>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between gap-2",
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
          : "text-gray-500 hover:bg-white/5 hover:text-gray-200"
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={cn("text-xs", active ? "text-blue-200" : "text-gray-500")}>
          {count}
        </span>
      )}
    </button>
  );
}
