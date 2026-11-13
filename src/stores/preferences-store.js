/**
 * Preferences store — device-level settings that are not tied to a user.
 *
 * Read by:  ThemeProvider + AppearanceSync (appearance), lib/haptics (haptics),
 *           RestTimerBar (rest step)
 * Written:  Profile → Appearance / Workout
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, persistStorage } from "./storage";

/** @typedef {"system" | "light" | "dark"} Appearance */

export const usePreferencesStore = create(
  persist(
    (set) => ({
      /** @type {Appearance} */
      appearance: "system",
      hapticsEnabled: true,
      /** Seconds subtracted/added by the rest timer −/+ buttons. */
      restStepSeconds: 30,

      setAppearance: (appearance) => set({ appearance }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setRestStepSeconds: (restStepSeconds) => set({ restStepSeconds }),
    }),
    {
      name: STORAGE_KEYS.preferences,
      storage: persistStorage,
    },
  ),
);
