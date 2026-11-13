/**
 * Nutrition day logic — pure functions (no React, no stores), unit-tested.
 *
 * A member's nutrition profile describes *today*. When the calendar day
 * changes, today's totals are archived into `history` and a fresh day starts:
 * macros back to zero, water back to zero, and the planned meals reappear
 * un-ticked. That archive powers the live "This week" calorie chart and the
 * nutrition score on Home.
 */
import { addDays, toDateKey, WEEKDAY_SHORT } from "@/lib/dates";

export const HISTORY_DAYS = 30;

/** Snapshot of a finished day, stored in nutrition.history. */
export function summarizeDay(nutrition) {
  return {
    date: nutrition.date,
    calories: nutrition.calories.current,
    protein: nutrition.protein.current,
    carbs: nutrition.carbs.current,
    fat: nutrition.fat.current,
    water: nutrition.hydration.current,
    caloriesTarget: nutrition.calories.target,
  };
}

/**
 * Returns the nutrition object for `todayKey`. If it already describes today,
 * it's returned unchanged (same reference). Otherwise the old day is archived
 * and a new day begins from `plannedMeals`.
 *
 * @param {object} nutrition    the stored nutrition profile
 * @param {object[]} plannedMeals default planned meals for a fresh day
 * @param {string} todayKey     "YYYY-MM-DD"
 */
export function rolloverNutrition(nutrition, plannedMeals, todayKey = toDateKey()) {
  if (nutrition.date === todayKey) return nutrition;

  const history = [
    summarizeDay(nutrition),
    ...(nutrition.history ?? []).filter((day) => day.date !== nutrition.date),
  ]
    .filter((day) => day.date && day.date < todayKey)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, HISTORY_DAYS);

  const zero = (macro) => ({ ...macro, current: 0 });

  return {
    ...nutrition,
    date: todayKey,
    calories: zero(nutrition.calories),
    protein: zero(nutrition.protein),
    carbs: zero(nutrition.carbs),
    fat: zero(nutrition.fat),
    hydration: { ...nutrition.hydration, current: 0 },
    mealLog: plannedMeals.map((meal) => ({ ...meal, logged: false, time: "Planned" })),
    history,
  };
}

/**
 * Last 7 days (oldest → today) of calories for the weekly chart.
 * Days with no record are 0.
 */
export function getWeekCalories(nutrition, now = new Date()) {
  const byDate = new Map((nutrition.history ?? []).map((day) => [day.date, day]));
  byDate.set(nutrition.date, summarizeDay(nutrition));
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(now, i - 6);
    const key = toDateKey(date);
    const day = byDate.get(key);
    return {
      key,
      label: WEEKDAY_SHORT[date.getDay()],
      value: day?.calories ?? 0,
      target: day?.caloriesTarget ?? nutrition.calories.target,
      isToday: i === 6,
    };
  });
}

/**
 * Nutrition score (0–100): how close the last logged days landed to target.
 * Each day scores 100 at target and loses points for every % off (over or under),
 * plus protein adherence. Today counts only once something is logged.
 */
export function getNutritionScore(nutrition, now = new Date()) {
  const week = getWeekCalories(nutrition, now).filter(
    (day) => day.value > 0 && !(day.isToday && day.value < day.target * 0.5),
  );
  if (!week.length) return null;
  const calorieScores = week.map((day) => {
    const offBy = Math.abs(day.value - day.target) / day.target;
    return Math.max(0, 100 - offBy * 150);
  });
  const calorieAvg = calorieScores.reduce((a, b) => a + b, 0) / calorieScores.length;
  const proteinRatio = nutrition.protein.target
    ? Math.min(1, nutrition.protein.current / nutrition.protein.target)
    : 1;
  return Math.round(calorieAvg * 0.8 + proteinRatio * 100 * 0.2);
}

/**
 * Seeds `days` of believable history ending yesterday (demo member), using the
 * website's weekly trend so the chart looks the same on first launch.
 */
export function seedNutritionHistory(trend, target, now = new Date()) {
  return trend
    .slice(0, 6)
    .map((day, index) => {
      const date = addDays(now, index - 6);
      return {
        date: toDateKey(date),
        calories: day.calories,
        protein: Math.round(day.calories * 0.075),
        carbs: Math.round(day.calories * 0.108),
        fat: Math.round(day.calories * 0.033),
        water: 2.4 + (index % 3) * 0.3,
        caloriesTarget: target,
      };
    })
    .reverse();
}
