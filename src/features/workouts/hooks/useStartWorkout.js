/**
 * useStartWorkout — one function for every "Start workout" button.
 *
 *   const startWorkout = useStartWorkout();
 *   startWorkout();            // today's routine
 *   startWorkout("rt-pull");   // a specific routine
 *
 * If a session is already running it simply re-opens it instead of
 * overwriting it (you can't accidentally lose logged sets).
 */
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { haptics } from "@/lib/haptics";
import { useTrainingStore } from "@/stores/training-store";

export function useStartWorkout() {
  const router = useRouter();

  return useCallback(
    (routineId) => {
      const store = useTrainingStore.getState();
      if (!store.activeSession) {
        const started = store.startWorkout(routineId);
        if (!started) return;
        haptics.success();
      }
      router.push("/workout/active");
    },
    [router],
  );
}
