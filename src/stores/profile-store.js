/**
 * Profile store — per-member data for Fuel, Mind and the assessment.
 *
 * Web equivalent: phaserev/src/stores/user-data-store.ts (same idea: one
 * profile object per userId, persisted on device until the API exists).
 *
 * Shape: profiles[userId] = UserProfile  (see types/models.js)
 *
 * Backend mapping (FRONTEND_BACKEND_INTEGRATION.md §7):
 *   saveAssessment     → PUT   /users/me/assessment
 *   setMood            → POST  /users/me/mood
 *   toggleMealLogged   → PATCH /users/me/nutrition
 *   addWater           → PATCH /users/me/nutrition
 *   setSelectedRegion  → PATCH /users/me/nutrition/region
 *
 * Components don't call these directly with a userId — use hooks/useProfile.js,
 * which binds the signed-in user for you.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_USER } from "@/constants/demo-account";
import { defaultMealLog, defaultNutrition } from "@/constants/nutrition";
import { DEFAULT_REGION_ID } from "@/constants/nutrition-regions";
import { addDays, formatTimeOfDay, toDateKey } from "@/lib/dates";
import { createId } from "@/lib/id";
import { STORAGE_KEYS, persistStorage } from "./storage";

/** @returns {import("@/types/models").UserProfile} */
export function createDefaultProfile() {
  return {
    assessment: null,
    nutrition: {
      date: toDateKey(),
      calories: { ...defaultNutrition.calories },
      protein: { ...defaultNutrition.protein },
      carbs: { ...defaultNutrition.carbs },
      fat: { ...defaultNutrition.fat },
      hydration: { ...defaultNutrition.hydration },
      mealLog: defaultMealLog.map((entry) => ({ ...entry })),
      selectedRegionId: DEFAULT_REGION_ID,
    },
    mood: { entries: [] },
    mind: { breathingSessions: 0, mindfulMinutes: 0 },
  };
}

/** Richer seed for the demo member so every screen has realistic data on first launch. */
function createDemoProfile() {
  const base = createDefaultProfile();
  const pastMoods = ["good", "great", "okay", "good", "stressed", "good"];
  return {
    ...base,
    assessment: {
      unitSystem: "metric",
      heightCm: 175,
      weightKg: 76,
      age: 28,
      targetWeightKg: 72,
      goalId: "recompose",
      activityId: "moderate",
      bmi: 24.8,
      completedAt: new Date().toISOString(),
    },
    mood: {
      entries: pastMoods.map((moodId, index) => ({
        date: toDateKey(addDays(new Date(), -(pastMoods.length - index))),
        moodId,
      })),
    },
    mind: { breathingSessions: 9, mindfulMinutes: 74 },
  };
}

/** Immutable update helper: applies `updater(profile)` to one user's profile. */
function updateProfile(state, userId, updater) {
  const current = state.profiles[userId] ?? createDefaultProfile();
  return { profiles: { ...state.profiles, [userId]: updater(current) } };
}

/** Adds (sign = 1) or removes (sign = -1) a meal's macros from today's totals. */
function applyMealMacros(nutrition, meal, sign) {
  const add = (macro, amount = 0) => ({
    ...macro,
    current: Math.max(0, Math.round(macro.current + sign * amount)),
  });
  return {
    ...nutrition,
    calories: add(nutrition.calories, meal.calories),
    protein: add(nutrition.protein, meal.protein),
    carbs: add(nutrition.carbs, meal.carbs),
    fat: add(nutrition.fat, meal.fat),
  };
}

export const useProfileStore = create(
  persist(
    (set, get) => ({
      /** @type {Record<string, import("@/types/models").UserProfile>} */
      profiles: {},

      /** Creates the profile on first sign-in (demo member gets seeded data). */
      ensureProfile: (userId) => {
        if (get().profiles[userId]) return;
        const profile = userId === DEMO_USER.id ? createDemoProfile() : createDefaultProfile();
        set((state) => ({ profiles: { ...state.profiles, [userId]: profile } }));
      },

      // ── Assessment ────────────────────────────────────────────────────────
      saveAssessment: (userId, assessment) =>
        set((state) => updateProfile(state, userId, (p) => ({ ...p, assessment }))),

      // ── Nutrition ─────────────────────────────────────────────────────────
      toggleMealLogged: (userId, mealId) =>
        set((state) =>
          updateProfile(state, userId, (p) => {
            const meal = p.nutrition.mealLog.find((entry) => entry.id === mealId);
            if (!meal) return p;
            const logged = !meal.logged;
            const nutrition = applyMealMacros(p.nutrition, meal, logged ? 1 : -1);
            nutrition.mealLog = p.nutrition.mealLog.map((entry) =>
              entry.id === mealId
                ? { ...entry, logged, time: logged ? formatTimeOfDay() : entry.time }
                : entry,
            );
            return { ...p, nutrition };
          }),
        ),

      /** Adds a catalog meal (meal plan / regional meal) to today's log as eaten. */
      addMealToLog: (userId, meal) =>
        set((state) =>
          updateProfile(state, userId, (p) => {
            const entry = {
              id: createId("meal"),
              meal: meal.title,
              time: formatTimeOfDay(),
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              logged: true,
            };
            const nutrition = applyMealMacros(p.nutrition, entry, 1);
            nutrition.mealLog = [...p.nutrition.mealLog, entry];
            return { ...p, nutrition };
          }),
        ),

      addWater: (userId, liters) =>
        set((state) =>
          updateProfile(state, userId, (p) => {
            const hydration = p.nutrition.hydration;
            const current = Math.max(0, Math.round((hydration.current + liters) * 100) / 100);
            return { ...p, nutrition: { ...p.nutrition, hydration: { ...hydration, current } } };
          }),
        ),

      setSelectedRegion: (userId, regionId) =>
        set((state) =>
          updateProfile(state, userId, (p) => ({
            ...p,
            nutrition: { ...p.nutrition, selectedRegionId: regionId },
          })),
        ),

      // ── Mind ──────────────────────────────────────────────────────────────
      /** One mood per day — logging again today replaces today's entry. */
      setMood: (userId, moodId, note) =>
        set((state) =>
          updateProfile(state, userId, (p) => {
            const today = toDateKey();
            const others = p.mood.entries.filter((entry) => entry.date !== today);
            return { ...p, mood: { entries: [...others, { date: today, moodId, note }] } };
          }),
        ),

      logMindfulSession: (userId, minutes) =>
        set((state) =>
          updateProfile(state, userId, (p) => ({
            ...p,
            mind: {
              breathingSessions: p.mind.breathingSessions + 1,
              mindfulMinutes: p.mind.mindfulMinutes + minutes,
            },
          })),
        ),

      // ── Maintenance ───────────────────────────────────────────────────────
      resetProfile: (userId) =>
        set((state) => {
          const next = { ...state.profiles };
          delete next[userId];
          return { profiles: next };
        }),
    }),
    {
      name: STORAGE_KEYS.profiles,
      storage: persistStorage,
    },
  ),
);
