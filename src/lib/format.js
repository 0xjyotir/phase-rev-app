/**
 * Number + duration formatting used across screens.
 */

/** 8420 → "8,420" */
export function formatNumber(value, maximumFractionDigits = 0) {
  if (value == null || Number.isNaN(value)) return "—";
  return Number(value).toLocaleString("en-US", { maximumFractionDigits });
}

/** Non-breaking space: keeps a number and its unit on one line ("12,290 kg"). */
const NBSP = "\u00A0";

/** 82.5 → "82.5 kg", 0 → "BW" (bodyweight) */
export function formatWeight(kg, { bodyweightLabel = "BW" } = {}) {
  if (kg == null) return "—";
  if (kg === 0) return bodyweightLabel;
  return `${formatNumber(kg, 1)}${NBSP}kg`;
}

/** 24850 → "24.9t" for compact stat tiles, otherwise "8,420 kg" */
export function formatVolume(kg, { compact = false } = {}) {
  if (kg == null) return "—";
  if (compact && kg >= 10000) return `${formatNumber(kg / 1000, 1)}t`;
  return `${formatNumber(kg)}${NBSP}kg`;
}

/** 150 → "02:30" (rest timer) */
export function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** 3725 → "1:02:05", 605 → "10:05" (workout stopwatch) */
export function formatStopwatch(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** 702 minutes → "11h 42m" */
export function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

/** 150 → "2:30" (rest prescription label) */
export function formatRestLabel(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

/** ("set", 3) → "3 sets" */
export function pluralize(word, count, plural = `${word}s`) {
  return `${count} ${count === 1 ? word : plural}`;
}

/** Clamp a ratio to 0–100 for progress bars. */
export function toPercent(current, target) {
  if (!target) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

/** "First Last" → "FL" */
export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** "build-muscle" → "Build muscle" style capitalization for ids. */
export function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
