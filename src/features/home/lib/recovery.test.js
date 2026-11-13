import { getRecoveryScore } from "./recovery";

const HOUR = 60 * 60 * 1000;
const now = new Date(2026, 10, 13, 18).getTime();
const entry = (hoursAgo, volumeKg = 5000) => ({
  performedAt: new Date(now - hoursAgo * HOUR).toISOString(),
  volumeKg,
});

describe("getRecoveryScore", () => {
  it("returns no score without history", () => {
    expect(getRecoveryScore({ history: [], now }).score).toBeNull();
  });

  it("rewards rest time", () => {
    const fresh = getRecoveryScore({ history: [entry(2), entry(50), entry(74)], now }).score;
    const rested = getRecoveryScore({ history: [entry(40), entry(90), entry(120)], now }).score;
    expect(rested).toBeGreaterThan(fresh);
  });

  it("penalises an unusually heavy last session and back-to-back days", () => {
    const normal = getRecoveryScore({ history: [entry(20, 5000), entry(70, 5000)], now }).score;
    const heavy = getRecoveryScore({ history: [entry(20, 9000), entry(40, 5000)], now }).score;
    expect(heavy).toBeLessThan(normal);
  });

  it("factors in mood and stays within 0–100", () => {
    const great = getRecoveryScore({ history: [entry(48)], moodId: "great", now });
    const stressed = getRecoveryScore({ history: [entry(48)], moodId: "stressed", now });
    expect(great.score).toBeGreaterThan(stressed.score);
    expect(great.score).toBeLessThanOrEqual(100);
    expect(stressed.score).toBeGreaterThanOrEqual(0);
  });
});
