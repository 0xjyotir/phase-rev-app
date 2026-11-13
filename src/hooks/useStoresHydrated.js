/**
 * useStoresHydrated — true once every persisted Zustand store has finished
 * loading from AsyncStorage.
 *
 * AsyncStorage is asynchronous, so on cold start the stores briefly hold
 * their default values. The root layout keeps the splash screen up until this
 * returns true — otherwise a signed-in user would flash the Welcome screen.
 *
 * Implemented with useSyncExternalStore: React subscribes to each store's
 * "finished hydrating" event and re-reads `allHydrated()` when it fires.
 */
import { useSyncExternalStore } from "react";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useProfileStore } from "@/stores/profile-store";
import { useSessionStore } from "@/stores/session-store";
import { useTrainingStore } from "@/stores/training-store";

const PERSISTED_STORES = [useSessionStore, useProfileStore, useTrainingStore, usePreferencesStore];

const allHydrated = () => PERSISTED_STORES.every((store) => store.persist.hasHydrated());

function subscribe(onChange) {
  const unsubscribers = PERSISTED_STORES.map((store) => store.persist.onFinishHydration(onChange));
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export function useStoresHydrated() {
  return useSyncExternalStore(subscribe, allHydrated, allHydrated);
}
