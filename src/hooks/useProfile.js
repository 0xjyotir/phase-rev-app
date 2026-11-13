/**
 * useProfile — the signed-in member's profile + actions already bound to them.
 *
 * Web equivalent: useUserProfile() in phaserev/src/hooks/use-member-access.ts
 *
 *   const { profile, actions } = useProfile();
 *   actions.addWater(0.25);
 *   actions.setMood("good");
 *
 * Why a hook? Screens never need to know the userId, and when the backend
 * lands only this file (and profile-store) change — every screen stays as-is.
 */
import { useMemo } from "react";
import { createDefaultProfile, useProfileStore } from "@/stores/profile-store";
import { useSessionStore } from "@/stores/session-store";

const FALLBACK_PROFILE = createDefaultProfile();

export function useProfile() {
  const userId = useSessionStore((state) => state.user?.id ?? null);
  const profile = useProfileStore((state) => (userId ? state.profiles[userId] : null));

  // Each action reads the store at call time, so the memo only depends on userId.
  const actions = useMemo(() => {
    const run = (action, ...args) => {
      if (!userId) return;
      useProfileStore.getState()[action](userId, ...args);
    };
    return {
      saveAssessment: (assessment) => run("saveAssessment", assessment),
      toggleMealLogged: (mealId) => run("toggleMealLogged", mealId),
      addMealToLog: (meal) => run("addMealToLog", meal),
      addWater: (liters) => run("addWater", liters),
      setSelectedRegion: (regionId) => run("setSelectedRegion", regionId),
      setMood: (moodId, note) => run("setMood", moodId, note),
      logMindfulSession: (minutes) => run("logMindfulSession", minutes),
      resetProfile: () => run("resetProfile"),
    };
  }, [userId]);

  return { profile: profile ?? FALLBACK_PROFILE, actions };
}
