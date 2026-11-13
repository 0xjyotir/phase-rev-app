/**
 * The four Phase Rev pillars — everything the website says about them.
 *
 * Web sources:
 *   phaserev/src/constants/pillars.ts          → pillars, physicalPrograms, athleticSports, mentalSessions
 *   phaserev/src/constants/hero.ts             → pillarHeroes (physical / athletic / nutrition / mental / ecosystem)
 *   phaserev/src/constants/physical-page.ts    → physicalPageCopy
 *   phaserev/src/sections/athletic/*           → athletic features ("Beyond physical training")
 *   phaserev/src/sections/ecosystem/*          → ecosystem map copy
 *   phaserev/src/sections/physical/transformation-section.tsx → results stats
 *
 * In the app each pillar has:
 *   - a member tab where the work happens (Train · Fuel · Mind)
 *   - a pillar page (/pillar/[id]) with the website's story, programs and CTAs
 *
 * `icon` keys are app icon names (components/ui/icon-map.json).
 */
export const pillars = [
  {
    id: "physical",
    number: "01",
    label: "Physical Performance",
    shortLabel: "Physical",
    tagline: "Build strength. Move better. Recover faster.",
    description:
      "Comprehensive training programs spanning strength, HIIT, running, cycling, mobility, and injury prevention with online coaching support.",
    icon: "dumbbell",
    tab: "/train",
    items: [
      "Strength Training",
      "Muscle Gain",
      "Weight Loss",
      "HIIT",
      "Running",
      "Cycling",
      "Mobility",
      "Functional Movement",
      "Injury Prevention",
      "Online Coaching",
    ],
    media: { label: "Physical performance", sub: "Strength, conditioning, mobility" },
    preview: { title: "Strength & conditioning", sub: "Programs and coaching" },
  },
  {
    id: "athletic",
    number: "02",
    label: "Athletic Performance",
    shortLabel: "Athletic",
    tagline: "Dominate your sport. Sharpen your mind.",
    description:
      "Sport-specific programs for football, cricket, and badminton with performance psychology, visualization, and elite coaching.",
    icon: "target",
    tab: "/train",
    items: [
      "Football",
      "Cricket",
      "Badminton",
      "Performance Psychology",
      "Visualization",
      "Elite Coaching",
      "Video Analysis",
      "Reaction Training",
      "Skill Development",
    ],
    media: { label: "Athletic performance", sub: "Sport-specific training" },
    preview: { title: "Sport performance", sub: "Football, cricket, badminton" },
  },
  {
    id: "nutrition",
    number: "03",
    label: "Rev Nutrition",
    shortLabel: "Nutrition",
    tagline: "Fuel precision. Track everything.",
    description:
      "Personalized meal plans, macro tracking, hydration monitoring, and meal guidance with nutrition consultations.",
    icon: "fork",
    tab: "/fuel",
    items: [
      "Meal Plans",
      "Macro Tracking",
      "Hydration",
      "Meal Logging",
      "Meal guidance",
      "Nutrition Consultations",
    ],
    media: { label: "Rev nutrition", sub: "Meals, macros, hydration" },
    preview: { title: "Precision nutrition", sub: "Meals, macros, hydration" },
  },
  {
    id: "mental",
    number: "04",
    label: "Mental Wellness",
    shortLabel: "Mental",
    tagline: "Train your mind like muscle.",
    description:
      "Meditation, breathing exercises, guided journaling, mood tracking, CBT activities, and structured wellbeing assessments.",
    icon: "brain",
    tab: "/mind",
    items: [
      "Meditation",
      "Breathing Exercises",
      "Guided journaling",
      "Mood Tracking",
      "CBT Activities",
      "Wellbeing Assessments",
    ],
    media: { label: "Mental wellness", sub: "Mind, mood, recovery" },
    preview: { title: "Mental performance", sub: "Meditation, journal, mood" },
  },
];

export function getPillarById(pillarId) {
  return pillars.find((pillar) => pillar.id === pillarId) ?? null;
}

