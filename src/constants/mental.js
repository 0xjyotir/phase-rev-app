/**
 * Mental wellness content — every practice the website's Mental pillar lists:
 * meditation, breathing exercises, guided journaling, mood tracking, CBT
 * activities and wellbeing assessments.
 *
 * Web sources:
 *   phaserev/src/sections/mental/mood-tracker-section.tsx → moods + box breathing (4-2-4)
 *   phaserev/src/constants/pillars.ts                      → mentalSessions
 *   phaserev/src/app/(public)/mental-wellness/page.tsx     → page copy
 *
 * IDs (moods, sessions, scripts) are stored per user — keep them stable.
 */

/** `score` (1–5) powers the weekly mood chart. `icon` is an app icon key. */
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

export const mentalPageCopy = {
  sessionsTitle: "Sessions & practices",
  sessionsSubtitle: "Meditation, breathing, journaling, and CBT-inspired activities.",
  moodTitle: "Track how you feel",
  moodSubtitle: "Daily mood check-ins help surface patterns in your wellbeing.",
  // The website labels this card "Box breathing" but shows the 4-2-4 pattern;
  // in the app the 4-2-4 pattern is the "Reset breath" (true box breathing is 4-4-4-4).
  boxBreathing: { title: "Reset breath", summary: "4-2-4 pattern · 5 minutes" },
};

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

/**
 * Guided sessions (scripts). Played by app/session/[id].js — a calm, timed
 * sequence of prompts over a slowly breathing orb. Minutes are logged as
 * mindful minutes when the member finishes.
 */
export const guidedScripts = [
  {
    id: "deep-focus",
    title: "Deep Focus",
    type: "Meditation",
    level: "Beginner",
    summary: "Settle attention on the breath, then hold it there.",
    steps: [
      { seconds: 30, text: "Sit tall. Let your hands rest. Close your eyes or soften your gaze." },
      { seconds: 60, text: "Notice the breath moving in and out. Don't change it — just watch." },
      {
        seconds: 90,
        text: "Count each exhale, one to ten. When you reach ten, start again at one.",
      },
      { seconds: 120, text: "If you lose count, that's the practice. Notice, and return to one." },
      {
        seconds: 120,
        text: "Let the counting fall away. Rest attention on the feeling of breathing.",
      },
      {
        seconds: 150,
        text: "When a thought arrives, label it gently — “thinking” — and come back.",
      },
      {
        seconds: 150,
        text: "Widen your attention to the whole body breathing, from feet to crown.",
      },
      { seconds: 120, text: "Pick one intention for your next hour. Hold it for a few breaths." },
      {
        seconds: 60,
        text: "Take a deeper breath in. Let it go slowly. Open your eyes when ready.",
      },
    ],
  },
  {
    id: "pre-game-focus",
    title: "Pre-game focus",
    type: "Performance psychology",
    level: "All levels",
    summary: "Composure under pressure: arousal control, cue words, first action.",
    steps: [
      {
        seconds: 30,
        text: "Stand or sit tall. Feel your feet on the ground. You are ready to prepare.",
      },
      {
        seconds: 60,
        text: "Breathe in for four, out for six. A longer exhale brings your heart rate down.",
      },
      { seconds: 45, text: "Name what you can control today: effort, attitude, your next action." },
      { seconds: 45, text: "Let go of what you can't: the score, the crowd, the referee." },
      {
        seconds: 45,
        text: "Choose a cue word for today — “sharp”, “calm”, “explode”. Say it in your head.",
      },
      {
        seconds: 45,
        text: "Picture your first touch, first ball, first serve. See it go exactly right.",
      },
      {
        seconds: 30,
        text: "If pressure rises mid-game: one long exhale, your cue word, the next action.",
      },
    ],
  },
  {
    id: "visualization",
    title: "Visualization",
    type: "Athletic",
    level: "Intermediate",
    summary: "Rehearse your performance in vivid, first-person detail.",
    steps: [
      { seconds: 45, text: "Close your eyes. Breathe slowly until your shoulders drop." },
      {
        seconds: 60,
        text: "Picture the venue. The light, the surface under your feet, the sounds around you.",
      },
      {
        seconds: 60,
        text: "See it through your own eyes, not as a spectator. You are inside the moment.",
      },
      { seconds: 75, text: "Run your warm-up. Feel each movement — loose, quick, in control." },
      {
        seconds: 90,
        text: "Play your best moments: a clean strike, a perfect line, a decisive sprint.",
      },
      {
        seconds: 60,
        text: "Now a setback — a miss, a mistake. Watch yourself reset: exhale, cue word, next play.",
      },
      {
        seconds: 60,
        text: "Finish strong. Feel the last minutes with full energy and calm focus.",
      },
      { seconds: 30, text: "Bring the feeling with you. Open your eyes when you're ready." },
    ],
  },
  {
    id: "evening-wind-down",
    title: "Evening wind-down",
    type: "Meditation",
    level: "All levels",
    summary: "A body scan to release the day before sleep.",
    steps: [
      { seconds: 45, text: "Lie down or sit back. Let the day's noise fade with each exhale." },
      { seconds: 60, text: "Bring attention to your feet and calves. Let them feel heavy." },
      {
        seconds: 60,
        text: "Move up to your hips and lower back. Release what they've been holding.",
      },
      { seconds: 60, text: "Soften your stomach and chest. Let the breath move freely." },
      { seconds: 60, text: "Relax your hands, arms and shoulders. Unclench your jaw." },
      { seconds: 60, text: "Notice one thing that went well today. Let it be enough." },
      { seconds: 45, text: "Rest here. There's nothing left to do tonight." },
    ],
  },
];

