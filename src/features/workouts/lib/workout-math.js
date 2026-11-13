/**
 * Pure training math — no React, no store. Easy to unit test.
 *
 * Used by: session-plan.js, training-analytics.js, training-store.js, set rows.
 */
import { getExerciseById } from "@/constants/exercises";

/**
 * Parses a prescription string into numbers.
 *   "6–8"        → { min: 6, max: 8, unit: "reps" }
 *   "30–45 SEC"  → { min: 30, max: 45, unit: "sec" }
 *   "12"         → { min: 12, max: 12, unit: "reps" }
 */
export function parseRepRange(repRange = "") {
  const unit = /sec/i.test(repRange) ? "sec" : "reps";
  const numbers = repRange.match(/\d+/g)?.map(Number) ?? [];
  const min = numbers[0] ?? 0;
  const max = numbers[1] ?? min;
  return { min, max, unit };
}

/** Volume of one set = weight × reps (bodyweight / holds count as 0). */
export function setVolume(set) {
  return (set.weight ?? 0) * (set.reps ?? 0);
}

/** Total volume of a list of sets. */
export function totalVolume(sets) {
  return sets.reduce((sum, set) => sum + setVolume(set), 0);
}

/**
 * Estimated one-rep max (Epley formula): weight × (1 + reps / 30).
 * Returns null for bodyweight-only or hold sets.
 */
export function estimateOneRepMax(weight, reps) {
  if (!weight || !reps) return null;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/** The set with the highest e1RM (or longest hold / most reps for bodyweight work). */
export function getBestSet(sets) {
  let best = null;
  let bestScore = -Infinity;
  for (const set of sets) {
    const score = setScore(set);
    if (score > bestScore) {
      best = set;
      bestScore = score;
    }
  }
  return best;
}

/**
 * Comparable "strength score" for any set type, so PR detection works for
 * weighted lifts, bodyweight reps and skill holds alike.
 */
export function setScore(set) {
  if (set.holdSeconds) return set.holdSeconds;
  const e1rm = estimateOneRepMax(set.weight, set.reps);
  if (e1rm != null) return e1rm;
  return set.reps ?? 0;
}

/** Smallest sensible load jump for the equipment (progressive overload). */
export function getLoadIncrement(exerciseId) {
  const equipment = getExerciseById(exerciseId)?.equipment;
  if (equipment === "Dumbbell") return 2;
  if (equipment === "Machine") return 5;
  if (equipment === "Bodyweight") return 2.5; // added load on a belt
  return 2.5; // barbell / cable
}

/** Human label for a logged set: "82.5 kg × 8", "BW × 12", "45s". */
export function formatSet(set) {
  if (set.holdSeconds) return `${set.holdSeconds}s`;
  if (set.weight) return `${set.weight} kg × ${set.reps ?? "—"}`;
  if (set.reps != null) return `BW × ${set.reps}`;
  return "—";
}

/**
 * Feedback shown on a completed set (Hevy-style, deliberately subtle).
 * Compares what was logged with last time and today's target.
 *
 * @returns {{ label: string, tone: "accent" | "success" } | null}
 */
export function getSetFeedback(set) {
  if (!set.completed) return null;

  if (set.holdSeconds != null) {
    if (set.previousHoldSeconds != null && set.holdSeconds > set.previousHoldSeconds) {
      return { label: `+${set.holdSeconds - set.previousHoldSeconds}s vs last`, tone: "success" };
    }
    return null;
  }

  const weight = set.weight ?? 0;
  const reps = set.reps ?? 0;
  const prevWeight = set.previousWeight ?? 0;
  const prevReps = set.previousReps ?? 0;

  if (set.targetWeight != null && weight >= set.targetWeight && weight > prevWeight) {
    return { label: `Target hit · +${round1(weight - prevWeight)} kg`, tone: "success" };
  }
  if (weight > prevWeight && set.previousWeight != null) {
    return { label: `+${round1(weight - prevWeight)} kg vs last`, tone: "success" };
  }
  if (weight >= prevWeight && reps > prevReps && set.previousReps != null) {
    return {
      label: `+${reps - prevReps} rep${reps - prevReps > 1 ? "s" : ""} vs last`,
      tone: "success",
    };
  }
  if (set.targetWeight != null && weight >= set.targetWeight) {
    return { label: "Target hit", tone: "accent" };
  }
  return null;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}
