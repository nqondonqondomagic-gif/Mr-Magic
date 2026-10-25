import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format South African Rand (ZAR) from minor cents to display string
 * e.g. 49900 -> "R 499.00"
 */
export function formatZAR(cents: number | undefined | null): string {
  if (cents === undefined || cents === null || isNaN(cents)) return "R 0.00";
  const rands = (cents / 100).toFixed(2);
  const parts = rands.split(".");
  const withCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `R ${withCommas}.${parts[1]}`;
}

/**
 * Format standard South African date string (DD MMM YYYY)
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Format relative time or standard timestamp
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
