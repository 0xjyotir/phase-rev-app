/**
 * Progressive-overload planning + session summary. Run with: npm test
 */
import { buildSessionPlan, getSessionProgress, summarizeSession } from "./session-plan";

const benchRoutine = {
  id: "rt-test",
  name: "Test · Push",
  description: "Bench only",
  mode: "gym",
  daysPerWeek: 1,
  exercises: [{ exerciseId: "barbell-bench-press", sets: 3, repRange: "6–8", restSeconds: 150 }],
};

const historyAt = (sets, daysAgo = 3) => [
  {
    id: "h-1",
    routineId: "rt-test",
    name: "Test · Push",
    performedAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    durationMin: 50,
    sets: sets.length,
    volumeKg: sets.reduce((sum, s) => sum + s.weight * s.reps, 0),
    prs: 0,
    exercises: [{ exerciseId: "barbell-bench-press", sets }],
  },
];

describe("buildSessionPlan", () => {
  it("adds load when the first set reached the top of the range", () => {
    const plan = buildSessionPlan(
      benchRoutine,
      historyAt([
        { weight: 80, reps: 8 },
        { weight: 80, reps: 7 },
      ]),
    );
    const [first, second, third] = plan.exercises[0].sets;
    expect(first).toMatchObject({ previousWeight: 80, previousReps: 8, targetWeight: 82.5 });
    expect(second).toMatchObject({ previousWeight: 80, previousReps: 7 });
    // Fewer sets last time → later sets compare against the last logged one.
    expect(third.previousReps).toBe(7);
  });

  it("keeps the weight (beat the reps) when the top wasn't reached", () => {
    const plan = buildSessionPlan(benchRoutine, historyAt([{ weight: 80, reps: 6 }]));
    expect(plan.exercises[0].sets[0].targetWeight).toBe(80);
  });

  it("has no previous/target for a brand-new exercise", () => {
    const plan = buildSessionPlan(benchRoutine, []);
    expect(plan.exercises[0].sets[0].previousWeight).toBeUndefined();
    expect(plan.exercises[0].sets[0].targetWeight).toBeUndefined();
  });
});

describe("summarizeSession", () => {
  it("saves only completed sets and detects a PR", () => {
    const history = historyAt([{ weight: 80, reps: 8 }]);
    const session = buildSessionPlan(benchRoutine, history);
    session.exercises[0].sets[0] = {
      ...session.exercises[0].sets[0],
      weight: 82.5,
      reps: 8,
      completed: true,
    };
    session.exercises[0].sets[1] = {
      ...session.exercises[0].sets[1],
      weight: 82.5,
      reps: 7,
      completed: true,
    };

    expect(getSessionProgress(session)).toEqual({ completedSets: 2, totalSets: 3, volumeKg: 1238 });

    const startedAt = Date.now() - 45 * 60000;
    const { historyEntry, summary } = summarizeSession(session, {
      id: "h-new",
      startedAt,
      endedAt: Date.now(),
      history,
      streak: 4,
    });

    expect(historyEntry.exercises[0].sets).toHaveLength(2);
    expect(summary).toMatchObject({
      historyId: "h-new",
      sets: 2,
      prs: 1,
      durationMin: 45,
      streak: 4,
    });
    expect(summary.volumeDeltaPercent).toBe(93); // 1238 kg vs 640 kg last time
  });
});
