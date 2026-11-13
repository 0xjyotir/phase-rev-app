/**
 * Mind analytics — pure helpers for the Mental pillar (unit-tested).
 */
import { wellbeingCheck } from "@/constants/mental";
import { addDays, toDateKey } from "@/lib/dates";

/**
 * Wellbeing check score: answers are 0–5 per statement; the total is scaled
 * to 0–100 and mapped to a band (constants/mental.js → wellbeingCheck.bands).
 */
export function scoreWellbeing(answers, statements = wellbeingCheck.statements) {
  const values = statements.map((statement) => answers[statement.id]);
  if (values.some((value) => value == null)) return null;
  const max = statements.length * 5;
  const score = Math.round((values.reduce((sum, value) => sum + value, 0) / max) * 100);
  const band = wellbeingCheck.bands.find((item) => score >= item.min) ?? wellbeingCheck.bands.at(-1);
  return { score, band };
}

/**
 * Mindful streak: consecutive days (ending today, or yesterday if today has
 * no activity yet) with a mood check-in, a journal entry or a mind session.
 */
export function getMindStreak({ moodEntries = [], journalEntries = [], sessionLog = [], now = new Date() }) {
  const active = new Set([
    ...moodEntries.map((entry) => entry.date),
    ...journalEntries.map((entry) => toDateKey(entry.createdAt)),
    ...sessionLog.map((entry) => entry.date),
  ]);
  let cursor = new Date(now);
  if (!active.has(toDateKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (active.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
