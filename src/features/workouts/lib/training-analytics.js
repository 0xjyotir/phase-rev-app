/**
 * Training analytics — everything on Train → Progress is computed here from
 * the workout history. Pure functions: (history, …) in → plain data out.
 *
 * Answers the questions from CLIENT-TRAINING-SYSTEM-OVERVIEW.md:
 *   "Am I getting stronger?"  → getExerciseProgress, getPersonalRecords
 *   "How consistent am I?"    → getStreak, getConsistency, getWeekSchedule
 *   "Which muscles am I neglecting?" → getMuscleDistribution
 *   "What should I do next?"  → getInsights
 */
import { getExerciseById } from "@/constants/exercises";
import {
  addDays,
  formatMonthYear,
  formatShortDate,
  startOfDay,
  startOfWeek,
  toDateKey,
  WEEKDAY_SHORT,
} from "@/lib/dates";
import { estimateOneRepMax, formatSet, getBestSet, setScore } from "./workout-math";

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Map of "YYYY-MM-DD" → history entries on that day. */
function groupByDay(history) {
  const map = new Map();
  for (const entry of history) {
    const key = toDateKey(entry.performedAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  }
  return map;
}

function entriesSince(history, days, now = new Date()) {
  const cutoff = addDays(startOfDay(now), -days + 1);
  return history.filter((entry) => new Date(entry.performedAt) >= cutoff);
}

// ─── Week & streak ─────────────────────────────────────────────────────────

/**
 * The 7-day strip (Mon → Sun) used on Home and Train → Progress.
 * @returns {{ key: string, label: string, routineName: string | null,
 *             status: "completed" | "today" | "upcoming" | "rest" | "missed" }[]}
 */
export function getWeekSchedule({ history, weekPlan, routines, now = new Date() }) {
  const byDay = groupByDay(history);
  const todayKey = toDateKey(now);
  const monday = startOfWeek(now);

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    const key = toDateKey(date);
    const routineId = weekPlan[date.getDay()];
    const routine = routines.find((r) => r.id === routineId) ?? null;
    const trained = byDay.get(key);

    let status;
    if (trained) status = "completed";
    else if (key === todayKey) status = routine ? "today" : "rest";
    else if (!routine) status = "rest";
    else status = key < todayKey ? "missed" : "upcoming";

    return {
      key,
      label: WEEKDAY_SHORT[date.getDay()],
      routineName: trained?.[0]?.name ?? routine?.name ?? null,
      status,
    };
  });
}

/**
 * Consecutive-day streak. A day "counts" if you trained OR it was a planned
 * rest day — so rest days don't break the streak, skipped sessions do.
 * Today only counts once you've trained (it never breaks the streak).
 */
export function getStreak({ history, weekPlan, now = new Date() }) {
  if (!history.length) return 0;

  const trainedDays = new Set(history.map((entry) => toDateKey(entry.performedAt)));
  // Never walk past the first day we have data for — otherwise rest days count forever.
  const firstDay = startOfDay(history[history.length - 1].performedAt);
  let cursor = startOfDay(now);
  let streak = 0;

  if (!trainedDays.has(toDateKey(cursor))) cursor = addDays(cursor, -1);

  while (cursor >= firstDay) {
    const trained = trainedDays.has(toDateKey(cursor));
    const isRestDay = !weekPlan[cursor.getDay()];
    if (!trained && !isRestDay) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

// ─── Totals & trends ───────────────────────────────────────────────────────

/** Totals for the last `days` days (or all time when days is null). */
export function getTrainingTotals(history, { days = null, now = new Date() } = {}) {
  const entries = days ? entriesSince(history, days, now) : history;
  return entries.reduce(
    (totals, entry) => ({
      workouts: totals.workouts + 1,
      sets: totals.sets + entry.sets,
      volumeKg: totals.volumeKg + entry.volumeKg,
      minutes: totals.minutes + entry.durationMin,
      prs: totals.prs + (entry.prs ?? 0),
    }),
    { workouts: 0, sets: 0, volumeKg: 0, minutes: 0, prs: 0 },
  );
}

/** This calendar week (Mon → today). */
export function getThisWeekTotals(history, now = new Date()) {
  const monday = startOfWeek(now);
  const entries = history.filter((entry) => new Date(entry.performedAt) >= monday);
  return getTrainingTotals(entries);
}

export const VOLUME_RANGES = ["7D", "30D", "90D"];

/**
 * Volume series for the trend chart, using ROLLING windows that end today
 * (so the last point is never an unfinished week/month that looks like a drop).
 *   7D  → 7 points, one per day
 *   30D → 4 points, each a 7-day window
 *   90D → 3 points, each a 30-day window
 * @returns {{ label: string, value: number }[]} oldest → newest
 */
export function getVolumeSeries(history, range, now = new Date()) {
  const byDay = groupByDay(history);
  const today = startOfDay(now);
  const dayVolume = (date) =>
    (byDay.get(toDateKey(date)) ?? []).reduce((sum, entry) => sum + entry.volumeKg, 0);

  /** Sum of `length` days ending `endOffset` days before today. */
  const windowVolume = (endOffset, length) => {
    let value = 0;
    for (let d = 0; d < length; d += 1) value += dayVolume(addDays(today, -(endOffset + d)));
    return value;
  };

  if (range === "7D") {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(today, i - 6);
      return { label: WEEKDAY_SHORT[date.getDay()], value: dayVolume(date) };
    });
  }

  const { points, days } = range === "30D" ? { points: 4, days: 7 } : { points: 3, days: 30 };
  return Array.from({ length: points }, (_, i) => {
    const endOffset = (points - 1 - i) * days;
    const label = endOffset === 0 ? "Now" : formatShortDate(addDays(today, -endOffset));
    return { label, value: windowVolume(endOffset, days) };
  });
}

