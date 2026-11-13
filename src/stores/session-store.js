/**
 * Session store — who is signed in.
 *
 * Web equivalent: phaserev/src/stores/session-store.ts
 *
 * Read by:  src/app/_layout.js (Stack.Protected guards), hooks/useMember.js
 * Written:  features/auth (sign in), Profile (sign out)
 *
 * When a real API exists, `accessToken` is filled by services/auth-service.js
 * and attached to every request by services/api-client.js.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, persistStorage } from "./storage";

export const useSessionStore = create(
  persist(
    (set) => ({
      /** @type {import("@/types/models").User | null} */
      user: null,
      /** @type {string | null} */
      accessToken: null,

      /** Call after a successful login. */
      setSession: ({ user, accessToken = null }) => set({ user, accessToken }),

      clearSession: () => set({ user: null, accessToken: null }),
    }),
    {
      name: STORAGE_KEYS.session,
      storage: persistStorage,
    },
  ),
);

/** Selector: true when a member is signed in. */
export const selectIsSignedIn = (state) => state.user !== null;
