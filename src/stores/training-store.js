/**
 * Training store — the heart of the workout tracker.
 *
 * Web equivalent: phaserev/src/stores/physical-training-store.ts
 *
 * What lives here (all persisted to AsyncStorage):
 *   routines         Reusable plans (Push A, Pull A…)
 *   weekPlan         weekday → routineId (which routine is "today")
 *   todayOverride    "Apply routine as today" for the current date only
 *   history          Finished workouts, newest first
 *   activeSession    The live workout (survives app restarts mid-session!)
 *   rest             Rest timer, stored as timestamps so it keeps counting in background
 *   lastSummary      The most recent "Session complete" summary
 *   favorites, body  Library favorites + body-weight log
 *
 * What does NOT live here:
 *   - Derived numbers (PRs, streaks, charts) → features/workouts/lib/training-analytics.js
 *   - UI state (which card is expanded, modals) → component state / routes
 *
 * Loop: Plan → Train → Log → Analyze → Progress → Adapt
 *   startWorkout → updateSet / completeSet (+rest timer) → finishWorkout → history
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  generateSeedBodyWeights,
  generateSeedHistory,
  generateSeedPhotos,
  seedFavoriteExerciseIds,
  seedMeasurements,
  seedRoutines,
  seedWeekPlan,
} from "@/constants/training-seed";
import { getExerciseById } from "@/constants/exercises";
import { buildSessionPlan, summarizeSession } from "@/features/workouts/lib/session-plan";
import { getStreak } from "@/features/workouts/lib/training-analytics";
import { getSetFeedback, parseRepRange } from "@/features/workouts/lib/workout-math";
import { toDateKey } from "@/lib/dates";
import { createId } from "@/lib/id";
import { STORAGE_KEYS, persistStorage } from "./storage";

const EMPTY_REST = { endsAt: null, pausedRemaining: null, totalSeconds: 0 };

function createInitialTrainingState(now = new Date()) {
  return {
    routines: seedRoutines,
    weekPlan: seedWeekPlan,
    todayOverride: null,
    history: generateSeedHistory(now),
    favoriteExerciseIds: seedFavoriteExerciseIds,
    activeSession: null,
    rest: EMPTY_REST,
    lastSummary: null,
    bodyWeights: generateSeedBodyWeights(now),
    measurements: seedMeasurements,
    photos: generateSeedPhotos(now),
  };
}

// ─── Selectors (pure — safe to call anywhere) ───────────────────────────────

/** The routine planned for today (respects "apply as today"), or null on a rest day. */
export function selectTodayRoutine(state, now = new Date()) {
  const override = state.todayOverride;
  const routineId =
    override && override.dateKey === toDateKey(now)
      ? override.routineId
      : state.weekPlan[now.getDay()];
  return state.routines.find((routine) => routine.id === routineId) ?? null;
}

