/**
 * Dates are stored as plain `date` / `timestamptz` strings and rendered on the
 * server, so formatting is pinned to en-GB (day-month-year) rather than the
 * server's locale - otherwise a Vercel region change would silently reorder
 * every couple's wedding date.
 */

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  // A bare date is parsed as UTC midnight; adding T12:00 avoids the classic
  // "shows the day before" bug for anyone west of Greenwich.
  const d = new Date(DATE_ONLY.test(value) ? `${value}T12:00:00` : value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "14 February 2027" */
export function formatDate(value: string | null | undefined): string {
  const d = toDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "Sat 14 Feb, 7:00 pm" */
export function formatDateTime(value: string | null | undefined): string {
  const d = toDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/** "February 2027" - for timeline entries where the day is noise. */
export function formatMonthYear(value: string | null | undefined): string {
  const d = toDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * "2027-02-14T19:00" for <input type="datetime-local">, which refuses any
 * value carrying a timezone or seconds.
 */
export function toDatetimeLocal(value: string | null | undefined): string {
  const d = toDate(value);
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

/** Whole days from today until `value`. Negative once it has passed. */
export function daysUntil(value: string | null | undefined): number | null {
  const d = toDate(value);
  if (!d) return null;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const target = new Date(d);
  target.setHours(12, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
