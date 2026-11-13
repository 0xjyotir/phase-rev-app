import { MAX_DELAY_MS, MIN_DELAY_MS, nextDelay, rateReaction, summarizeRound } from "./reaction";

describe("reaction drill", () => {
  it("keeps the random delay inside the window", () => {
    expect(nextDelay(() => 0)).toBe(MIN_DELAY_MS);
    expect(nextDelay(() => 1)).toBe(MAX_DELAY_MS);
  });

  it("summarises a round", () => {
    expect(summarizeRound([300, 250, 200, 350, 260])).toMatchObject({
      average: 272,
      median: 260,
      best: 200,
    });
    expect(summarizeRound([])).toBeNull();
  });

  it("rates averages into bands", () => {
    expect(rateReaction(200).label).toBe("Elite");
    expect(rateReaction(250).label).toBe("Sharp");
    expect(rateReaction(300).label).toBe("Solid");
    expect(rateReaction(400).label).toBe("Warming up");
  });
});
