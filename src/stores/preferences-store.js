/**
 * Preferences store — device-level settings that are not tied to a user.
 *
 * Read by:  ThemeProvider (appearance), lib/haptics (haptics on/off)
 * Written:  Profile → Settings
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
    }),
    {
      name: STORAGE_KEYS.preferences,
      storage: persistStorage,
    },
  ),
);
