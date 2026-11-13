/**
 * Streaks, week schedule, PRs and volume trends. Run with: npm test
 */
import { addDays, startOfDay } from "@/lib/dates";
import {
  getPersonalRecords,
  getStreak,
  getVolumeSeries,
  getWeekSchedule,
} from "./training-analytics";

// Fixed "today": Wednesday 4 Nov 2026, 18:00 local time.
const NOW = new Date(2026, 10, 4, 18, 0, 0);
const weekPlan = { 0: null, 1: "rt-a", 2: "rt-b", 3: "rt-a", 4: null, 5: "rt-a", 6: null };
const routines = [
  { id: "rt-a", name: "A" },
  { id: "rt-b", name: "B" },
];

function entry(daysAgo, { volumeKg = 1000, sets = [{ weight: 50, reps: 10 }] } = {}) {
  const performedAt = addDays(startOfDay(NOW), -daysAgo);
  performedAt.setHours(8);
  return {
    id: `h-${daysAgo}`,
    routineId: "rt-a",
    name: "A",
    performedAt: performedAt.toISOString(),
    durationMin: 45,
    sets: sets.length,
    volumeKg,
    prs: 0,
    exercises: [{ exerciseId: "barbell-bench-press", sets }],
  };
}

describe("getStreak", () => {
  it("counts trained days and planned rest days, ignoring today until trained", () => {
    // Tue (1 ago) trained, Mon (2 ago) trained, Sun (3 ago) rest day, Sat (4 ago) rest, Fri (5 ago) trained.
    const history = [entry(1), entry(2), entry(5)];
    expect(getStreak({ history, weekPlan, now: NOW })).toBe(5);
  });

  it("breaks on a skipped training day", () => {
    // Mon (2 ago) skipped
    const history = [entry(1), entry(5)];
    expect(getStreak({ history, weekPlan, now: NOW })).toBe(1);
  });
});

describe("getWeekSchedule", () => {
  it("marks completed, missed, today, rest and upcoming days", () => {
    const history = [entry(2)]; // Monday done, Tuesday missed
    const days = getWeekSchedule({ history, weekPlan, routines, now: NOW });
    expect(days.map((d) => d.status)).toEqual([
      "completed", // Mon
      "missed", // Tue
      "today", // Wed
      "rest", // Thu
      "upcoming", // Fri
      "rest", // Sat
      "rest", // Sun
    ]);
  });
});

describe("getPersonalRecords", () => {
  it("keeps the best set per exercise", () => {
    const history = [
      entry(1, { sets: [{ weight: 60, reps: 5 }] }),
      entry(3, { sets: [{ weight: 55, reps: 12 }] }), // e1RM 77 beats 60×5 = 70
    ];
    const [record] = getPersonalRecords(history);
    expect(record).toMatchObject({
      exerciseId: "barbell-bench-press",
      display: "55 kg × 12",
      e1rm: 77,
    });
  });
});

describe("getVolumeSeries", () => {
  it("returns rolling 7-day windows for 30D, newest last", () => {
    const history = [entry(1, { volumeKg: 500 }), entry(8, { volumeKg: 300 })];
    const series = getVolumeSeries(history, "30D", NOW);
    expect(series).toHaveLength(4);
    expect(series[3]).toEqual({ label: "Now", value: 500 });
    expect(series[2].value).toBe(300);
  });
});
