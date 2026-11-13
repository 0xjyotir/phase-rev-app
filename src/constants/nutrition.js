/**
 * Nutrition content + default targets.
 *
 * Web sources:
 *   phaserev/src/constants/dashboard.ts      → nutritionSummary (default macro targets)
 *   phaserev/src/constants/nutrition-page.ts → meal plans, meal log, weekly trend, expert
 *
 * Per-user values (current macros, water, meal log) are copied from here into
 * profile-store when a profile is first created, then updated by the user.
 */

/** Default daily targets. `current` = demo values already eaten today. */
export const defaultNutrition = {
  calories: { current: 1840, target: 2200 },
  protein: { current: 142, target: 165 },
  carbs: { current: 198, target: 240 },
  fat: { current: 58, target: 72 },
  hydration: { current: 2.1, target: 3.0, unit: "L" },
};

/** Water quick-add amounts (litres). */
export const WATER_STEPS = [0.25, 0.5];

/** Today's planned meals. `logged: false` = planned but not eaten yet. */
export const defaultMealLog = [
  {
    id: "1",
    meal: "Morning Metabolic Bowl",
    time: "7:42 AM",
    calories: 420,
    protein: 28,
    carbs: 35,
    fat: 16,
    logged: true,
  },
  {
    id: "2",
    meal: "Pre-Workout Fuel",
    time: "11:15 AM",
    calories: 280,
    protein: 12,
    carbs: 38,
    fat: 8,
    logged: true,
  },
  {
    id: "3",
    meal: "High Protein Bowl",
    time: "1:30 PM",
    calories: 620,
    protein: 45,
    carbs: 52,
    fat: 18,
    logged: true,
  },
  {
    id: "4",
    meal: "Recovery Dinner",
    time: "Evening",
    calories: 540,
    protein: 38,
    carbs: 42,
    fat: 22,
    logged: false,
  },
];

export const mealPeriods = [
  { id: "all", label: "All" },
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snacks" },
];

export const mealPlans = [
  {
    id: "breakfast-1",
    title: "Morning Metabolic Bowl",
    period: "breakfast",
    calories: 420,
    protein: 28,
    carbs: 35,
    fat: 16,
    cuisine: "Continental",
    prepTime: "12 min",
    description:
      "Greek yogurt, berries, granola, and almond butter — steady energy without the crash.",
    tags: ["High protein", "Quick prep"],
  },
  {
    id: "breakfast-2",
    title: "South Indian Protein Plate",
    period: "breakfast",
    calories: 380,
    protein: 24,
    carbs: 42,
    fat: 12,
    cuisine: "South Asian",
    prepTime: "15 min",
    description:
      "Idli with sambar, coconut chutney, and a side of spiced eggs for balanced morning fuel.",
    tags: ["Regional", "Balanced"],
  },
  {
    id: "lunch-1",
    title: "High Protein Bowl",
    period: "lunch",
    calories: 620,
    protein: 45,
    carbs: 52,
    fat: 18,
    cuisine: "Mediterranean",
    prepTime: "20 min",
    description:
      "Grilled chicken, quinoa, roasted vegetables, and tahini — the post-training standard.",
    tags: ["Post-workout", "High protein"],
  },
  {
    id: "lunch-2",
    title: "Japanese Macro Box",
    period: "lunch",
    calories: 540,
    protein: 38,
    carbs: 48,
    fat: 14,
    cuisine: "East Asian",
    prepTime: "18 min",
    description:
      "Salmon, steamed rice, edamame, and pickled vegetables — clean, complete, satisfying.",
    tags: ["Omega-3", "Clean eating"],
  },
  {
    id: "dinner-1",
    title: "Recovery Dinner",
    period: "dinner",
    calories: 540,
    protein: 38,
    carbs: 42,
    fat: 22,
    cuisine: "Indian",
    prepTime: "25 min",
    description:
      "Dal, grilled paneer tikka, brown rice, and raita — recovery-focused evening nutrition.",
    tags: ["Recovery", "Vegetarian option"],
  },
  {
    id: "dinner-2",
    title: "Lean Protein & Greens",
    period: "dinner",
    calories: 480,
    protein: 42,
    carbs: 28,
    fat: 20,
    cuisine: "Western",
    prepTime: "22 min",
    description:
      "Grass-fed steak, roasted asparagus, and sweet potato — low-carb evening protocol.",
    tags: ["Low carb", "High protein"],
  },
  {
    id: "snack-1",
    title: "Pre-Workout Fuel",
    period: "snack",
    calories: 280,
    protein: 12,
    carbs: 38,
    fat: 8,
    cuisine: "Universal",
    prepTime: "5 min",
    description: "Banana, peanut butter, and rice cakes — fast carbs 45 minutes before training.",
    tags: ["Pre-workout", "5 min"],
  },
  {
    id: "snack-2",
    title: "Post-Session Shake",
    period: "snack",
    calories: 320,
    protein: 32,
    carbs: 24,
    fat: 10,
    cuisine: "Universal",
    prepTime: "3 min",
    description: "Whey isolate, oat milk, and frozen berries — recovery window optimized.",
    tags: ["Post-workout", "Quick"],
  },
];

export const weeklyCalorieTrend = [
  { day: "Mon", calories: 2100, target: 2200 },
  { day: "Tue", calories: 1980, target: 2200 },
  { day: "Wed", calories: 2250, target: 2200 },
  { day: "Thu", calories: 1840, target: 2200 },
  { day: "Fri", calories: 2150, target: 2200 },
  { day: "Sat", calories: 2320, target: 2200 },
  { day: "Sun", calories: 2050, target: 2200 },
];

export const nutritionExpert = {
  name: "Dr. Rahul Nair",
  role: "Lead Nutritionist",
  credentials: ["PhD Nutrition", "ISSN-CISSN", "RD"],
  bio: "Clinical nutritionist crafting precision meal protocols for athletes and members at every level.",
  sessions: 1200,
  rating: 4.88,
};
