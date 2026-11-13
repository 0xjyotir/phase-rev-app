/**
 * Unit tests for the pure training math. Run with: npm test
 */
import {
  estimateOneRepMax,
  formatSet,
  getBestSet,
  getLoadIncrement,
  getSetFeedback,
  parseRepRange,
  totalVolume,
} from "./workout-math";

describe("parseRepRange", () => {
  it("parses rep ranges", () => {
    expect(parseRepRange("6–8")).toEqual({ min: 6, max: 8, unit: "reps" });
  });

  it("parses hold ranges in seconds", () => {
    expect(parseRepRange("30–45 SEC")).toEqual({ min: 30, max: 45, unit: "sec" });
  });

  it("treats a single number as min = max", () => {
    expect(parseRepRange("12")).toEqual({ min: 12, max: 12, unit: "reps" });
  });
});

describe("volume and strength", () => {
  it("sums weight × reps and ignores holds", () => {
    expect(
      totalVolume([{ weight: 80, reps: 8 }, { weight: 80, reps: 6 }, { holdSeconds: 30 }]),
    ).toBe(1120);
  });

  it("estimates 1RM with the Epley formula", () => {
    expect(estimateOneRepMax(100, 5)).toBe(116.7);
    expect(estimateOneRepMax(100, 1)).toBe(100);
    expect(estimateOneRepMax(0, 10)).toBeNull();
  });

  it("picks the strongest set by estimated 1RM, not by raw weight", () => {
    // e1RM: 80×8 → 101.3 · 85×5 → 99.2 · 75×10 → 100
    const best = getBestSet([
      { weight: 80, reps: 8 },
      { weight: 85, reps: 5 },
      { weight: 75, reps: 10 },
    ]);
    expect(best).toEqual({ weight: 80, reps: 8 });
  });

  it("uses equipment-specific load increments", () => {
    expect(getLoadIncrement("incline-dumbbell-press")).toBe(2);
    expect(getLoadIncrement("leg-press")).toBe(5);
    expect(getLoadIncrement("barbell-bench-press")).toBe(2.5);
  });

  it("formats sets for display", () => {
    expect(formatSet({ weight: 82.5, reps: 6 })).toBe("82.5 kg × 6");
    expect(formatSet({ weight: 0, reps: 12 })).toBe("BW × 12");
    expect(formatSet({ holdSeconds: 40 })).toBe("40s");
  });
});

describe("getSetFeedback", () => {
  const base = { completed: true, previousWeight: 80, previousReps: 7, targetWeight: 82.5 };

  it("returns nothing for incomplete sets", () => {
    expect(getSetFeedback({ ...base, completed: false, weight: 90, reps: 8 })).toBeNull();
  });

  it("celebrates hitting the target weight", () => {
    expect(getSetFeedback({ ...base, weight: 82.5, reps: 6 })).toEqual({
      label: "Target hit · +2.5 kg",
      tone: "success",
    });
  });

  it("notices a rep PR at the same weight", () => {
    expect(getSetFeedback({ ...base, targetWeight: undefined, weight: 80, reps: 9 })).toEqual({
      label: "+2 reps vs last",
      tone: "success",
    });
  });
});