/** Hero copy per pillar page (web: pillarHeroes + the bespoke physical/nutrition heroes). */
export const pillarHeroes = {
  physical: {
    eyebrow: "Pillar 01 · Physical performance",
    headline: [
      { text: "GYM.", accent: false },
      { text: "CALISTHENICS.", accent: true },
      { text: "REAL TRAINING.", accent: false },
    ],
    subheadline:
      "Strength under the bar. Control with your bodyweight. One system for the work that actually builds you.",
    meta: [
      { value: "02", label: "Training paths" },
      { value: "Gym", label: "Weights & machines" },
      { value: "Body", label: "Calisthenics" },
    ],
    primaryCta: "Track your workouts",
    secondaryCta: "Meet coaches",
  },
  athletic: {
    eyebrow: "Pillar 02 · Athletic performance",
    headline: [
      { text: "DOMINATE", accent: false },
      { text: "YOUR SPORT.", accent: true },
    ],
    subheadline:
      "Sport-specific conditioning, visualization, reaction training, and elite coaching for football, cricket, and badminton athletes.",
    meta: [
      { value: "03", label: "Sports" },
      { value: "S&C", label: "Conditioning" },
      { value: "Mind", label: "Psychology" },
    ],
    primaryCta: "Train your sport",
    secondaryCta: "View programs",
  },
  nutrition: {
    eyebrow: "Pillar 03 · Rev Nutrition",
    headline: [
      { text: "PRECISION FUEL", accent: false },
      { text: "FOR HOW YOU LIVE", accent: true },
      { text: "AND TRAIN.", accent: false },
    ],
    subheadline:
      "Regional meal intelligence, macro tracking, and expert nutrition guidance — unified in one membership built around your goals.",
    meta: [
      { value: "14", label: "Global regions" },
      { value: "2.4K", label: "Meals curated" },
      { value: "98%", label: "Macro adherence" },
    ],
    primaryCta: "Open Fuel",
    secondaryCta: "Start assessment",
  },
  mental: {
    eyebrow: "Pillar 04 · Mental wellness",
    headline: [
      { text: "TRAIN YOUR MIND", accent: false },
      { text: "LIKE MUSCLE.", accent: true },
    ],
    subheadline:
      "Meditation, breathing protocols, guided journaling, mood tracking, and mindful practices for clarity and calm.",
    meta: [
      { value: "04", label: "Practices" },
      { value: "Daily", label: "Mood check-in" },
      { value: "5 min", label: "Reset breath" },
    ],
    primaryCta: "Begin practice",
    secondaryCta: "Browse sessions",
  },
};

/** Closing CTA per pillar page (web: FinalCtaSection on each page). */
export const pillarFinalCtas = {
  physical: {
    headline: ["YOUR NEXT SESSION", "STARTS WITH A PLAN."],
    body: "Train with intent. Track what matters. Leave the guesswork behind.",
    primaryCta: "Track workouts",
    secondaryCta: "View memberships",
  },
  athletic: {
    headline: ["ELEVATE", "YOUR GAME."],
    body: "Sport-specific training, psychology, and elite coaching — all in one membership.",
    primaryCta: "Get started",
    secondaryCta: "Meet coaches",
  },
  nutrition: {
    headline: ["YOUR BODY KNOWS", "WHAT IT NEEDS."],
    body: "We help you listen. Join Phase Rev and get nutrition that works with your training — not against it.",
    primaryCta: "Choose your membership",
    secondaryCta: "Talk to a nutritionist",
  },
  mental: {
    headline: ["MASTER", "YOUR MIND."],
    body: "Mental wellness is the foundation of every performance gain.",
    primaryCta: "Start free trial",
    secondaryCta: "See all pillars",
  },
};

// ─── Physical ─────────────────────────────────────────────────────────────

/** "Choose your path — train the way you move." */
export const physicalPaths = {
  eyebrow: "Choose your path",
  headline: ["TRAIN THE WAY", "YOU MOVE."],
  items: [
    {
      id: "gym",
      number: "01",
      title: "Gym",
      icon: "dumbbell",
      description:
        "Progressive overload with barbells, dumbbells, and machines — structured sessions you can log and improve.",
      points: ["Compound lifts", "Hypertrophy blocks", "Strength progression"],
    },
    {
      id: "calisthenics",
      number: "02",
      title: "Calisthenics",
      icon: "figure",
      description:
        "Skill, control, and relative strength — from fundamentals to advanced progressions.",
      points: ["Skill progressions", "Mobility & control", "Bodyweight power"],
    },
  ],
};

/** Programs (web: physicalPrograms). */
export const physicalPrograms = [
  {
    id: "strength",
    title: "Strength Foundations",
    duration: "12 weeks",
    level: "All Levels",
    description: "Progressive overload protocols for compound strength and muscle development.",
  },
  {
    id: "hiit",
    title: "HIIT Ignition",
    duration: "8 weeks",
    level: "Intermediate",
    description: "High-intensity intervals designed to torch fat and build cardiovascular power.",
  },
  {
    id: "running",
    title: "Endurance Engine",
    duration: "10 weeks",
    level: "Beginner–Advanced",
    description: "Structured running programs from 5K to marathon with pacing intelligence.",
  },
  {
    id: "mobility",
    title: "Mobility Matrix",
    duration: "6 weeks",
    level: "All Levels",
    description: "Functional movement flows targeting flexibility, stability, and injury prevention.",
  },
  {
    id: "weight-loss",
    title: "Body Recomposition",
    duration: "12 weeks",
    level: "All Levels",
    description: "Science-backed fat loss with strength preservation and metabolic optimization.",
  },
  {
    id: "coaching",
    title: "1:1 Online Coaching",
    duration: "Ongoing",
    level: "Personalized",
    description: "Direct access to elite coaches with custom programming and weekly check-ins.",
  },
];