// ─── Muscles ───────────────────────────────────────────────────────────────

const MUSCLE_LABELS = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  arms: "Arms",
  legs: "Legs",
  core: "Core",
  skills: "Skills",
};

/** Share of completed sets per muscle group over the last `days` days. */
export function getMuscleDistribution(history, { days = 30, now = new Date() } = {}) {
  const counts = {};
  let total = 0;

  for (const entry of entriesSince(history, days, now)) {
    for (const exercise of entry.exercises) {
      const group = getExerciseById(exercise.exerciseId)?.muscleGroup ?? "other";
      counts[group] = (counts[group] ?? 0) + exercise.sets.length;
      total += exercise.sets.length;
    }
  }

  return Object.entries(counts)
    .map(([group, sets]) => ({
      id: group,
      muscle: MUSCLE_LABELS[group] ?? group,
      sets,
      percent: total ? Math.round((sets / total) * 100) : 0,
    }))
    .sort((a, b) => b.sets - a.sets);
}

// ─── Personal records ──────────────────────────────────────────────────────

/**
 * Best set ever per exercise.
 * @returns {{ exerciseId, exerciseName, display, e1rm, date, mode }[]} newest PR first
 */
export function getPersonalRecords(history) {
  const best = new Map();

  // Walk oldest → newest so a later equal score doesn't replace the original date.
  for (const entry of [...history].reverse()) {
    for (const exercise of entry.exercises) {
      const top = getBestSet(exercise.sets);
      if (!top) continue;
      const score = setScore(top);
      const current = best.get(exercise.exerciseId);
      if (!current || score > current.score) {
        best.set(exercise.exerciseId, { set: top, score, date: entry.performedAt });
      }
    }
  }

  return [...best.entries()]
    .map(([exerciseId, record]) => {
      const meta = getExerciseById(exerciseId);
      return {
        exerciseId,
        exerciseName: meta?.name ?? exerciseId,
        mode: meta?.mode ?? "gym",
        display: formatSet(record.set),
        e1rm: estimateOneRepMax(record.set.weight, record.set.reps),
        date: record.date,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/** Best-set score per session for one exercise — drives the strength chart. */
export function getExerciseProgress(history, exerciseId, limit = 8) {
  const points = [];
  for (const entry of history) {
    const match = entry.exercises.find((e) => e.exerciseId === exerciseId);
    if (!match) continue;
    const top = getBestSet(match.sets);
    if (!top) continue;
    points.push({
      label: formatShortDate(entry.performedAt),
      value: top.holdSeconds ?? estimateOneRepMax(top.weight, top.reps) ?? top.reps ?? 0,
    });
    if (points.length >= limit) break;
  }
  return points.reverse();
}

// ─── Consistency calendar ──────────────────────────────────────────────────

/**
 * Month heatmap. Level = how much work was done that day (completed sets, so
 * gym and calisthenics days compare fairly):
 *   0 rest · 1 light (< 10 sets) · 2 solid (10–15) · 3 big (16+)
 */
export function getConsistency({ history, weekPlan, now = new Date() }) {
  const byDay = groupByDay(history);
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = toDateKey(now);

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    const key = toDateKey(date);
    const entries = byDay.get(key) ?? [];
    const sets = entries.reduce((sum, e) => sum + e.sets, 0);
    let level = 0;
    if (entries.length) level = sets >= 16 ? 3 : sets >= 10 ? 2 : 1;
    return { key, dayOfMonth: i + 1, weekday: date.getDay(), level, isToday: key === todayKey };
  });

  return {
    monthLabel: formatMonthYear(now),
    days,
    workoutsThisMonth: days.filter((d) => d.level > 0).length,
    currentStreak: getStreak({ history, weekPlan, now }),
    bestStreak: getBestStreak({ history, weekPlan }),
  };
}

/** Longest streak anywhere in history (same counting rules as getStreak). */
function getBestStreak({ history, weekPlan }) {
  if (!history.length) return 0;
  const trainedDays = new Set(history.map((entry) => toDateKey(entry.performedAt)));
  const oldest = startOfDay(history[history.length - 1].performedAt);
  const newest = startOfDay(history[0].performedAt);

  let best = 0;
  let run = 0;
  for (let cursor = oldest; cursor <= newest; cursor = addDays(cursor, 1)) {
    const counts = trainedDays.has(toDateKey(cursor)) || !weekPlan[cursor.getDay()];
    run = counts ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

// ─── Insights ──────────────────────────────────────────────────────────────

/**
 * Rule-based insights ("structured from training patterns and designed so a
 * real AI layer can plug in later"). Swap this function for an API call later.
 *
 * @returns {{ id: string, kind: "progression"|"balance"|"recovery"|"pr"|"recommendation",
 *             title: string, body: string }[]}
 */
export function getInsights(history, now = new Date()) {
  const insights = [];
  const last28 = entriesSince(history, 28, now);

  // 1. Progression — strongest-trending main lift
  const benchTrend = getExerciseProgress(history, "barbell-bench-press", 6);
  if (benchTrend.length >= 2) {
    const first = benchTrend[0].value;
    const last = benchTrend[benchTrend.length - 1].value;
    const change = first ? Math.round(((last - first) / first) * 100) : 0;
    insights.push({
      id: "progression",
      kind: "progression",
      title: "Progression",
      body:
        change > 0
          ? `Bench press estimated 1RM is up ${change}% across your last ${benchTrend.length} sessions.`
          : "Bench press has plateaued — consider a lighter week, then re-test.",
    });
  }

  // 2. Balance — push vs pull sets
  let push = 0;
  let pull = 0;
  for (const entry of last28) {
    for (const exercise of entry.exercises) {
      const tags = getExerciseById(exercise.exerciseId)?.tags ?? [];
      if (tags.includes("push")) push += exercise.sets.length;
      if (tags.includes("pull")) pull += exercise.sets.length;
    }
  }
  if (push > 0) {
    const gap = Math.round(((push - pull) / push) * 100);
    insights.push({
      id: "balance",
      kind: "balance",
      title: "Balance",
      body:
        gap > 15
          ? `Your pulling volume is ${gap}% below your pushing volume this month.`
          : "Push and pull volume are well balanced this month.",
    });
  }

  // 3. Load — last three sessions
  const lastThree = history.slice(0, 3).map((entry) => entry.volumeKg);
  if (lastThree.length === 3) {
    const rising = lastThree[0] >= lastThree[1] && lastThree[1] >= lastThree[2];
    insights.push({
      id: "load",
      kind: "recovery",
      title: "Load",
      body: rising
        ? "Your last three sessions have increased total volume progressively."
        : "Session volume is varying — that's fine, keep your key lifts progressing.",
    });
  }

  // 4. PRs this month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prsThisMonth = history
    .filter((entry) => new Date(entry.performedAt) >= monthStart)
    .reduce((sum, entry) => sum + (entry.prs ?? 0), 0);
  insights.push({
    id: "prs",
    kind: "pr",
    title: "Personal records",
    body:
      prsThisMonth > 0
        ? `You set ${prsThisMonth} new personal record${prsThisMonth > 1 ? "s" : ""} this month.`
        : "No PRs yet this month — today's targets are set to change that.",
  });

  // 5. Recommendation
  insights.push({
    id: "next",
    kind: "recommendation",
    title: "Next session",
    body:
      pull < push * 0.85
        ? "Add 2 sets of rows or pull-ups to your next pull day to close the gap."
        : "Consider adding one back-off set to your bench press next session.",
  });

  return insights;
}
