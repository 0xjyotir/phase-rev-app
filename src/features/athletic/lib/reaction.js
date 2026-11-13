/**
 * Reaction drill — pure helpers (unit-tested).
 *
 * A round is 5 trials: wait for the signal (a random 1.2–3.5 s delay), tap as
 * fast as possible. Tapping early is a false start and doesn't count.
 */
export const TRIALS_PER_ROUND = 5;
export const MIN_DELAY_MS = 1200;
export const MAX_DELAY_MS = 3500;

/** Random wait before the signal, so the athlete can't anticipate it. */
export function nextDelay(random = Math.random) {
  return Math.round(MIN_DELAY_MS + random() * (MAX_DELAY_MS - MIN_DELAY_MS));
}

/**
 * @param {number[]} times reaction times in ms (false starts excluded)
 */
export function summarizeRound(times) {
  if (!times.length) return null;
  const sorted = [...times].sort((a, b) => a - b);
  const average = Math.round(times.reduce((sum, t) => sum + t, 0) / times.length);
  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  return { average, median, best: sorted[0], rating: rateReaction(average) };
}

/** Human-friendly band for an average reaction time. */
export function rateReaction(averageMs) {
  if (averageMs < 220) return { label: "Elite", tone: "success" };
  if (averageMs < 270) return { label: "Sharp", tone: "accent" };
  if (averageMs < 330) return { label: "Solid", tone: "champagne" };
  return { label: "Warming up", tone: "neutral" };
}
