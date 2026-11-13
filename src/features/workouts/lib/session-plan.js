/**
 * Session planning — turns a Routine + workout history into today's session.
 *
 * This is the "progressive overload" brain described in
 * CLIENT-TRAINING-SYSTEM-OVERVIEW.md: always compare *last time* vs *today's target*.
 *
 * Rules (kept deliberately simple and explainable):
 *   1. "Previous" for set N = what you logged for set N last time you did the exercise.
 *   2. If your first working set last time reached the TOP of the rep range,
 *      today's target adds one load increment (+2.5 kg barbell, +2 kg dumbbell…).
 *   3. Otherwise keep the weight and beat the reps.
 *   4. Holds: same idea in seconds (+2s when the top of the range was reached).
 */
import { getExerciseById } from "@/constants/exercises";
import { getLoadIncrement, getBestSet, parseRepRange, setScore, totalVolume } from "./workout-math";

/** Most recent logged sets for an exercise, or null if never trained. */
export function getLastPerformance(history, exerciseId) {
  for (const entry of history) {
    const match = entry.exercises.find((e) => e.exerciseId === exerciseId && e.sets.length > 0);
    if (match) return { performedAt: entry.performedAt, sets: match.sets };
  }
  return null;
}

/** Best-ever score for an exercise across history (used for PR detection). */
export function getBestScore(history, exerciseId) {
  let best = 0;
  for (const entry of history) {
    for (const exercise of entry.exercises) {
      if (exercise.exerciseId !== exerciseId) continue;
      for (const set of exercise.sets) best = Math.max(best, setScore(set));
    }
  }
  return best;
}

/**
 * @param {import("@/types/models").Routine} routine
 * @param {import("@/types/models").WorkoutHistoryEntry[]} history newest first
 * @returns {import("@/types/models").WorkoutSession}
 */
export function buildSessionPlan(routine, history) {
  const exercises = routine.exercises.map((line, index) => {
    const range = parseRepRange(line.repRange);
    const last = getLastPerformance(history, line.exerciseId);
    const sets = Array.from({ length: line.sets }, (_, setIndex) =>
      buildPlannedSet({ line, range, last, setIndex }),
    );

    return {
      id: `se-${index + 1}`,
      exerciseId: line.exerciseId,
      order: index + 1,
      repRange: line.repRange,
      rir: line.rir,
      restSeconds: line.restSeconds,
      notes: line.notes,
      supersetGroup: line.supersetGroup,
      sets,
    };
  });

  const setCount = exercises.reduce((sum, e) => sum + e.sets.length, 0);

  return {
    routineId: routine.id,
    name: routine.name,
    focus: routine.description,
    mode: routine.mode,
    // ~2.5 min per set incl. rest + warm-up buffer (web showed 57 min for 12 sets)
    estimatedMinutes: Math.max(20, Math.round(setCount * 2.5 + 10)),
    exercises,
  };
}

function buildPlannedSet({ line, range, last, setIndex }) {
  const previous = last?.sets[setIndex] ?? last?.sets[last.sets.length - 1] ?? null;
  const firstSetLastTime = last?.sets[0] ?? null;

  const base = {
    setNumber: setIndex + 1,
    setType: line.supersetGroup ? "superset" : "working",
    targetReps: line.repRange,
    completed: false,
  };

  // Skill holds (seconds)
  if (range.unit === "sec") {
    const previousHold = previous?.holdSeconds;
    const reachedTop = (firstSetLastTime?.holdSeconds ?? 0) >= range.max;
    return {
      ...base,
      previousHoldSeconds: previousHold,
      targetHoldSeconds: previousHold != null ? previousHold + (reachedTop ? 2 : 1) : range.min,
    };
  }

  const exercise = getExerciseById(line.exerciseId);
  const isRepsOnly = exercise?.trackingMode === "reps";

  // Never trained before → no previous, no target. The user sets today's baseline.
  if (!previous) return base;

  const reachedTop = (firstSetLastTime?.reps ?? 0) >= range.max;
  const increment = getLoadIncrement(line.exerciseId);
  const lastTopWeight = firstSetLastTime?.weight ?? previous.weight ?? 0;

  return {
    ...base,
    previousWeight: previous.weight,
    previousReps: previous.reps,
    targetWeight: isRepsOnly ? undefined : reachedTop ? lastTopWeight + increment : lastTopWeight,
  };
}

/**
 * Converts a finished live session into a persisted history entry + summary.
 *
 * @param {import("@/types/models").WorkoutSession} session
 * @param {{ startedAt: number, endedAt: number, history: any[], streak: number, id: string }} context
 */
export function summarizeSession(session, { startedAt, endedAt, history, streak, id }) {
  const exercises = session.exercises
    .map((exercise) => ({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets
        .filter((set) => set.completed)
        .map((set) => ({ weight: set.weight, reps: set.reps, holdSeconds: set.holdSeconds })),
    }))
    .filter((exercise) => exercise.sets.length > 0);

  const allSets = exercises.flatMap((e) => e.sets);
  const volumeKg = Math.round(totalVolume(allSets));

  // A PR = this session's best set beats the best set ever logged for that exercise.
  const prs = exercises.filter((exercise) => {
    const best = getBestSet(exercise.sets);
    return best && setScore(best) > getBestScore(history, exercise.exerciseId);
  }).length;

  const previousSameRoutine = history.find((entry) => entry.routineId === session.routineId);
  const volumeDeltaPercent =
    previousSameRoutine && previousSameRoutine.volumeKg > 0
      ? Math.round(((volumeKg - previousSameRoutine.volumeKg) / previousSameRoutine.volumeKg) * 100)
      : null;

  const durationMin = Math.max(1, Math.round((endedAt - startedAt) / 60000));

  const historyEntry = {
    id,
    routineId: session.routineId,
    name: session.name,
    performedAt: new Date(startedAt).toISOString(),
    durationMin,
    sets: allSets.length,
    volumeKg,
    prs,
    exercises,
  };

  const summary = {
    historyId: id,
    name: session.name,
    durationMin,
    sets: allSets.length,
    volumeKg,
    prs,
    volumeDeltaPercent,
    streak,
  };

  return { historyEntry, summary };
}

/** Live progress numbers for the active-session header. */
export function getSessionProgress(session) {
  let completedSets = 0;
  let totalSets = 0;
  let volumeKg = 0;

  for (const exercise of session.exercises) {
    for (const set of exercise.sets) {
      totalSets += 1;
      if (set.completed) {
        completedSets += 1;
        volumeKg += (set.weight ?? 0) * (set.reps ?? 0);
      }
    }
  }

  return { completedSets, totalSets, volumeKg: Math.round(volumeKg) };
}
