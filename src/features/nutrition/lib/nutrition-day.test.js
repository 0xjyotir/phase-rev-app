import {
  getNutritionScore,
  getWeekCalories,
  rolloverNutrition,
  seedNutritionHistory,
} from "./nutrition-day";

const planned = [
  {
    id: "1",
    meal: "Breakfast",
    time: "7:00 AM",
    calories: 400,
    protein: 30,
    carbs: 40,
    fat: 10,
    logged: true,
  },
];

const day = (date, calories = 1800) => ({
  date,
  calories: { current: calories, target: 2200 },
  protein: { current: 140, target: 165 },
  carbs: { current: 200, target: 240 },
  fat: { current: 60, target: 72 },
  hydration: { current: 2.2, target: 3, unit: "L" },
  mealLog: planned,
  selectedRegionId: "south-asia",
  history: [],
});

describe("rolloverNutrition", () => {
  it("keeps the same object when the day hasn't changed", () => {
    const today = day("2026-11-13");
    expect(rolloverNutrition(today, planned, "2026-11-13")).toBe(today);
  });

  it("archives yesterday and starts a fresh day", () => {
    const next = rolloverNutrition(day("2026-11-12", 2100), planned, "2026-11-13");
    expect(next.date).toBe("2026-11-13");
    expect(next.calories.current).toBe(0);
    expect(next.hydration.current).toBe(0);
    expect(next.mealLog.every((meal) => !meal.logged)).toBe(true);
    expect(next.history[0]).toMatchObject({ date: "2026-11-12", calories: 2100 });
  });

  it("caps history at 30 days, newest first", () => {
    let nutrition = day("2026-10-01");
    for (let i = 2; i <= 40; i += 1) {
      const key =
        i <= 31
          ? `2026-10-${String(i).padStart(2, "0")}`
          : `2026-11-${String(i - 31).padStart(2, "0")}`;
      nutrition = rolloverNutrition(nutrition, planned, key);
      nutrition = { ...nutrition, calories: { ...nutrition.calories, current: 2000 } };
    }
    expect(nutrition.history).toHaveLength(30);
    expect(nutrition.history[0].date > nutrition.history[29].date).toBe(true);
  });
});

describe("weekly calories and score", () => {
  const now = new Date(2026, 10, 13, 12);

  it("returns 7 days ending today", () => {
    const nutrition = {
      ...day("2026-11-13", 900),
      history: seedNutritionHistory(
        [
          { calories: 2100 },
          { calories: 2000 },
          { calories: 2200 },
          { calories: 1900 },
          { calories: 2300 },
          { calories: 2150 },
        ],
        2200,
        now,
      ),
    };
    const week = getWeekCalories(nutrition, now);
    expect(week).toHaveLength(7);
    expect(week[6]).toMatchObject({ isToday: true, value: 900 });
    expect(week[0].value).toBeGreaterThan(0);
  });

  it("scores on-target days near 100 and is null without data", () => {
    expect(getNutritionScore({ ...day("2026-11-13", 0), history: [] }, now)).toBeNull();
    const onTarget = { ...day("2026-11-13", 2200), protein: { current: 165, target: 165 } };
    expect(getNutritionScore(onTarget, now)).toBe(100);
  });
});
