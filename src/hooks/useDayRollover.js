/**
 * useDayRollover — starts a fresh nutrition day after midnight.
 *
 * Runs when the app launches and every time it returns to the foreground, so a
 * member who opens Phase Rev in the morning sees today's plan, not yesterday's
 * totals. Yesterday is archived into nutrition history (weekly chart, score).
 */
import { useEffect } from "react";
import { AppState } from "react-native";
import { useProfileStore } from "@/stores/profile-store";
import { useSessionStore } from "@/stores/session-store";

export function useDayRollover() {
  const userId = useSessionStore((state) => state.user?.id ?? null);

  useEffect(() => {
    if (!userId) return undefined;
    const run = () => useProfileStore.getState().rolloverDay(userId);
    run();
    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") run();
    });
    return () => subscription.remove();
  }, [userId]);
}
