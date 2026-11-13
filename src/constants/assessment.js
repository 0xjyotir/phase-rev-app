/**
 * Baseline assessment wizard content.
 *
 * Web source: phaserev/src/constants/assessment.ts
 * Screen:     app/assessment.js (4 steps, saved to profile-store)
 *
 * IDs (goal / activity) are stored per user — keep them stable.
 */
export const assessmentCopy = {
  eyebrow: "Assessment",
  headline: "Build your baseline profile",
  subheadline:
    "Height, weight, target and goals — translated into a clear starting point across training, nutrition and recovery.",
  duration: "2 min",
  footnote: "Your starting point shapes everything that follows.",
};

export const assessmentSteps = [
  { id: "body", title: "Body metrics", description: "Height, weight, and current BMI." },
  { id: "goal", title: "Your target", description: "Goal direction and target weight." },
  { id: "activity", title: "Training load", description: "How you move week to week." },
  { id: "results", title: "Your profile", description: "Baseline summary and recommended path." },
];

export const assessmentGoals = [
  {
    id: "lose-fat",
    label: "Lose body fat",
    description: "Reduce weight while preserving lean mass and energy.",
  },
  {
    id: "build-muscle",
    label: "Build muscle",
    description: "Prioritize strength, hypertrophy, and progressive overload.",
  },
  {
    id: "recompose",
    label: "Recomposition",
    description: "Shift body composition without chasing a single number on the scale.",
  },
  {
    id: "maintain",
    label: "Maintain & optimize",
    description: "Hold your current weight and sharpen habits across pillars.",
  },
  {
    id: "performance",
    label: "Sport performance",
    description: "Train for speed, power, endurance, or competition peaks.",
  },
];

export const assessmentActivityLevels = [
  {
    id: "sedentary",
    label: "Mostly sedentary",
    description: "Desk-led days with little structured training.",
    multiplier: 1.2,
  },
  {
    id: "light",
    label: "1–2 sessions / week",
    description: "Light activity or inconsistent gym time.",
    multiplier: 1.375,
  },
  {
    id: "moderate",
    label: "3–4 sessions / week",
    description: "Regular training with moderate weekly volume.",
    multiplier: 1.55,
  },
  {
    id: "high",
    label: "5+ sessions / week",
    description: "High-frequency training or active lifestyle.",
    multiplier: 1.725,
  },
  {
    id: "athlete",
    label: "Competitive athlete",
    description: "Structured sport schedule with periodized demands.",
    multiplier: 1.9,
  },
];

/** Recommended pillar path per goal — shown on the results step. */
export const goalPillarPaths = {
  "lose-fat": ["nutrition", "physical", "mental"],
  "build-muscle": ["physical", "nutrition", "mental"],
  recompose: ["physical", "nutrition", "mental"],
  maintain: ["mental", "physical", "nutrition"],
  performance: ["athletic", "physical", "nutrition"],
};

/** Starting values for the wizard (metric). */
export const assessmentDefaults = {
  unitSystem: "metric",
  heightCm: 175,
  weightKg: 76,
  age: 28,
  targetWeightKg: 72,
  goalId: "recompose",
  activityId: "moderate",
};
