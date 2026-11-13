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
import { createDefaultProfile, useProfileStore, withProfileDefaults } from "@/stores/profile-store";
import { useSessionStore } from "@/stores/session-store";

const FALLBACK_PROFILE = createDefaultProfile();

const ACTIONS = [
  "saveAssessment",
  "toggleMealLogged",
  "addMealToLog",
  "removeMeal",
  "addWater",
  "setSelectedRegion",
  "setMood",
  "logMindfulSession",
  "addJournalEntry",
  "deleteJournalEntry",
  "saveReframe",
  "saveWellbeingCheck",
  "saveReactionResult",
  "requestCoach",
  "rolloverDay",
  "resetProfile",
];

export function useProfile() {
  const userId = useSessionStore((state) => state.user?.id ?? null);
  const stored = useProfileStore((state) => (userId ? state.profiles[userId] : null));
  const profile = useMemo(() => withProfileDefaults(stored) ?? FALLBACK_PROFILE, [stored]);

  // Each action reads the store at call time, so the memo only depends on userId.
  const actions = useMemo(() => {
    const bound = {};
    for (const name of ACTIONS) {
      bound[name] = (...args) => {
        if (!userId) return;
        useProfileStore.getState()[name](userId, ...args);
      };
    }
    return bound;
  }, [userId]);

  return { profile, actions, isMember: Boolean(userId) };
}
