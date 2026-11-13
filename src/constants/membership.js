/**
 * Membership tiers + feature comparison.
 *
 * Web source: phaserev/src/constants/pricing.ts
 * Screen:     app/membership.js
 *
 * Prices are display-only (no payments in this build). When billing lands,
 * the tier `id` must match the backend `subscriptions.tier_id`.
 */
export const membershipTiers = [
  {
    id: "essential",
    name: "Essential",
    price: 49,
    period: "month",
    description: "Foundation access to all four pillars with guided programs.",
    highlighted: false,
    features: [
      "All pillar program libraries",
      "Basic meal planning",
      "Meditation & breathing library",
      "Progress tracking",
      "Community access",
    ],
    cta: "Start Essential",
  },
  {
    id: "performance",
    name: "Performance",
    price: 99,
    period: "month",
    description: "Advanced coaching tools, personalized guidance, and priority support.",
    highlighted: true,
    features: [
      "Everything in Essential",
      "Personalized food & workout guidance",
      "Advanced macro tracking",
      "Monthly coach consultation",
      "Sport-specific programs",
      "Achievement system",
    ],
    cta: "Go Performance",
  },
  {
    id: "elite",
    name: "Elite",
    price: 199,
    period: "month",
    description: "White-glove experience with dedicated coaching and video analysis.",
    highlighted: false,
    features: [
      "Everything in Performance",
      "Weekly 1:1 coaching sessions",
      "Video form analysis",
      "Custom meal plans",
      "Priority booking",
      "Exclusive content",
    ],
    cta: "Join Elite",
  },
];

/** `true` = included, `false` = not included, string = included with a qualifier. */
export const featureComparison = [
  { feature: "Program libraries", essential: true, performance: true, elite: true },
  { feature: "Personalized guidance", essential: false, performance: true, elite: true },
  { feature: "Coach consultations", essential: false, performance: "Monthly", elite: "Weekly" },
  { feature: "Video analysis", essential: false, performance: false, elite: true },
  { feature: "Custom meal plans", essential: false, performance: false, elite: true },
  { feature: "Community access", essential: true, performance: true, elite: true },
  { feature: "Achievement system", essential: false, performance: true, elite: true },
  { feature: "Priority support", essential: false, performance: true, elite: true },
];

export const membershipCopy = {
  eyebrow: "Memberships",
  headline: "Invest in your evolution",
  subheadline:
    "Clear membership tiers for every stage of your journey — from your first assessment to long-term performance.",
  tiersTitle: "Choose your membership",
  tiersSubtitle:
    "All tiers include every pillar. Upgrade for deeper coaching and personal guidance.",
  compareTitle: "Compare features",
  highlightLabel: "Most selected",
  trial: {
    headline: "Start your 7-day trial",
    body: "Try every pillar risk-free for seven days. Cancel anytime.",
    primaryCta: "Get started",
    secondaryCta: "Talk to a coach",
  },
};

export function getTierById(tierId) {
  return membershipTiers.find((tier) => tier.id === tierId) ?? null;
}
