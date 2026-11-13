/**
 * Training seed data — the demo member's routines, weekly plan and history.
 *
 * Web source: phaserev/src/constants/physical-data.ts (mockRoutines,
 * mockWeeklyOverview, mockWorkoutHistory, mockBodyWeightSeries, …).
 *
 * Difference from the web build: instead of hard-coded dates ("26 AUG"), the
 * history is GENERATED relative to the first app launch. That way every
 * analytics view (streak, weekly strip, volume trend, PRs, "last time" vs
 * "aim for") is computed from real data and keeps working as the user logs
 * new workouts.
 *
 * Read once by training-store.js when it creates its initial state.
 */
import { addDays, startOfDay } from "@/lib/dates";
import { seededRandom } from "@/lib/id";
import { getLoadIncrement, parseRepRange } from "@/features/workouts/lib/workout-math";

/** @type {import("@/types/models").Routine[]} */
export const seedRoutines = [
  {
    id: "rt-push",
    name: "Gym · Push",
    description: "Chest, shoulders & triceps with progressive overload targets.",
    mode: "gym",
    daysPerWeek: 2,
    exercises: [
      { exerciseId: "barbell-bench-press", sets: 3, repRange: "6–8", rir: "1–2", restSeconds: 150 },
      {
        exerciseId: "incline-dumbbell-press",
        sets: 3,
        repRange: "8–10",
        rir: "1–2",
        restSeconds: 120,
      },
      { exerciseId: "cable-fly", sets: 3, repRange: "10–12", restSeconds: 90, supersetGroup: "A" },
      {
        exerciseId: "lateral-raise",
        sets: 3,
        repRange: "12–15",
        restSeconds: 60,
        supersetGroup: "A",
      },
      { exerciseId: "tricep-pushdown", sets: 3, repRange: "10–12", restSeconds: 60 },
    ],
  },
  {
    id: "rt-pull",
    name: "Gym · Pull",
    description: "Posterior chain, lats and biceps.",
    mode: "gym",
    daysPerWeek: 1,
    exercises: [
      { exerciseId: "deadlift", sets: 3, repRange: "4–6", rir: "2", restSeconds: 180 },
      { exerciseId: "barbell-row", sets: 3, repRange: "6–8", rir: "1–2", restSeconds: 120 },
      { exerciseId: "lat-pulldown", sets: 3, repRange: "8–10", restSeconds: 90 },
      { exerciseId: "barbell-curl", sets: 3, repRange: "10–12", restSeconds: 60 },
    ],
  },
  {
    id: "rt-legs",
    name: "Gym · Legs",
    description: "Squat-led lower body day with hinge and core finish.",
    mode: "gym",
    daysPerWeek: 1,
    exercises: [
      { exerciseId: "barbell-squat", sets: 3, repRange: "5–7", rir: "1–2", restSeconds: 180 },
      { exerciseId: "romanian-deadlift", sets: 3, repRange: "8–10", restSeconds: 120 },
      { exerciseId: "leg-press", sets: 3, repRange: "10–12", restSeconds: 120 },
      { exerciseId: "cable-crunch", sets: 3, repRange: "12–15", restSeconds: 60 },
    ],
  },
  {
    id: "rt-cali",
    name: "Calisthenics · Skills",
    description: "Skill holds and weighted vertical pulling.",
    mode: "calisthenics",
    daysPerWeek: 1,
    exercises: [
      { exerciseId: "pull-up", sets: 4, repRange: "5–8", restSeconds: 120 },
      { exerciseId: "dip", sets: 3, repRange: "6–10", restSeconds: 120 },
      {
        exerciseId: "front-lever",
        sets: 4,
        repRange: "8–12 SEC",
        restSeconds: 120,
        notes: "Advanced tuck",
      },
      { exerciseId: "handstand", sets: 4, repRange: "30–45 SEC", restSeconds: 90 },
      { exerciseId: "l-sit", sets: 3, repRange: "15–25 SEC", restSeconds: 90 },
    ],
  },
];

/**
 * Weekly plan: JS weekday (0 = Sunday) → routine id, or null for a rest day.
 * Mirrors the web weekly overview (Push / Pull / Legs / Rest / Push / Calisthenics / Rest).
 */
export const seedWeekPlan = {
  0: null,
  1: "rt-push",
  2: "rt-pull",
  3: "rt-legs",
  4: null,
  5: "rt-push",
  6: "rt-cali",
};

export const seedFavoriteExerciseIds = ["barbell-bench-press", "pull-up"];

/**
 * Where the demo member's strength is *today* (top working weight, kg).
 * Bodyweight moves store ADDED load (weighted pull-ups/dips). Holds store seconds.
 */
const currentLoads = {
  "barbell-bench-press": 80,
  "incline-dumbbell-press": 30,
  "cable-fly": 12.5,
  "lateral-raise": 8,
  "tricep-pushdown": 27.5,
  deadlift: 145,
  "barbell-row": 77.5,
  "lat-pulldown": 62.5,
  "barbell-curl": 32.5,
  "barbell-squat": 115,
  "romanian-deadlift": 95,
  "leg-press": 180,
  "cable-crunch": 40,
  "pull-up": 20,
  dip: 30,
};

const currentHolds = {
  "front-lever": 10,
  handstand: 38,
  "l-sit": 20,
};

