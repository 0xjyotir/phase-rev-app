/**
 * Exercise library — gym + calisthenics movements.
 *
 * Web source: phaserev/src/constants/physical-data.ts → physicalExercises
 * (the first 12 entries keep the exact same IDs; a few common lifts were
 * added so the routine builder has a realistic catalog).
 *
 * Linked from:
 *   - training-seed.js (workouts & history reference exercises by `id`)
 *   - Train → Library, exercise/[id] detail screen, routine builder
 *
 * @typedef {import("@/types/models").Exercise} Exercise
 */

/** @type {Exercise[]} */
export const exercises = [
  // ── Gym · Chest ─────────────────────────────────────────────────────────
  {
    id: "barbell-bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "chest",
    equipment: "Barbell",
    mode: "gym",
    tags: ["push", "chest"],
    trackingMode: "weight",
    defaultRestSeconds: 150,
    primaryMuscles: ["Chest", "Triceps", "Front delts"],
    technique: [
      "Set your position with eyes under the bar.",
      "Brace your upper back and create leg drive.",
      "Lower the bar under control to mid-chest.",
      "Drive through the floor and press up.",
      "Lock out without losing shoulder position.",
    ],
    commonErrors: [
      "Excessive elbow flare",
      "Losing upper-back tension",
      "Bouncing the bar off the chest",
      "Poor bar path",
    ],
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscleGroup: "chest",
    equipment: "Dumbbell",
    mode: "gym",
    tags: ["push", "chest"],
    trackingMode: "weight",
    defaultRestSeconds: 120,
    primaryMuscles: ["Upper chest", "Triceps"],
    technique: [
      "Set bench to 30–45°.",
      "Press with a controlled arc.",
      "Full stretch at the bottom.",
    ],
    commonErrors: ["Bench too steep", "Short range of motion"],
  },
  {
    id: "cable-fly",
    name: "Cable Fly",
    muscleGroup: "chest",
    equipment: "Cable",
    mode: "gym",
    tags: ["push", "chest"],
    trackingMode: "weight",
    defaultRestSeconds: 90,
    primaryMuscles: ["Chest"],
    technique: ["Slight bend in the elbows.", "Squeeze at the midline.", "Control the eccentric."],
    commonErrors: ["Turning it into a press", "Overstretching"],
  },

  // ── Gym · Shoulders ─────────────────────────────────────────────────────
  {
    id: "lateral-raise",
    name: "Dumbbell Lateral Raise",
    muscleGroup: "shoulders",
    equipment: "Dumbbell",
    mode: "gym",
    tags: ["push", "shoulders"],
    trackingMode: "weight",
    defaultRestSeconds: 60,
    primaryMuscles: ["Side delts"],
    technique: ["Lead with the elbows.", "Stop at shoulder height.", "Slow lowering phase."],
    commonErrors: ["Using momentum", "Shrugging traps"],
  },
  {
    id: "overhead-press",
    name: "Standing Overhead Press",
    muscleGroup: "shoulders",
    equipment: "Barbell",
    mode: "gym",
    tags: ["push", "shoulders"],
    trackingMode: "weight",
    defaultRestSeconds: 150,
    primaryMuscles: ["Front delts", "Triceps", "Upper chest"],
    technique: [
      "Squeeze glutes and brace before every rep.",
      "Press the bar in a straight line past the face.",
      "Finish with biceps by the ears.",
    ],
    commonErrors: ["Leaning back excessively", "Flaring ribs", "Pressing forward of the head"],
  },

  // ── Gym · Back ──────────────────────────────────────────────────────────
  {
    id: "deadlift",
    name: "Conventional Deadlift",
    muscleGroup: "back",
    equipment: "Barbell",
    mode: "gym",
    tags: ["pull", "back"],
    trackingMode: "weight",
    defaultRestSeconds: 180,
    primaryMuscles: ["Hamstrings", "Glutes", "Back"],
    technique: [
      "Wedge the hips.",
      "Pull the slack out.",
      "Keep the bar close.",
      "Lock hips and knees together.",
    ],
    commonErrors: ["Rounded back", "Bar drifting forward"],
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    muscleGroup: "back",
    equipment: "Barbell",
    mode: "gym",
    tags: ["pull", "back"],
    trackingMode: "weight",
    defaultRestSeconds: 120,
    primaryMuscles: ["Lats", "Mid back", "Rear delts"],
    technique: ["Hinge to ~45°.", "Row to the lower ribs.", "Pause and control the descent."],
    commonErrors: ["Standing up during the rep", "Jerking the weight"],
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "back",
    equipment: "Cable",
    mode: "gym",
    tags: ["pull", "back"],
    trackingMode: "weight",
    defaultRestSeconds: 90,
    primaryMuscles: ["Lats", "Biceps"],
    technique: [
      "Depress the shoulders first.",
      "Pull elbows to your sides.",
      "Full stretch at the top.",
    ],
    commonErrors: ["Leaning too far back", "Pulling behind the neck"],
  },

  // ── Gym · Legs ──────────────────────────────────────────────────────────
  {
    id: "barbell-squat",
    name: "Barbell Back Squat",
    muscleGroup: "legs",
    equipment: "Barbell",
    mode: "gym",
    tags: ["legs"],
    trackingMode: "weight",
    defaultRestSeconds: 180,
    primaryMuscles: ["Quads", "Glutes"],
    technique: [
      "Brace the core.",
      "Break at hips and knees.",
      "Hit depth with control.",
      "Drive up evenly.",
    ],
    commonErrors: ["Knee collapse", "Good-morning squat", "Shallow depth"],
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscleGroup: "legs",
    equipment: "Barbell",
    mode: "gym",
    tags: ["pull", "legs"],
    trackingMode: "weight",
    defaultRestSeconds: 120,
    primaryMuscles: ["Hamstrings", "Glutes"],
    technique: [
      "Soft knees, push hips back.",
      "Bar slides down the thighs.",
      "Stop at a deep hamstring stretch.",
    ],
    commonErrors: ["Squatting the weight down", "Rounding the lower back"],
  },
  {
    id: "leg-press",
    name: "Leg Press",
    muscleGroup: "legs",
    equipment: "Machine",
    mode: "gym",
    tags: ["legs"],
    trackingMode: "weight",
    defaultRestSeconds: 120,
    primaryMuscles: ["Quads", "Glutes"],
    technique: [
      "Feet shoulder-width, mid-platform.",
      "Lower until hips stay planted.",
      "Don't lock knees hard.",
    ],
    commonErrors: ["Hips lifting off the pad", "Partial reps"],
  },

  // ── Gym · Arms & Core ───────────────────────────────────────────────────
  {
    id: "barbell-curl",
    name: "Barbell Curl",
    muscleGroup: "arms",
    equipment: "Barbell",
    mode: "gym",
    tags: ["pull", "arms"],
    trackingMode: "weight",
    defaultRestSeconds: 60,
    primaryMuscles: ["Biceps"],
    technique: [
      "Elbows pinned to your sides.",
      "Curl without swinging.",
      "Slow 2-second lowering.",
    ],
    commonErrors: ["Using the hips", "Elbows drifting forward"],
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    muscleGroup: "arms",
    equipment: "Cable",
    mode: "gym",
    tags: ["push", "arms"],
    trackingMode: "weight",
    defaultRestSeconds: 60,
    primaryMuscles: ["Triceps"],
    technique: ["Lock elbows by your ribs.", "Fully extend and squeeze.", "Control on the way up."],
    commonErrors: ["Elbows flaring", "Leaning over the stack"],
  },
  {
    id: "cable-crunch",
    name: "Cable Crunch",
    muscleGroup: "core",
    equipment: "Cable",
    mode: "gym",
    tags: ["core"],
    trackingMode: "weight",
    defaultRestSeconds: 60,
    primaryMuscles: ["Abs"],
    technique: ["Hips stay fixed.", "Curl ribs toward pelvis.", "Exhale hard at the bottom."],
    commonErrors: ["Pulling with the arms", "Hinging at the hips"],
  },

  // ── Calisthenics ────────────────────────────────────────────────────────
  {
    id: "pull-up",
    name: "Pull-Up",
    muscleGroup: "back",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["pull", "skills"],
    trackingMode: "weight",
    defaultRestSeconds: 120,
    primaryMuscles: ["Lats", "Biceps"],
    technique: ["Depress the scapula.", "Pull chest to the bar.", "Control the descent."],
    commonErrors: ["Kipping excessively", "Half reps"],
  },
  {
    id: "dip",
    name: "Parallel Bar Dip",
    muscleGroup: "chest",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["push", "skills"],
    trackingMode: "weight",
    defaultRestSeconds: 120,
    primaryMuscles: ["Chest", "Triceps"],
    technique: [
      "Lean forward for chest emphasis.",
      "Full depth with control.",
      "Lock out at the top.",
    ],
    commonErrors: ["Shoulders rolling forward", "Partial range"],
  },
  {
    id: "push-up",
    name: "Push-Up",
    muscleGroup: "chest",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["push"],
    trackingMode: "reps",
    defaultRestSeconds: 60,
    primaryMuscles: ["Chest", "Triceps", "Core"],
    technique: [
      "Body in one straight line.",
      "Elbows ~45° from the torso.",
      "Chest touches the floor.",
    ],
    commonErrors: ["Sagging hips", "Flared elbows"],
  },
  {
    id: "pistol-squat",
    name: "Pistol Squat",
    muscleGroup: "legs",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["legs", "skills"],
    trackingMode: "reps",
    defaultRestSeconds: 90,
    primaryMuscles: ["Quads", "Glutes", "Core"],
    technique: [
      "Reach arms forward for balance.",
      "Sit back and down slowly.",
      "Drive through the whole foot.",
    ],
    commonErrors: ["Heel lifting", "Knee caving inward"],
  },
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    muscleGroup: "core",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["core"],
    trackingMode: "reps",
    defaultRestSeconds: 60,
    primaryMuscles: ["Abs", "Hip flexors"],
    technique: [
      "Start from a dead hang.",
      "Posteriorly tilt the pelvis.",
      "Lower without swinging.",
    ],
    commonErrors: ["Swinging for momentum", "Only lifting the knees"],
  },
  {
    id: "muscle-up",
    name: "Muscle-Up",
    muscleGroup: "skills",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["skills", "pull", "push"],
    trackingMode: "reps",
    defaultRestSeconds: 150,
    primaryMuscles: ["Lats", "Chest", "Triceps"],
    technique: ["Explosive pull.", "Quick transition.", "Strong dip lockout."],
    commonErrors: ["Chicken-wing transition", "No false grip when needed"],
  },
  {
    id: "handstand",
    name: "Handstand Hold",
    muscleGroup: "skills",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["skills", "shoulders"],
    trackingMode: "hold",
    defaultRestSeconds: 90,
    primaryMuscles: ["Shoulders", "Core"],
    technique: ["Stack the joints.", "Push the floor away.", "Breathe steadily."],
    commonErrors: ["Banana back", "Holding your breath"],
  },
  {
    id: "front-lever",
    name: "Front Lever",
    muscleGroup: "skills",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["skills", "pull", "core"],
    trackingMode: "hold",
    defaultRestSeconds: 120,
    primaryMuscles: ["Lats", "Core", "Shoulders"],
    technique: ["Depress the scapula.", "Hollow body.", "Progress from tuck to advanced tuck."],
    commonErrors: ["Piking the hips", "Bent arms"],
  },
  {
    id: "planche-lean",
    name: "Planche Lean",
    muscleGroup: "skills",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["skills", "push", "shoulders"],
    trackingMode: "hold",
    defaultRestSeconds: 90,
    primaryMuscles: ["Shoulders", "Chest", "Core"],
    technique: ["Protract the scapula.", "Lean forward gradually.", "Keep elbows locked."],
    commonErrors: ["Collapsing shoulders", "Excessive lumbar arch"],
  },
  {
    id: "l-sit",
    name: "L-Sit",
    muscleGroup: "core",
    equipment: "Bodyweight",
    mode: "calisthenics",
    tags: ["core", "skills"],
    trackingMode: "hold",
    defaultRestSeconds: 90,
    primaryMuscles: ["Abs", "Hip flexors", "Triceps"],
    technique: [
      "Press shoulders down hard.",
      "Lock knees, point toes.",
      "Lift legs to hip height.",
    ],
    commonErrors: ["Shrugged shoulders", "Bent knees"],
  },
];

/** O(1) lookup map, built once. */
const exerciseIndex = Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise]));

/** @returns {Exercise | null} */
export function getExerciseById(exerciseId) {
  return exerciseIndex[exerciseId] ?? null;
}

/** Library filter chips per training mode (web: gymMuscleFilters / calisthenicsMuscleFilters). */
export const muscleFilters = {
  gym: ["all", "chest", "back", "shoulders", "arms", "legs", "core", "push", "pull"],
  calisthenics: ["all", "push", "pull", "legs", "core", "skills"],
};

/** A filter id matches the exercise's primary group OR one of its tags ("push", "pull"…). */
export function matchesMuscleFilter(exercise, filterId) {
  if (filterId === "all") return true;
  return exercise.muscleGroup === filterId || exercise.tags.includes(filterId);
}

/** Video used by the "Watch form" player until real per-exercise videos are recorded. */
export const FORM_VIDEO_PLACEHOLDER = require("@assets/video/hero.mp4");
