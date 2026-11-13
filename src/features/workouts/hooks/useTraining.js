/**
 * Training hooks — read raw slices from training-store and memoize the
 * derived data screens need. Screens use these instead of touching the
 * store's internals.
 *
 *   const { routine, plan } = useTodayPlan();
 *   const week = useWeekSchedule();
 *   const streak = useStreak();
 *
 * Why not compute inside the store? Zustand selectors that return new objects
 * on every call cause extra renders. Selecting raw arrays + useMemo is cheap
 * and keeps all math in plain, testable functions (../lib).
 */
import { useMemo } from "react";
import { buildSessionPlan, getSessionProgress } from "@/features/workouts/lib/session-plan";
import { getStreak, getWeekSchedule } from "@/features/workouts/lib/training-analytics";
import { toDateKey } from "@/lib/dates";
import { selectTodayRoutine, useTrainingStore } from "@/stores/training-store";

/** Raw slices most hooks need. */
function useTrainingSlices() {
  const history = useTrainingStore((state) => state.history);
  const routines = useTrainingStore((state) => state.routines);
  const weekPlan = useTrainingStore((state) => state.weekPlan);
  const todayOverride = useTrainingStore((state) => state.todayOverride);
  return { history, routines, weekPlan, todayOverride };
}

/** Today's routine (or null on a rest day) + the planned session with targets. */
export function useTodayPlan() {
  const { history, routines, weekPlan, todayOverride } = useTrainingSlices();
  const todayKey = toDateKey();

  return useMemo(() => {
    const routine = selectTodayRoutine({ routines, weekPlan, todayOverride });
    const isOverride = todayOverride?.dateKey === todayKey;
    const trainedToday = history.some((entry) => toDateKey(entry.performedAt) === todayKey);
    return {
      routine,
      plan: routine ? buildSessionPlan(routine, history) : null,
      isOverride,
      trainedToday,
    };
  }, [history, routines, weekPlan, todayOverride, todayKey]);
}

/** Mon → Sun strip with completed/today/rest/upcoming status. */
export function useWeekSchedule() {
  const { history, routines, weekPlan } = useTrainingSlices();
  return useMemo(
    () => getWeekSchedule({ history, weekPlan, routines }),
    [history, weekPlan, routines],
  );
}

export function useStreak() {
  const { history, weekPlan } = useTrainingSlices();
  return useMemo(() => getStreak({ history, weekPlan }), [history, weekPlan]);
}

/** The live session (or null) plus set/volume progress for headers. */
export function useActiveSession() {
  const activeSession = useTrainingStore((state) => state.activeSession);
  const progress = useMemo(
    () => (activeSession ? getSessionProgress(activeSession.session) : null),
    [activeSession],
  );
  return { activeSession, progress };
}

export function useHistoryEntry(historyId) {
  return useTrainingStore((state) => state.history.find((entry) => entry.id === historyId) ?? null);
}

export function useRoutine(routineId) {
  return useTrainingStore(
    (state) => state.routines.find((routine) => routine.id === routineId) ?? null,
  );
}
