import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function calculateCTR(clicks: number, views: number): string {
  if (views === 0) return "0%";
  return `${((clicks / views) * 100).toFixed(1)}%`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getApiUrl(): string {
  // Browser: relative URL → Next.js rewrites /api/* to API container
  if (typeof window !== "undefined") return "";
  // Server-side (SSR): use Docker internal network
  return process.env.API_INTERNAL_URL || "http://api:4000";
}
