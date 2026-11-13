/**
 * The four Phase Rev pillars.
 *
 * Web source: phaserev/src/constants/pillars.ts
 *
 * In the app each pillar maps to a tab:
 *   physical  → Train tab      athletic → Train tab (sport programs)
 *   nutrition → Fuel tab       mental   → Mind tab
 *
 * `icon` is a Feather icon name (@expo/vector-icons).
 */
export const pillars = [
  {
    id: "physical",
    number: "01",
    label: "Physical Performance",
    shortLabel: "Physical",
    tagline: "Build strength. Move better. Recover faster.",
    description:
      "Strength, HIIT, running, mobility and injury prevention with online coaching support.",
    icon: "activity",
    href: "/train",
  },
  {
    id: "athletic",
    number: "02",
    label: "Athletic Performance",
    shortLabel: "Athletic",
    tagline: "Dominate your sport. Sharpen your mind.",
    description:
      "Sport-specific programs for football, cricket and badminton with performance psychology.",
    icon: "target",
    href: "/train",
  },
  {
    id: "nutrition",
    number: "03",
    label: "Rev Nutrition",
    shortLabel: "Nutrition",
    tagline: "Fuel precision. Track everything.",
    description: "Personalized meal plans, macro tracking, hydration and regional meal guidance.",
    icon: "coffee",
    href: "/fuel",
  },
  {
    id: "mental",
    number: "04",
    label: "Mental Wellness",
    shortLabel: "Mental",
    tagline: "Train your mind like muscle.",
    description: "Meditation, breathing, guided journaling, mood tracking and CBT activities.",
    icon: "wind",
    href: "/mind",
  },
];

/** Athletic pillar — sport tracks (shown in Train → Library). */
export const athleticSports = [
  {
    id: "football",
    title: "Football",
    tagline: "Speed, agility, match fitness",
    features: ["Position-specific drills", "Match simulation", "Recovery protocols"],
  },
  {
    id: "cricket",
    title: "Cricket",
    tagline: "Power, endurance, mental edge",
    features: ["Batting conditioning", "Bowling mechanics", "Field agility"],
  },
  {
    id: "badminton",
    title: "Badminton",
    tagline: "Explosive movement, reaction time",
    features: ["Footwork drills", "Smash power", "Court endurance"],
  },
];
