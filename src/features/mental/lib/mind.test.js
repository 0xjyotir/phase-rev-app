import { getMindStreak, scoreWellbeing } from "./mind";

describe("scoreWellbeing", () => {
  const statements = [{ id: "a" }, { id: "b" }];

  it("returns null until every statement is answered", () => {
    expect(scoreWellbeing({ a: 3 }, statements)).toBeNull();
  });

  it("scales to 0–100 and picks a band", () => {
    expect(scoreWellbeing({ a: 5, b: 5 }, statements)).toMatchObject({ score: 100 });
    expect(scoreWellbeing({ a: 5, b: 5 }, statements).band.label).toBe("Thriving");
    expect(scoreWellbeing({ a: 0, b: 1 }, statements).band.label).toBe("Take care");
  });
});

describe("getMindStreak", () => {
  const now = new Date(2026, 10, 13, 10);

  it("counts consecutive active days across moods, journal and sessions", () => {
    const streak = getMindStreak({
      moodEntries: [{ date: "2026-11-13" }, { date: "2026-11-12" }],
      journalEntries: [{ createdAt: new Date(2026, 10, 11, 21).toISOString() }],
      sessionLog: [{ date: "2026-11-10" }],
      now,
    });
    expect(streak).toBe(4);
  });

  it("doesn't break when today has no activity yet", () => {
    expect(getMindStreak({ moodEntries: [{ date: "2026-11-12" }], now })).toBe(1);
  });

  it("is zero after a gap", () => {
    expect(getMindStreak({ moodEntries: [{ date: "2026-11-10" }], now })).toBe(0);
  });
});