/** "Learn the move. Then own it." */
export const physicalExercisesCopy = {
  eyebrow: "Exercise library",
  headline: ["LEARN THE MOVE.", "THEN OWN IT."],
  body: "Technique videos for every exercise. Study form before you load the bar.",
  cta: "Open the full library",
};

/** "Log sets. See progress. Show up again." */
export const physicalTrackCopy = {
  eyebrow: "Workout tracking",
  headline: ["LOG SETS.", "SEE PROGRESS.", "SHOW UP AGAIN."],
  body: "Track gym and calisthenics sessions inside Rev — weight, reps, rest, history.",
  features: [
    { label: "Set logging", detail: "Weight · reps · RIR", icon: "check-square" },
    { label: "Rest timer", detail: "Built into the session", icon: "timer" },
    { label: "History", detail: "What you did, when", icon: "clock" },
    { label: "Two modes", detail: "Gym + calisthenics", icon: "layers" },
  ],
  sessionPreview: {
    title: "Push · Day A",
    rows: [
      { name: "Barbell Bench Press", detail: "4 × 6–8 · 80kg" },
      { name: "Incline Dumbbell Press", detail: "3 × 10 · 28kg" },
      { name: "Cable Fly", detail: "3 × 12 · 18kg" },
      { name: "Lateral Raise", detail: "3 × 15 · 10kg" },
    ],
  },
};

export const physicalCoachesCopy = {
  eyebrow: "Coaches",
  headline: "THE PEOPLE WHO LIVE IN THE WORK.",
  body: "Body transform, calisthenics, and physique — coaches who train the way Phase Rev trains.",
};

/** Results block (web: TransformationSection). */
export const transformation = {
  eyebrow: "Results",
  title: "Real transformation",
  subtitle: "A structured 12-week block, from baseline assessment to program complete.",
  phases: [
    { phase: "Before", week: "Week 0", label: "Starting point", sub: "Baseline assessment" },
    { phase: "After", week: "Week 12", label: "Transformation", sub: "Program complete" },
  ],
  stats: [
    { value: "12", label: "Week program" },
    { value: "94%", label: "Completion rate" },
    { value: "3.2×", label: "Avg. strength gain" },
  ],
};

// ─── Athletic ─────────────────────────────────────────────────────────────

/** Athletic pillar — sport tracks. */
export const athleticSports = [
  {
    id: "football",
    title: "Football",
    icon: "football",
    tagline: "Speed, agility, match fitness",
    features: ["Position-specific drills", "Match simulation", "Recovery protocols"],
  },
  {
    id: "cricket",
    title: "Cricket",
    icon: "cricket",
    tagline: "Power, endurance, mental edge",
    features: ["Batting conditioning", "Bowling mechanics", "Field agility"],
  },
  {
    id: "badminton",
    title: "Badminton",
    icon: "racket",
    tagline: "Explosive movement, reaction time",
    features: ["Footwork drills", "Smash power", "Court endurance"],
  },
];

/**
 * "Mind & body — Beyond physical training." In the app each one is a real tool:
 * psychology & visualization run guided sessions, reaction training is a drill.
 */
export const athleticFeatures = {
  eyebrow: "Mind & body",
  title: "Beyond physical training",
  subtitle: "Athletic excellence requires mental precision alongside conditioning.",
  items: [
    {
      id: "psychology",
      icon: "brain",
      title: "Performance psychology",
      description: "Frameworks for focus and composure under pressure.",
      action: { label: "Pre-game focus", href: "/session/pre-game-focus" },
    },
    {
      id: "visualization",
      icon: "eye",
      title: "Visualization",
      description: "Structured imagery to rehearse performance before competition.",
      action: { label: "Rehearse your game", href: "/session/visualization" },
    },
    {
      id: "reaction",
      icon: "zap",
      title: "Reaction training",
      description: "Drills that sharpen reflexes and decision speed.",
      action: { label: "Start reaction drill", href: "/reaction" },
    },
  ],
};

// ─── Ecosystem page ───────────────────────────────────────────────────────

export const ecosystemPage = {
  eyebrow: "How it connects",
  headline: ["FOUR PILLARS.", "ONE COMPLETE", "JOURNEY."],
  subheadline:
    "Training, sport, nutrition, and mental wellness are not separate pursuits — at Phase Rev, they work together around how you actually live.",
  pillarsTitle: "The four pillars",
  pillarsSubtitle:
    "Each pillar stands on its own. Together, they shape a complete path that adapts to your goals.",
  unified: "Unified through progress tracking, consultations, and community.",
  connects: {
    title: "Everything connects.",
    body: "Physical training, sport, nutrition, and mental wellness — each pillar strengthens the others.",
  },
  finalCta: {
    headline: ["READY", "TO BEGIN?"],
    body: "Start with a free assessment and find your path across all four pillars.",
    primaryCta: "Begin assessment",
    secondaryCta: "View pricing",
  },
};
