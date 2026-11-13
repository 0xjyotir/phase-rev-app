/**
 * Mental wellness content.
 *
 * Web sources:
 *   phaserev/src/sections/mental/mood-tracker-section.tsx → moods + box breathing (4-2-4)
 *   phaserev/src/constants/pillars.ts                      → mentalSessions
 *
 * Mood IDs are stored per user per day (profile-store → mood) — keep them stable.
 */

/** `score` (1–5) powers the weekly mood chart. `icon` is a Feather icon name. */
export const moods = [
  { id: "great", label: "Great", score: 5, icon: "sun" },
  { id: "good", label: "Good", score: 4, icon: "smile" },
  { id: "okay", label: "Okay", score: 3, icon: "meh" },
  { id: "low", label: "Low", score: 2, icon: "cloud" },
  { id: "stressed", label: "Stressed", score: 1, icon: "cloud-lightning" },
];

export function getMoodById(moodId) {
  return moods.find((mood) => mood.id === moodId) ?? null;
}

/**
 * Breathing patterns. Each phase is { label, seconds, scale } where `scale`
 * is the size the breathing circle animates to during that phase.
 */
export const breathingPatterns = [
  {
    id: "phase-rev",
    name: "Reset breath",
    summary: "Inhale 4s · Hold 2s · Exhale 4s",
    description: "The Phase Rev default — a quick nervous-system reset between sets or meetings.",
    phases: [
      { label: "Inhale", seconds: 4, scale: 1 },
      { label: "Hold", seconds: 2, scale: 1 },
      { label: "Exhale", seconds: 4, scale: 0.6 },
    ],
  },
  {
    id: "box",
    name: "Box breathing",
    summary: "4 · 4 · 4 · 4",
    description: "Used by athletes before competition to steady focus under pressure.",
    phases: [
      { label: "Inhale", seconds: 4, scale: 1 },
      { label: "Hold", seconds: 4, scale: 1 },
      { label: "Exhale", seconds: 4, scale: 0.6 },
      { label: "Hold", seconds: 4, scale: 0.6 },
    ],
  },
  {
    id: "sleep",
    name: "Wind down",
    summary: "Inhale 4s · Hold 7s · Exhale 8s",
    description: "A longer exhale to downshift before sleep.",
    phases: [
      { label: "Inhale", seconds: 4, scale: 1 },
      { label: "Hold", seconds: 7, scale: 1 },
      { label: "Exhale", seconds: 8, scale: 0.6 },
    ],
  },
];

export function getBreathingPattern(patternId) {
  return breathingPatterns.find((p) => p.id === patternId) ?? breathingPatterns[0];
}

/** Guided session library (Mind tab). `patternId` links a session to the breathing player. */
export const mindSessions = [
  {
    id: "1",
    title: "Deep Focus",
    duration: "15 min",
    type: "Meditation",
    level: "Beginner",
    icon: "eye",
  },
  {
    id: "2",
    title: "Box Breathing",
    duration: "5 min",
    type: "Breathing",
    level: "All levels",
    icon: "wind",
    patternId: "box",
  },
  {
    id: "3",
    title: "Evening Reflection",
    duration: "10 min",
    type: "Journaling",
    level: "Intermediate",
    icon: "book-open",
  },
  {
    id: "4",
    title: "Anxiety Reset",
    duration: "12 min",
    type: "CBT activity",
    level: "All levels",
    icon: "refresh-cw",
    patternId: "phase-rev",
  },
];

/** Journaling prompts shown after a mood check-in. */
export const journalPrompts = [
  "What gave you energy today?",
  "What is one thing you can let go of?",
  "Where did you feel strongest today — body or mind?",
];
