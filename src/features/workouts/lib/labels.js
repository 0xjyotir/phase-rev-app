/**
 * Display labels for workout UI (kept out of components so wording is consistent).
 */
import { capitalize } from "@/lib/format";

/** "01", or "03A" when the exercise is part of superset A. */
export function getOrderLabel(sessionExercise) {
  const order = String(sessionExercise.order).padStart(2, "0");
  return sessionExercise.supersetGroup ? `${order}${sessionExercise.supersetGroup}` : order;
}

/** "3 × 6–8 · RIR 1–2" */
export function getPrescriptionLabel(sessionExercise) {
  const sets = sessionExercise.sets.length;
  const rir = sessionExercise.rir ? ` · RIR ${sessionExercise.rir}` : "";
  return `${sets} × ${sessionExercise.repRange}${rir}`;
}

/** "Last time" for the first set: "80 kg × 7", "38s", or "—" */
export function getPreviousLabel(set) {
  if (!set) return "—";
  if (set.previousHoldSeconds != null) return `${set.previousHoldSeconds}s`;
  if (set.previousReps != null) {
    return set.previousWeight
      ? `${set.previousWeight} kg × ${set.previousReps}`
      : `BW × ${set.previousReps}`;
  }
  return "—";
}

/** "Aim for" for the first set: "82.5 kg × 6–8", "40s", or the rep range. */
export function getTargetLabel(set, repRange) {
  if (!set) return repRange;
  if (set.targetHoldSeconds != null) return `${set.targetHoldSeconds}s`;
  if (set.targetWeight) return `${set.targetWeight} kg × ${repRange}`;
  return repRange;
}

/** "Chest · Barbell" */
export function getExerciseMeta(exercise) {
  if (!exercise) return "";
  return `${capitalize(exercise.muscleGroup)} · ${exercise.equipment}`;
}

export const SET_TYPE_LABELS = {
  warmup: "Warm-up",
  drop: "Drop",
  failure: "Failure",
  superset: "Superset",
};
