/**
 * BMI + unit helpers. Direct port of phaserev/src/lib/bmi.ts, plus a simple
 * daily-energy estimate for the results step.
 */

export const kgFromLb = (lb) => lb * 0.45359237;
export const lbFromKg = (kg) => kg / 0.45359237;
export const cmFromIn = (inches) => inches * 2.54;
export const inFromCm = (cm) => cm / 2.54;

/** @returns {number | null} */
export function calculateBmi(weightKg, heightCm) {
  if (heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/** @returns {"underweight" | "normal" | "overweight" | "obese"} */
export function getBmiCategory(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export function getBmiLabel(category) {
  switch (category) {
    case "underweight":
      return "Underweight";
    case "normal":
      return "Healthy range";
    case "overweight":
      return "Above healthy";
    default:
      return "High range";
  }
}

/** Map BMI to 0–100 for the gauge (16–35 spread, same as the web). */
export function bmiToGaugePercent(bmi) {
  const min = 16;
  const max = 35;
  return Math.min(100, Math.max(0, ((bmi - min) / (max - min)) * 100));
}

/**
 * Rough maintenance calories using a sex-neutral Mifflin–St Jeor average
 * (the assessment doesn't ask for sex). Shown as a starting point only —
 * the nutrition team refines real targets.
 */
export function estimateMaintenanceCalories({ weightKg, heightCm, age, activityMultiplier }) {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78; // midpoint of +5 / −161
  return Math.round((bmr * activityMultiplier) / 10) * 10;
}

/** Protein guidance for active people: 1.6–2.2 g per kg. */
export function getProteinRange(weightKg) {
  return { min: Math.round(weightKg * 1.6), max: Math.round(weightKg * 2.2) };
}
