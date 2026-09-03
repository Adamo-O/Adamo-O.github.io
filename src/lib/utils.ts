import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/**
 * Parse one side of a `dateRange` value ("September 2023", "March", "Present")
 * into a month index (year * 12 + month). A bare month with no year falls back
 * to `fallbackYear`; "Present" is the current month.
 */
function monthIndex(part: string, fallbackYear?: number): number {
  const now = new Date();
  if (part === "Present") return now.getFullYear() * 12 + now.getMonth();
  const [monthName, yearStr] = part.trim().split(/\s+/);
  const month = MONTHS.indexOf((monthName ?? "").toLowerCase());
  const year = yearStr ? Number(yearStr) : (fallbackYear ?? now.getFullYear());
  return year * 12 + (month < 0 ? 0 : month);
}

/** Split "Month YYYY - Month YYYY" into { start, end } month indices. */
export function parseDateRange(dates: string): { start: number; end: number } {
  const parts = dates.split(" - ");
  const endPart = parts.length > 1 ? parts[1] : parts[0];
  const end = monthIndex(endPart);
  const endYear = Math.floor(end / 12);
  const start = monthIndex(parts[0], endYear);
  return { start, end };
}

/**
 * Comparator for `Array.prototype.sort`: newest end date first; ties broken by
 * newest start date first. Same ordering as the previous moment-based version.
 */
export function sortContent(datesA: string, datesB: string): number {
  const a = parseDateRange(datesA);
  const b = parseDateRange(datesB);
  if (b.end !== a.end) return b.end - a.end;
  return b.start - a.start;
}
