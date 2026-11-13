/**
 * Brand identity + marketing copy.
 *
 * Source of truth on the web:
 *   phaserev/src/constants/navigation.ts → siteMeta
 *   phaserev/src/constants/homepage.ts   → homePageCopy.hero / method
 *
 * Used by: Wordmark, Welcome screen, Profile → About.
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
  secondaryCta: "Explore memberships",
  meta: [
    { value: "04", label: "Pillars" },
    { value: "50+", label: "Coaches" },
    { value: "12K+", label: "Members" },
  ],
};

/** The Phase Rev method — "Everything is connected." */
export const brandMethod = {
  eyebrow: "The Phase Rev method",
  headline: "Your body doesn't exist in silos.",
  lines: [
    "Training affects recovery.",
    "Nutrition affects performance.",
    "Mental state affects consistency.",
    "Everything is connected.",
  ],
};

/** Bundled media. Keep requires here so screens don't hard-code asset paths. */
export const brandMedia = {
  heroVideo: require("@assets/video/hero.mp4"),
  icon: require("@assets/brand/icon.png"),
};