/** Calendar days (ago) the demo member skipped, so the history looks human. */
const SKIPPED_DAYS_AGO = new Set([11, 18, 26, 37, 45, 52, 66, 73]);
const HISTORY_WINDOW_DAYS = 84; // 12 weeks — enough for the 90-day trend

/**
 * Builds ~12 weeks of believable history ending yesterday.
 * Load goes up one step every two weeks, so progress charts trend upward.
 *
 * @param {Date} now
 * @returns {import("@/types/models").WorkoutHistoryEntry[]} newest first
 */
export function generateSeedHistory(now = new Date()) {
  const routinesById = Object.fromEntries(seedRoutines.map((r) => [r.id, r]));
  const entries = [];

  for (let daysAgo = 1; daysAgo <= HISTORY_WINDOW_DAYS; daysAgo += 1) {
    if (SKIPPED_DAYS_AGO.has(daysAgo)) continue;

    const day = addDays(startOfDay(now), -daysAgo);
    const routine = routinesById[seedWeekPlan[day.getDay()]];
    if (!routine) continue; // rest day

    const weeksBack = Math.floor(daysAgo / 7);
    const blocksBack = Math.floor(weeksBack / 2); // one progression step per 2-week block
    const startedAt = new Date(day);
    startedAt.setHours(7, Math.round(seededRandom(daysAgo) * 40), 0, 0);

    const exercises = routine.exercises.map((line, lineIndex) => ({
      exerciseId: line.exerciseId,
      sets: buildSeedSets(line, blocksBack, daysAgo * 10 + lineIndex),
    }));

    const allSets = exercises.flatMap((e) => e.sets);
    const volumeKg = Math.round(
      allSets.reduce((sum, s) => sum + (s.weight ?? 0) * (s.reps ?? 0), 0),
    );

    entries.push({
      id: `seed-${daysAgo}`,
      routineId: routine.id,
      name: routine.name,
      performedAt: startedAt.toISOString(),
      durationMin: Math.round(allSets.length * 2.6 + 12 + seededRandom(daysAgo + 3) * 10),
      sets: allSets.length,
      volumeKg,
      prs: weeksBack === 0 && seededRandom(daysAgo + 7) > 0.5 ? 1 : 0,
      exercises,
    });
  }

  return entries; // already newest → oldest
}

function buildSeedSets(line, blocksBack, seed) {
  const range = parseRepRange(line.repRange);

  // Skill holds: seconds, a little shorter each week back.
  if (range.unit === "sec") {
    const base = currentHolds[line.exerciseId] ?? range.min;
    return Array.from({ length: line.sets }, (_, i) => ({
      holdSeconds: Math.max(
        5,
        base - blocksBack * 2 - i * 2 + Math.round(seededRandom(seed + i) * 2),
      ),
    }));
  }

  const increment = getLoadIncrement(line.exerciseId);
  const topLoad = currentLoads[line.exerciseId] ?? 0;
  const weight = Math.max(0, topLoad - increment * blocksBack);

  // First set hits the top of the range; later sets fade by ~1 rep (fatigue).
  return Array.from({ length: line.sets }, (_, i) => {
    const fade = i === 0 ? 0 : Math.round(seededRandom(seed + i) + i * 0.5);
    return {
      weight: i === line.sets - 1 && weight > 0 && i > 1 ? weight - increment : weight,
      reps: Math.max(range.min, range.max - fade),
    };
  });
}

// ─── Body tracking (supporting data, not the core product) ──────────────────

/** Weekly weigh-ins ending today. */
export function generateSeedBodyWeights(now = new Date()) {
  const values = [74.2, 73.8, 73.5, 73.1, 72.8, 72.6, 72.4];
  return values.map((weightKg, index) => ({
    date: addDays(startOfDay(now), -(values.length - 1 - index) * 7).toISOString(),
    weightKg,
  }));
}

export const seedMeasurements = [
  { id: "chest", label: "Chest", value: 102, unit: "cm", delta: 1.0 },
  { id: "waist", label: "Waist", value: 78, unit: "cm", delta: -2.0 },
  { id: "arms", label: "Arms", value: 38, unit: "cm", delta: 0.5 },
  { id: "thighs", label: "Thighs", value: 58, unit: "cm", delta: 0.8 },
];

/** Placeholders until photo upload is built (web shows the same placeholders). */
export function generateSeedPhotos(now = new Date()) {
  return [0, 1, 2].map((monthsAgo) => {
    const date = new Date(now);
    date.setMonth(date.getMonth() - monthsAgo, 1);
    return { id: `photo-${monthsAgo}`, date: date.toISOString(), angle: "Front" };
  });
}

/** Calisthenics skill progressions (web: mockCalisthenicsSkills). */
export const seedSkills = [
  { id: "sk-1", name: "Pull-Up", progress: 80, level: "Weighted", detail: "12 reps" },
  { id: "sk-2", name: "Muscle-Up", progress: 60, level: "Strict", detail: "8 reps" },
  { id: "sk-3", name: "Handstand", progress: 70, level: "Wall", detail: "45s hold" },
  { id: "sk-4", name: "Front Lever", progress: 40, level: "Tuck", detail: "8s hold" },
  { id: "sk-5", name: "L-Sit", progress: 90, level: "Floor", detail: "30s hold" },
];
