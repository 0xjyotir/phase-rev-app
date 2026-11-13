/**
 * Brand identity + homepage story.
 *
 * Source of truth on the web:
 *   phaserev/src/constants/navigation.ts → siteMeta
 *   phaserev/src/constants/homepage.ts   → homePageCopy (hero, method, ecosystem,
 *                                          oneSystem, coaches, membership, community,
 *                                          stories, finalCta)
 *   phaserev/src/constants/assessment.ts → communityPreview
 *
 * Used by: Wordmark, Welcome, the Explore tab and the Ecosystem screen.
 */

export const siteMeta = {
  name: "Phase Rev",
  /** Split for the two-tone wordmark: "PHASE" (white) + "REV" (cyan). */
  wordmark: { first: "Phase", second: "Rev" },
  tagline: "Rework, rebuild, recharge",
  description:
    "Physical training, athletic mastery, precision nutrition, and mental wellness — brought together in one membership.",
};

/** Welcome screen hero (mirrors the homepage hero). `accent` lines render in cyan. */
export const welcomeHero = {
  badge: "Holistic wellness",
  headline: [
    { text: "REWORK", accent: false },
    { text: "YOUR BODY.", accent: true },
    { text: "REBUILD", accent: false },
    { text: "YOUR PERFORMANCE.", accent: false },
    { text: "RECHARGE", accent: false },
    { text: "YOUR LIFE.", accent: true },
  ],
  subheadline:
    "One connected system for physical performance, athletic development, nutrition and mental wellness.",
  primaryCta: "Enter Rev",
  secondaryCta: "Explore Phase Rev",
  meta: [
    { value: "04", label: "Pillars" },
    { value: "50+", label: "Coaches" },
    { value: "12K+", label: "Members" },
  ],
};

/** Homepage hero stats (web: homeHero.stats). */
export const heroStats = [
  { value: "4", label: "Performance pillars" },
  { value: "50+", label: "Elite coaches" },
  { value: "12K+", label: "Active members" },
  { value: "98%", label: "Goal completion" },
];

/** The Phase Rev method — "Your body doesn't exist in silos." */
export const brandMethod = {
  eyebrow: "The Phase Rev method",
  headline: ["YOUR BODY DOESN'T", "EXIST IN SILOS."],
  lines: [
    "Training affects recovery.",
    "Nutrition affects performance.",
    "Mental state affects consistency.",
    "Everything is connected.",
  ],
  explanation:
    "Phase Rev is built around the whole picture — not four disconnected products fighting for your attention.",
  cta: "See the ecosystem",
  pillars: ["PHYSICAL", "ATHLETIC", "NUTRITION", "MENTAL"],
};

/** "One body. Four dimensions. One system." */
export const oneSystem = {
  headline: ["ONE BODY.", "FOUR DIMENSIONS.", "ONE SYSTEM."],
  steps: [
    { id: "train", label: "TRAIN", icon: "dumbbell" },
    { id: "recover", label: "RECOVER", icon: "battery-charging" },
    { id: "fuel", label: "FUEL", icon: "fork" },
    { id: "focus", label: "FOCUS", icon: "brain" },
    { id: "perform", label: "PERFORM", icon: "zap" },
  ],
};

/**
 * "Four dimensions. One human." — the interactive ecosystem explorer.
 * Images are the same coach portraits the website uses for each dimension.
 */
export const ecosystemDimensions = {
  eyebrow: "The ecosystem",
  headline: "FOUR DIMENSIONS.\nONE HUMAN.",
  centerLabel: "ATHLETE",
  intro:
    "Tap each dimension to see how Phase Rev connects training, fuel, sport and mind around one person.",
  pillars: [
    {
      id: "physical",
      label: "Physical",
      tagline: "Build strength. Move better. Recover faster.",
      image: require("@assets/images/coaches/selva-portrait.jpg"),
    },
    {
      id: "athletic",
      label: "Athletic",
      tagline: "Train specifically. Perform under pressure.",
      image: require("@assets/images/coaches/anikait-portrait.jpg"),
    },
    {
      id: "nutrition",
      label: "Nutrition",
      tagline: "Fuel intelligently. Recover deliberately.",
      image: require("@assets/images/coaches/ankur-portrait.jpg"),
    },
    {
      id: "mental",
      label: "Mental",
      tagline: "Build focus. Manage pressure. Stay consistent.",
      image: require("@assets/images/coaches/amlan-portrait.jpg"),
    },
  ],
};

/** Homepage coaching teaser. */
export const coachingTeaser = {
  eyebrow: "Coaching",
  headline: "THE RIGHT COACH CHANGES THE WAY YOU TRAIN.",
  body: "50+ specialists across strength, athletic performance, nutrition and mental wellness.",
  cta: "Meet the coaches",
};

/** Homepage membership teaser. */
export const membershipTeaser = {
  eyebrow: "Membership",
  headline: ["CHOOSE YOUR", "LEVEL OF SUPPORT."],
  cta: "Compare all memberships",
  highlightLabel: "Most selected",
};

/** "More than a program. A community that moves." */
export const community = {
  eyebrow: "Community",
  headline: ["MORE THAN", "A PROGRAM."],
  subheadline: "A COMMUNITY THAT MOVES.",
  body: "Train alongside people who are working through their own next phase.",
  title: "Join the Phase Rev Community",
  description: "Connect with members, share progress, and join group sessions led by our coaches.",
  stats: [
    { value: "12,400+", label: "Members" },
    { value: "48", label: "Groups" },
    { value: "Weekly", label: "Sessions" },
  ],
  cta: "Explore community",
  image: require("@assets/images/coaches/selva-portrait.jpg"),
};

export const storiesCopy = {
  eyebrow: "Transformation stories",
  navLabel: "More stories",
};

/** "Your next phase doesn't happen by accident." */
export const finalCta = {
  headline: ["YOUR NEXT PHASE", "DOESN'T HAPPEN", "BY ACCIDENT."],
  body: "Start with your assessment. We'll help you understand what comes next.",
  primaryCta: "Start your assessment",
  secondaryCta: "Explore memberships",
  image: require("@assets/images/coaches/anikait-portrait.jpg"),
};

/** Bundled media. Keep requires here so screens don't hard-code asset paths. */
export const brandMedia = {
  heroVideo: require("@assets/video/hero.mp4"),
  icon: require("@assets/brand/icon.png"),
};
