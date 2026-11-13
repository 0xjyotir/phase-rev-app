/**
 * Persistent storage adapter shared by every Zustand store.
 *
 * Web app equivalent: zustand `persist` + localStorage.
 * Mobile: the same `persist` middleware, backed by AsyncStorage.
 *
 * Keys are namespaced with `phaserev.` so they are easy to find/clear.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage } from "zustand/middleware";

export const persistStorage = createJSONStorage(() => AsyncStorage);

/** All persisted store keys — handy for "reset demo data" and debugging. */
export const STORAGE_KEYS = {
  session: "phaserev.session",
  profiles: "phaserev.profiles",
  training: "phaserev.training",
  preferences: "phaserev.preferences",
};

/** Wipes every Phase Rev key from device storage. Used by Profile → Reset demo data. */
export async function clearAllPersistedData() {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
