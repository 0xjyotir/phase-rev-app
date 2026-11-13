/**
 * Profile store — per-member data for Fuel, Mind, Athletic tools, coaching and
 * the baseline assessment.
 *
 * Web equivalent: phaserev/src/stores/user-data-store.ts (same idea: one
 * profile object per userId, persisted on device until the API exists).
 *
 * Shape: profiles[userId] = UserProfile  (see types/models.js)
 *
 * Backend mapping (FRONTEND_BACKEND_INTEGRATION.md §7, plus new endpoints):
 *   saveAssessment       → PUT   /users/me/assessment
 *   setMood              → POST  /users/me/mood
 *   toggleMealLogged …   → PATCH /users/me/nutrition
 *   setSelectedRegion    → PATCH /users/me/nutrition/region
 *   addJournalEntry      → POST  /users/me/journal            (new)
 *   saveReframe          → POST  /users/me/reframes           (new)
 *   saveWellbeingCheck   → POST  /users/me/wellbeing          (new)
 *   saveReactionResult   → POST  /users/me/athletic/reaction  (new)
 *   requestCoach         → POST  /coaching/requests           (new)
 *
 * Components don't call these with a userId — use hooks/useProfile.js, which
 * binds the signed-in member for you.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_USER } from "@/constants/demo-account";
import { defaultMealLog, defaultNutrition, weeklyCalorieTrend } from "@/constants/nutrition";
import { DEFAULT_REGION_ID } from "@/constants/nutrition-regions";
import { rolloverNutrition, seedNutritionHistory } from "@/features/nutrition/lib/nutrition-day";
import { addDays, formatTimeOfDay, toDateKey } from "@/lib/dates";
import { createId } from "@/lib/id";
import { STORAGE_KEYS, persistStorage } from "./storage";

const MAX_LIST = 200;

/** @returns {import("@/types/models").UserProfile} */
export function createDefaultProfile() {
  return {
    assessment: null,
    nutrition: {
      date: toDateKey(),
      calories: { ...defaultNutrition.calories, current: 0 },
      protein: { ...defaultNutrition.protein, current: 0 },
      carbs: { ...defaultNutrition.carbs, current: 0 },
      fat: { ...defaultNutrition.fat, current: 0 },
      hydration: { ...defaultNutrition.hydration, current: 0 },
      mealLog: defaultMealLog.map((entry) => ({ ...entry, logged: false, time: "Planned" })),
      selectedRegionId: DEFAULT_REGION_ID,
      history: [],
    },
    mood: { entries: [] },
    mind: { breathingSessions: 0, mindfulMinutes: 0, log: [] },
    journal: { entries: [] },
    reframes: [],
    wellbeing: { checks: [] },
    athletic: { reactionResults: [] },
    coaching: { requests: [] },
  };
}

/** Richer seed for the demo member so every screen has realistic data on first launch. */
function createDemoProfile(now = new Date()) {
  const base = createDefaultProfile();
  const pastMoods = ["good", "great", "okay", "good", "stressed", "good"];
  const daysAgo = (n, hour = 21) => {
    const date = addDays(now, -n);
    date.setHours(hour, 10, 0, 0);
    return date.toISOString();
  };

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
      completedAt: now.toISOString(),
    },
    nutrition: {
      ...base.nutrition,
      // The website's demo day: three meals eaten, dinner planned.
      calories: { ...defaultNutrition.calories },
      protein: { ...defaultNutrition.protein },
      carbs: { ...defaultNutrition.carbs },
      fat: { ...defaultNutrition.fat },
      hydration: { ...defaultNutrition.hydration },
      mealLog: defaultMealLog.map((entry) => ({ ...entry })),
      history: seedNutritionHistory(weeklyCalorieTrend, defaultNutrition.calories.target, now),
    },
    mood: {
      entries: pastMoods.map((moodId, index) => ({
        date: toDateKey(addDays(now, -(pastMoods.length - index))),
        moodId,
      })),
    },
    mind: {
      breathingSessions: 9,
      mindfulMinutes: 74,
      log: [1, 2, 4].map((n) => ({
        date: toDateKey(addDays(now, -n)),
        minutes: 5,
        kind: "breathing",
      })),
    },
    journal: {
      entries: [
        {
          id: "j-seed-1",
          createdAt: daysAgo(1),
          title: "Evening reflection",
          answers: [
            {
              prompt: "What went well today?",
              text: "Hit every rep on pull day. Deadlift felt fast.",
            },
            {
              prompt: "What will you do differently tomorrow?",
              text: "Go to bed before 11 — mornings are better when I do.",
            },
          ],
        },
      ],
    },
    wellbeing: {
      checks: [{ id: "w-seed-1", createdAt: daysAgo(9, 9), score: 68, answers: {} }],
    },
    athletic: {
      reactionResults: [
        { id: "r-seed-1", createdAt: daysAgo(3, 18), average: 284, best: 241, median: 279 },
      ],
    },
  };
}