export function getGuidedScript(scriptId) {
  return guidedScripts.find((script) => script.id === scriptId) ?? null;
}

export function getScriptMinutes(script) {
  return Math.round(script.steps.reduce((sum, step) => sum + step.seconds, 0) / 60);
}

/**
 * Practice library (web: mentalSessions). `kind` decides which tool opens:
 *   meditation → guided session player · breathing → breathing player
 *   journaling → guided journal         · cbt       → thought reframe
 */
export const mindSessions = [
  {
    id: "1",
    title: "Deep Focus",
    duration: "15 min",
    type: "Meditation",
    level: "Beginner",
    icon: "eye",
    kind: "meditation",
    scriptId: "deep-focus",
  },
  {
    id: "2",
    title: "Box Breathing",
    duration: "5 min",
    type: "Breathing",
    level: "All levels",
    icon: "wind",
    kind: "breathing",
    patternId: "box",
  },
  {
    id: "3",
    title: "Evening Reflection",
    duration: "10 min",
    type: "Journaling",
    level: "Intermediate",
    icon: "book-open",
    kind: "journaling",
    promptSetId: "evening",
  },
  {
    id: "4",
    title: "Anxiety Reset",
    duration: "12 min",
    type: "CBT activity",
    level: "All levels",
    icon: "refresh-cw",
    kind: "cbt",
  },
];

/** Route for a practice (see `kind`). */
export function getSessionHref(session) {
  switch (session.kind) {
    case "meditation":
      return `/session/${session.scriptId}`;
    case "breathing":
      return {
        pathname: "/breathing",
        params: { pattern: session.patternId, title: session.title },
      };
    case "journaling":
      return { pathname: "/journal/new", params: { set: session.promptSetId } };
    case "cbt":
      return "/reframe";
    default:
      return "/breathing";
  }
}

/** Journaling prompts. Daily check-in picks one; prompt sets drive guided entries. */
export const journalPrompts = [
  "What gave you energy today?",
  "What is one thing you can let go of?",
  "Where did you feel strongest today — body or mind?",
  "What would make tomorrow a good training day?",
  "What are you proud of this week?",
  "What drained you today, and what refilled you?",
];

export const journalPromptSets = {
  daily: {
    title: "Daily check-in",
    prompts: ["How do you feel, in one sentence?", "What's one thing you want from today?"],
  },
  evening: {
    title: "Evening reflection",
    prompts: [
      "What went well today?",
      "What was hard, and how did you handle it?",
      "What will you do differently tomorrow?",
    ],
  },
  training: {
    title: "Training reflection",
    prompts: [
      "How did your body feel in today's session?",
      "What did you do well technically?",
      "What's your focus for the next session?",
    ],
  },
};

/**
 * Thought reframe — a CBT-inspired thought record. Each step is one screen
 * of the /reframe flow. Saved to the member's profile.
 */
export const reframeSteps = [
  {
    id: "situation",
    title: "What happened?",
    hint: "Just the facts — where you were, what happened, who was there.",
    placeholder: "Missed my lifts in today's session…",
  },
  {
    id: "thought",
    title: "What went through your mind?",
    hint: "The automatic thought, in the words you heard it.",
    placeholder: "I'm going backwards. I'll never hit that number.",
  },
  {
    id: "feeling",
    title: "How strongly do you believe it?",
    hint: "Rate the thought, then name the feeling it brought.",
  },
  {
    id: "evidence",
    title: "Look at the evidence",
    hint: "What supports the thought? What doesn't fit it?",
  },
  {
    id: "balanced",
    title: "A more balanced thought",
    hint: "Something you'd say to a teammate in the same spot — fair, not falsely positive.",
    placeholder: "One off day after 8 weeks of progress isn't a trend. I'll rest and go again.",
  },
];

export const reframeFeelings = [
  "Anxious",
  "Frustrated",
  "Sad",
  "Overwhelmed",
  "Guilty",
  "Angry",
  "Disappointed",
];

/**
 * Wellbeing check — a short, structured self-assessment of the last two
 * weeks. Each statement is rated 0 (never) to 5 (all of the time); the total
 * is scaled to 0–100. It is a reflection tool, not a diagnosis.
 */
export const wellbeingCheck = {
  title: "Wellbeing check",
  intro: "Five quick statements about the last two weeks. There are no right answers.",
  scale: ["Never", "Rarely", "Sometimes", "Often", "Mostly", "Always"],
  statements: [
    { id: "mood", text: "I've felt upbeat and in good spirits." },
    { id: "calm", text: "I've felt calm and able to relax." },
    { id: "energy", text: "I've had energy for training and daily life." },
    { id: "sleep", text: "I've woken up feeling rested." },
    { id: "interest", text: "My days have had things I care about in them." },
  ],
  bands: [
    {
      min: 80,
      label: "Thriving",
      tone: "success",
      message: "You're in a strong place. Keep doing what's working.",
    },
    {
      min: 60,
      label: "Steady",
      tone: "accent",
      message: "A solid baseline. A daily breath or journal entry helps keep it there.",
    },
    {
      min: 40,
      label: "Running low",
      tone: "champagne",
      message:
        "Your reserves are dipping. Prioritise sleep, recovery days and a few minutes of calm.",
    },
    {
      min: 0,
      label: "Take care",
      tone: "danger",
      message:
        "It sounds like things have been heavy. Consider talking it through with someone you trust, your coach, or a health professional.",
    },
  ],
};
