/**
 * Recovery estimate (0–100) for the Home "Recovery" card.
 *
 * Web: the Rev overview shows a "Recovery 78%" card (sample data). Here it is
 * computed from what the member actually logged, with deliberately simple,
 * explainable rules — a readiness hint, not a medical measure:
 *
 *   start at 80
 *   + up to 12  for hours since the last session (full credit at 36 h)
 *   − up to 18  when the last session's volume was well above the recent average
 *   − 8         for two or more sessions in the last 48 h
 *   ± mood      today's check-in: great +6 · good +3 · okay 0 · low −6 · stressed −10
 */
const HOUR = 60 * 60 * 1000;
const MOOD_EFFECT = { great: 6, good: 3, okay: 0, low: -6, stressed: -10 };

export function getRecoveryScore({ history, moodId = null, now = Date.now() }) {
  if (!history?.length) {
    return { score: null, label: "No data yet", factors: [] };
  }

  const [last, ...earlier] = history;
  const hoursSince = Math.max(0, (now - new Date(last.performedAt).getTime()) / HOUR);
  const factors = [];
  let score = 80;

  const restCredit = Math.round(Math.min(1, hoursSince / 36) * 12);
  score += restCredit;
  factors.push({ id: "rest", label: `${Math.round(hoursSince)} h since last session`, delta: restCredit });

  const recent = earlier.slice(0, 6).filter((entry) => entry.volumeKg > 0);
  if (recent.length && last.volumeKg > 0) {
    const average = recent.reduce((sum, entry) => sum + entry.volumeKg, 0) / recent.length;
    const ratio = last.volumeKg / average;
    if (ratio > 1.1) {
      const load = -Math.round(Math.min(18, (ratio - 1.1) * 60));
      score += load;
      factors.push({ id: "load", label: "Heavier than usual last session", delta: load });
    }
  }

  const within48 = history.filter((entry) => now - new Date(entry.performedAt).getTime() < 48 * HOUR);
  if (within48.length >= 2) {
    score -= 8;
    factors.push({ id: "density", label: "Two sessions in 48 h", delta: -8 });
  }

  if (moodId && MOOD_EFFECT[moodId] != null) {
    score += MOOD_EFFECT[moodId];
    factors.push({ id: "mood", label: "Today's mood check-in", delta: MOOD_EFFECT[moodId] });
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const label = score >= 85 ? "Primed" : score >= 70 ? "Ready" : score >= 55 ? "Moderate" : "Take it easy";
  return { score, label, factors };
}