/** Fills fields added in later app versions, so older saved profiles keep working. */
export function withProfileDefaults(profile) {
  if (!profile) return profile;
  const defaults = createDefaultProfile();
  return {
    ...defaults,
    ...profile,
    nutrition: {
      ...defaults.nutrition,
      ...profile.nutrition,
      history: profile.nutrition?.history ?? [],
    },
    mind: { ...defaults.mind, ...profile.mind, log: profile.mind?.log ?? [] },
    journal: profile.journal ?? defaults.journal,
    reframes: profile.reframes ?? defaults.reframes,
    wellbeing: profile.wellbeing ?? defaults.wellbeing,
    athletic: profile.athletic ?? defaults.athletic,
    coaching: profile.coaching ?? defaults.coaching,
  };
}

/** Immutable update helper: applies `updater(profile)` to one member's profile. */
function updateProfile(state, userId, updater) {
  const current = withProfileDefaults(state.profiles[userId]) ?? createDefaultProfile();
  return { profiles: { ...state.profiles, [userId]: updater(current) } };
}

/** Today's nutrition, rolled over to a fresh day if the date changed. */
function today(nutrition) {
  return rolloverNutrition(nutrition, defaultMealLog);
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

      /** Starts a fresh nutrition day after midnight (called on launch and on focus). */
      rolloverDay: (userId) => {
        const profile = get().profiles[userId];
        if (!profile || profile.nutrition?.date === toDateKey()) return;
        set((state) =>
          updateProfile(state, userId, (p) => ({ ...p, nutrition: today(p.nutrition) })),
        );
      },

      // ── Assessment ────────────────────────────────────────────────────────
      saveAssessment: (userId, assessment) =>
        set((state) => updateProfile(state, userId, (p) => ({ ...p, assessment }))),

      // ── Nutrition ─────────────────────────────────────────────────────────
      toggleMealLogged: (userId, mealId) =>
        set((state) =>
          updateProfile(state, userId, (p) => {
            const current = today(p.nutrition);
            const meal = current.mealLog.find((entry) => entry.id === mealId);
            if (!meal) return p;
            const logged = !meal.logged;
            const nutrition = applyMealMacros(current, meal, logged ? 1 : -1);
            nutrition.mealLog = current.mealLog.map((entry) =>
              entry.id === mealId
                ? { ...entry, logged, time: logged ? formatTimeOfDay() : "Planned" }
                : entry,
            );
            return { ...p, nutrition };
          }),
        ),

      /** Adds a meal (catalog meal or a quick custom entry) to today's log as eaten. */
      addMealToLog: (userId, meal) =>
        set((state) =>
          updateProfile(state, userId, (p) => {
            const current = today(p.nutrition);
            const entry = {
              id: createId("meal"),
              meal: meal.title,
              time: formatTimeOfDay(),
              calories: Math.round(meal.calories ?? 0),
              protein: Math.round(meal.protein ?? 0),
              carbs: Math.round(meal.carbs ?? 0),
              fat: Math.round(meal.fat ?? 0),
              logged: true,
              custom: true,
            };
            const nutrition = applyMealMacros(current, entry, 1);
            nutrition.mealLog = [...current.mealLog, entry];
            return { ...p, nutrition };
          }),
        ),

      /** Removes a meal from today's log (and its macros, if it was eaten). */
      removeMeal: (userId, mealId) =>
        set((state) =>
          updateProfile(state, userId, (p) => {
            const current = today(p.nutrition);
            const meal = current.mealLog.find((entry) => entry.id === mealId);
            if (!meal) return p;
            const nutrition = meal.logged ? applyMealMacros(current, meal, -1) : { ...current };
            nutrition.mealLog = current.mealLog.filter((entry) => entry.id !== mealId);
            return { ...p, nutrition };
          }),
        ),

      addWater: (userId, liters) =>
        set((state) =>
          updateProfile(state, userId, (p) => {
            const current = today(p.nutrition);
            const hydration = current.hydration;
            const value = Math.max(0, Math.round((hydration.current + liters) * 100) / 100);
            return { ...p, nutrition: { ...current, hydration: { ...hydration, current: value } } };
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
            const todayKey = toDateKey();
            const others = p.mood.entries.filter((entry) => entry.date !== todayKey);
            return { ...p, mood: { entries: [...others, { date: todayKey, moodId, note }] } };
          }),
        ),

      /** Logs a finished mind session (breathing, meditation, visualization…). */
      logMindfulSession: (userId, minutes, kind = "breathing") =>
        set((state) =>
          updateProfile(state, userId, (p) => ({
            ...p,
            mind: {
              breathingSessions: p.mind.breathingSessions + 1,
              mindfulMinutes: p.mind.mindfulMinutes + minutes,
              log: [{ date: toDateKey(), minutes, kind }, ...(p.mind.log ?? [])].slice(0, MAX_LIST),
            },
          })),
        ),

      addJournalEntry: (userId, entry) =>
        set((state) =>
          updateProfile(state, userId, (p) => ({
            ...p,
            journal: {
              entries: [
                { id: createId("j"), createdAt: new Date().toISOString(), ...entry },
                ...p.journal.entries,
              ].slice(0, MAX_LIST),
            },
          })),
        ),

      deleteJournalEntry: (userId, entryId) =>
        set((state) =>
          updateProfile(state, userId, (p) => ({
            ...p,
            journal: { entries: p.journal.entries.filter((entry) => entry.id !== entryId) },
          })),
        ),

      saveReframe: (userId, reframe) =>
        set((state) =>
          updateProfile(state, userId, (p) => ({
            ...p,
            reframes: [
              { id: createId("cbt"), createdAt: new Date().toISOString(), ...reframe },
              ...p.reframes,
            ].slice(0, MAX_LIST),
          })),
        ),

      saveWellbeingCheck: (userId, check) =>
        set((state) =>
          updateProfile(state, userId, (p) => ({
            ...p,
            wellbeing: {
              checks: [
                { id: createId("w"), createdAt: new Date().toISOString(), ...check },
                ...p.wellbeing.checks,
              ].slice(0, MAX_LIST),
            },
          })),
        ),

      // ── Athletic ──────────────────────────────────────────────────────────
      saveReactionResult: (userId, result) =>
        set((state) =>
          updateProfile(state, userId, (p) => ({
            ...p,
            athletic: {
              reactionResults: [
                { id: createId("r"), createdAt: new Date().toISOString(), ...result },
                ...p.athletic.reactionResults,
              ].slice(0, MAX_LIST),
            },
          })),
        ),

      // ── Coaching ──────────────────────────────────────────────────────────
      requestCoach: (userId, request) =>
        set((state) =>
          updateProfile(state, userId, (p) => ({
            ...p,
            coaching: {
              requests: [
                {
                  id: createId("req"),
                  createdAt: new Date().toISOString(),
                  status: "requested",
                  ...request,
                },
                ...p.coaching.requests,
              ].slice(0, MAX_LIST),
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
      version: 2,
      // v1 profiles lack journal/wellbeing/athletic/coaching/history — fill them in.
      migrate: (persisted) => {
        const profiles = Object.fromEntries(
          Object.entries(persisted?.profiles ?? {}).map(([id, profile]) => [
            id,
            withProfileDefaults(profile),
          ]),
        );
        return { ...persisted, profiles };
      },
    },
  ),
);
