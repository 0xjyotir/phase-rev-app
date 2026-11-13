/**
 * Date helpers (no external date library — the app only needs a handful).
 *
 * Conventions:
 *   - "date key" = local calendar day as "YYYY-MM-DD" (stable for storage/grouping)
 *   - Weeks start on Monday (matches the web weekly strip: MON … SUN)
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTH_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Local "YYYY-MM-DD" for a Date (or ISO string). */
export function toDateKey(input = new Date()) {
  const date = input instanceof Date ? input : new Date(input);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Midnight (local) of the given day. */
export function startOfDay(input = new Date()) {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Monday 00:00 of the week containing `input`. */
export function startOfWeek(input = new Date()) {
  const date = startOfDay(input);
  const offset = (date.getDay() + 6) % 7; // Mon=0 … Sun=6
  return addDays(date, -offset);
}

export function addDays(input, days) {
  const date = new Date(input);
  date.setDate(date.getDate() + days);
  return date;
}

/** Whole calendar days between two dates (b - a). */
export function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / DAY_MS);
}

/** "Today", "Yesterday", "3 days ago", or "12 Oct" for older dates. */
export function formatRelativeDay(input, now = new Date()) {
  const diff = daysBetween(input, now);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return formatShortDate(input);
}

/** "12 Oct" */
export function formatShortDate(input) {
  const date = new Date(input);
  return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
}

/** "Tuesday · 3 November" */
export function formatLongDate(input = new Date()) {
  const date = new Date(input);
  return `${WEEKDAY_LONG[date.getDay()]} · ${date.getDate()} ${MONTH_LONG[date.getMonth()]}`;
}

/** "November 2026" */
export function formatMonthYear(input = new Date()) {
  const date = new Date(input);
  return `${MONTH_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

/** "7:42 AM" */
export function formatTimeOfDay(input = new Date()) {
  const date = new Date(input);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12}:${minutes} ${suffix}`;
}

/** "Good morning" / "Good afternoon" / "Good evening" */
export function getGreeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