/** Seconds left on the rest timer (0 when idle). */
export function selectRestRemaining(rest, nowMs = Date.now()) {
  if (rest.pausedRemaining != null) return rest.pausedRemaining;
  if (!rest.endsAt) return 0;
  return Math.max(0, Math.ceil((rest.endsAt - nowMs) / 1000));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns a copy of the session with one set patched. */
function patchSet(session, sessionExerciseId, setIndex, patch) {
  return {
    ...session,
    exercises: session.exercises.map((exercise) =>
      exercise.id !== sessionExerciseId
        ? exercise
        : {
            ...exercise,
            sets: exercise.sets.map((set, i) => (i === setIndex ? { ...set, ...patch } : set)),
          },
    ),
  };
}

/** When a set is ticked without typing anything, fill in the sensible defaults. */
function getCompletionDefaults(exercise, set) {
  const meta = getExerciseById(exercise.exerciseId);
  const range = parseRepRange(exercise.repRange);

  if (range.unit === "sec") {
    return { holdSeconds: set.holdSeconds ?? set.targetHoldSeconds ?? range.min };
  }
  return {
    weight:
      meta?.trackingMode === "reps"
        ? 0
        : (set.weight ?? set.targetWeight ?? set.previousWeight ?? 0),
    reps: set.reps ?? set.previousReps ?? range.min,
  };
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useTrainingStore = create(
  persist(
    (set, get) => ({
      ...createInitialTrainingState(),

      // ── Planning ──────────────────────────────────────────────────────────

      /** "Apply as today's workout" from Library → Routines. */
      applyRoutineAsToday: (routineId) =>
        set({ todayOverride: { dateKey: toDateKey(), routineId } }),

      clearTodayOverride: () => set({ todayOverride: null }),

      // ── Live session ──────────────────────────────────────────────────────

      /** Starts a session from `routineId` (defaults to today's routine). */
      startWorkout: (routineId) => {
        const state = get();
        const routine = routineId
          ? state.routines.find((r) => r.id === routineId)
          : selectTodayRoutine(state);
        if (!routine) return false;

        const session = buildSessionPlan(routine, state.history);
        set({
          activeSession: {
            session,
            startedAt: Date.now(),
            currentExerciseId: session.exercises[0]?.id ?? null,
          },
          rest: EMPTY_REST,
          lastSummary: null,
        });
        return true;
      },

      /** Edits weight / reps / hold / RIR for one set while training. */
      updateSet: (sessionExerciseId, setIndex, patch) =>
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              session: patchSet(state.activeSession.session, sessionExerciseId, setIndex, patch),
            },
          };
        }),

      /**
       * Ticks (or un-ticks) a set. Completing a set:
       *   1. fills empty fields with target/previous values,
       *   2. starts the rest timer for that exercise,
       *   3. moves focus to the next exercise once all its sets are done.
       * @returns {{ completed: boolean, feedback: {label: string, tone: string} | null }}
       */
      completeSet: (sessionExerciseId, setIndex) => {
        const { activeSession } = get();
        if (!activeSession) return { completed: false, feedback: null };

        const exercises = activeSession.session.exercises;
        const exerciseIndex = exercises.findIndex((e) => e.id === sessionExerciseId);
        const exercise = exercises[exerciseIndex];
        const current = exercise?.sets[setIndex];
        if (!current) return { completed: false, feedback: null };

        const completed = !current.completed;
        const patch = completed
          ? { ...getCompletionDefaults(exercise, current), completed: true }
          : { completed: false };

        const session = patchSet(activeSession.session, sessionExerciseId, setIndex, patch);
        const updatedExercise = session.exercises[exerciseIndex];
        const exerciseDone = updatedExercise.sets.every((s) => s.completed);
        const nextExercise = session.exercises[exerciseIndex + 1];

        set({
          activeSession: {
            ...activeSession,
            session,
            currentExerciseId:
              completed && exerciseDone && nextExercise
                ? nextExercise.id
                : activeSession.currentExerciseId,
          },
        });

        if (completed) get().startRest(exercise.restSeconds);

        return {
          completed,
          feedback: completed ? getSetFeedback({ ...current, ...patch }) : null,
        };
      },

      /** Adds one more set to an exercise (copies the last set's targets). */
      addSet: (sessionExerciseId) =>
        set((state) => {
          if (!state.activeSession) return state;
          const session = state.activeSession.session;
          return {
            activeSession: {
              ...state.activeSession,
              session: {
                ...session,
                exercises: session.exercises.map((exercise) => {
                  if (exercise.id !== sessionExerciseId) return exercise;
                  const last = exercise.sets[exercise.sets.length - 1];
                  const extra = {
                    ...last,
                    setNumber: exercise.sets.length + 1,
                    weight: undefined,
                    reps: undefined,
                    holdSeconds: undefined,
                    rir: undefined,
                    completed: false,
                  };
                  return { ...exercise, sets: [...exercise.sets, extra] };
                }),
              },
            },
          };
        }),

      setCurrentExercise: (sessionExerciseId) =>
        set((state) =>
          state.activeSession
            ? { activeSession: { ...state.activeSession, currentExerciseId: sessionExerciseId } }
            : state,
        ),

      /** Ends the session, writes it to history and returns the summary. */
      finishWorkout: () => {
        const state = get();
        if (!state.activeSession) return null;

        const id = createId("h");
        const { session, startedAt } = state.activeSession;
        // Streak includes today's session, so compute it with the new entry in place.
        const provisional = [{ performedAt: new Date(startedAt).toISOString() }, ...state.history];
        const streak = getStreak({ history: provisional, weekPlan: state.weekPlan });

        const { historyEntry, summary } = summarizeSession(session, {
          id,
          startedAt,
          endedAt: Date.now(),
          history: state.history,
          streak,
        });

        set({
          history: historyEntry.sets > 0 ? [historyEntry, ...state.history] : state.history,
          activeSession: null,
          rest: EMPTY_REST,
          lastSummary: summary,
          todayOverride: null,
        });
        return summary;
      },

      /** Throws the live session away without saving. */
      discardWorkout: () => set({ activeSession: null, rest: EMPTY_REST }),

      dismissSummary: () => set({ lastSummary: null }),

      // ── Rest timer (timestamp based) ──────────────────────────────────────

      startRest: (seconds) =>
        set({
          rest: {
            endsAt: Date.now() + seconds * 1000,
            pausedRemaining: null,
            totalSeconds: seconds,
          },
        }),

      adjustRest: (deltaSeconds) =>
        set((state) => {
          const remaining = Math.max(0, selectRestRemaining(state.rest) + deltaSeconds);
          const totalSeconds = Math.max(state.rest.totalSeconds + deltaSeconds, remaining);
          if (state.rest.pausedRemaining != null) {
            return { rest: { ...state.rest, pausedRemaining: remaining, totalSeconds } };
          }
          return {
            rest: { endsAt: Date.now() + remaining * 1000, pausedRemaining: null, totalSeconds },
          };
        }),

      toggleRestPause: () =>
        set((state) => {
          const { rest } = state;
          if (rest.pausedRemaining != null) {
            return {
              rest: {
                ...rest,
                endsAt: Date.now() + rest.pausedRemaining * 1000,
                pausedRemaining: null,
              },
            };
          }
          return { rest: { ...rest, pausedRemaining: selectRestRemaining(rest), endsAt: null } };
        }),

      skipRest: () => set({ rest: EMPTY_REST }),

      // ── Library & routines ────────────────────────────────────────────────

      toggleFavorite: (exerciseId) =>
        set((state) => ({
          favoriteExerciseIds: state.favoriteExerciseIds.includes(exerciseId)
            ? state.favoriteExerciseIds.filter((id) => id !== exerciseId)
            : [...state.favoriteExerciseIds, exerciseId],
        })),

      /** Creates or replaces a routine (matched by id). */
      saveRoutine: (routine) =>
        set((state) => ({
          routines: [routine, ...state.routines.filter((r) => r.id !== routine.id)],
        })),

      deleteRoutine: (routineId) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== routineId),
          weekPlan: Object.fromEntries(
            Object.entries(state.weekPlan).map(([day, id]) => [day, id === routineId ? null : id]),
          ),
          todayOverride: state.todayOverride?.routineId === routineId ? null : state.todayOverride,
        })),

      // ── Body ──────────────────────────────────────────────────────────────

      logBodyWeight: (weightKg) =>
        set((state) => {
          const todayKey = toDateKey();
          const others = state.bodyWeights.filter((entry) => toDateKey(entry.date) !== todayKey);
          return { bodyWeights: [...others, { date: new Date().toISOString(), weightKg }] };
        }),

      /** Saves a progress photo (local file URI from the photo library or camera). */
      addProgressPhoto: ({ uri, angle = "Front" }) =>
        set((state) => ({
          photos: [
            { id: createId("photo"), date: new Date().toISOString(), angle, uri },
            ...state.photos,
          ].slice(0, 60),
        })),

      removeProgressPhoto: (photoId) =>
        set((state) => ({ photos: state.photos.filter((photo) => photo.id !== photoId) })),

      // ── Maintenance ───────────────────────────────────────────────────────

      /** Regenerates the demo history (Profile → Reset demo data). */
      resetTraining: () => set(createInitialTrainingState()),
    }),
    {
      name: STORAGE_KEYS.training,
      storage: persistStorage,
      version: 1,
    },
  ),
);
