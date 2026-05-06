import { USD_TO_KES_RATE } from "./constants";

export function formatKES(amount: number): string {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function kesToUsd(kes: number): number {
  return Math.round(kes / USD_TO_KES_RATE);
}

export function usdToKes(usd: number): number {
  return Math.round(usd * USD_TO_KES_RATE);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function batteryColor(health: number): string {
  if (health >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (health >= 80) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
}

export function batteryBarColor(health: number): string {
  if (health >= 90) return "bg-emerald-500";
  if (health >= 80) return "bg-amber-500";
  return "bg-red-500";
}

export function discount(market: number, sale: number): number {
  return Math.round(((market - sale) / market) * 100);
}
