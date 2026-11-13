/**
 * Coach roster + member testimonials.
 *
 * Web source: phaserev/src/constants/coaches.ts
 * Photos:     assets/images/coaches/* (resized copies of phaserev/public/images/coaches)
 *             `portrait` = clean photo (cards, profile hero) · `flyer` = official Phase Rev coach flyer
 *
 * Screens: app/coaches/index.js (list) → app/coaches/[id].js (profile)
 */

/** @typedef {"strength" | "athletic" | "nutrition" | "mental"} CoachCategory */

export const coaches = [
  {
    id: "anikait",
    name: "Anikait Chadha",
    role: "S&C Coach",
    pillar: "Athletic",
    category: "athletic",
    specialty: "Performance · Rehab · Group strength",
    experience: "Sports science",
    highlight: "Science-based training",
    bio: "Strength and conditioning for athletes who want to train smarter — performance, rehab, and strength that lasts.",
    focus: ["S&C", "Nutrition", "Injury rehab", "Group fitness"],
    credentials: ["S&C", "Sports science", "Injury rehab", "Group fitness"],
    approach:
      "Science-based programming with sustainable load management — building stronger athletes through smarter training cycles.",
    availability: "Live & remote · 1:1 + group",
    tagline: "Train smarter.",
    positioning: "Building stronger athletes and stronger foundations.",
    portrait: require("@assets/images/coaches/anikait-portrait.jpg"),
    flyer: require("@assets/images/coaches/anikait-flyer.jpg"),
  },
  {
    id: "selva",
    name: "Selva",
    role: "Body Transform Coach",
    pillar: "Physical",
    category: "strength",
    specialty: "Strength · Fat loss · Functional training",
    experience: "10+ years",
    highlight: "Mr India · 2× Mr Bangalore",
    bio: "A decade of building people who show up stronger — hypertrophy, fat loss, and functional work with no shortcuts.",
    focus: ["Weight gain", "Weight loss", "Functional training", "Body toning"],
    credentials: ["Mr India", "2× Mr Bangalore Winner", "10+ years experience"],
    approach:
      "Transformation through disciplined training blocks — strength, fat loss and functional capacity built in sequence.",
    availability: "Live sessions · In-person",
    tagline: "Strong today, unstoppable tomorrow.",
    positioning: "A decade of building people who show up stronger.",
    portrait: require("@assets/images/coaches/selva-portrait.jpg"),
    flyer: require("@assets/images/coaches/selva-flyer.jpg"),
  },
  {
    id: "amlan",
    name: "Amlan Shekhar Baruah",
    role: "Calisthenics & Mobility",
    pillar: "Physical",
    category: "strength",
    specialty: "Skill work · Mobility · Fat loss",
    experience: "Certified coach",
    highlight: "Bodyweight mastery",
    bio: "Control first, then power. Progressions, mobility, yoga, and nutrition that keep results sustainable.",
    focus: ["Calisthenics", "Mobility", "Fat loss", "Yoga"],
    credentials: ["Calisthenics", "Mobility", "Yoga", "Nutrition"],
    approach:
      "Bodyweight mastery through controlled progressions — mobility, skill work and sustainable fat loss.",
    availability: "Live & remote · 1:1",
    tagline: "Strong body. Flexible mind.",
    positioning: "Control first, then power — in every rep.",
    portrait: require("@assets/images/coaches/amlan-portrait.jpg"),
    flyer: require("@assets/images/coaches/amlan-flyer.jpg"),
  },
  {
    id: "ankur",
    name: "Ankur Sharma",
    role: "Physique Coach",
    pillar: "Physical",
    category: "strength",
    specialty: "Hypertrophy · Fat loss · Arm wrestling",
    experience: "7+ years",
    highlight: "6th · Muscle Mania",
    bio: "Natural physique with real timelines — lean muscle, fat loss, and the grit of competitive arm wrestling.",
    focus: ["Muscle building", "Fat loss", "Functional training", "Arm wrestling"],
    credentials: ["6th Place Muscle Mania", "Arm wrestling", "7+ years experience"],
    approach:
      "Natural physique development with honest timelines — hypertrophy, fat loss and competitive strength.",
    availability: "Live sessions · In-person",
    tagline: "Train hard. Transform fast.",
    positioning: "Natural physique. Real results. Lasting impact.",
    portrait: require("@assets/images/coaches/ankur-portrait.jpg"),
    flyer: require("@assets/images/coaches/ankur-flyer.jpg"),
  },
];

/** Same five filters as the website roster. Nutrition & mental show an empty state for now. */
export const coachFilters = [
  { id: "all", label: "All" },
  { id: "strength", label: "Strength" },
  { id: "athletic", label: "Athletic" },
  { id: "nutrition", label: "Nutrition" },
  { id: "mental", label: "Mental" },
];

export function getCoachesByCategory(category) {
  return category === "all" ? coaches : coaches.filter((coach) => coach.category === category);
}

export function getCoachesByPillar(pillar) {
  return coaches.filter((coach) => coach.pillar.toLowerCase() === pillar);
}

/** /coaches page copy (web: phaserev/src/constants/coaches-page.ts). */
export const coachPageCopy = {
  hero: {
    eyebrow: "Elite coaching",
    headline: ["COACHES", "WHO MOVE", "YOU FORWARD."],
    subheadline:
      "Specialists across strength, athletic performance, nutrition and mental performance — built around where you are and where you're going.",
    meta: [
      { label: "Phase", value: "01" },
      { label: "Focus", value: "Coaching" },
      { label: "Specialties", value: "04" },
      { label: "Format", value: "Live + remote" },
    ],
  },
  philosophy: {
    label: "Why Phase Rev",
    statement:
      "Your coach shouldn't just give you a workout. They should understand what you're trying to become.",
    body: "Phase Rev coaches work inside a full performance ecosystem — training, sport, nutrition and mental wellness connected to your actual goals, not generic templates.",
  },
  specialties: [
    { number: "01", title: "Strength", description: "Build force, structure and resilience.", filter: "strength" },
    { number: "02", title: "Athletic performance", description: "Train for sport with intent.", filter: "athletic" },
    { number: "03", title: "Nutrition", description: "Fuel that supports the work.", filter: "nutrition" },
    { number: "04", title: "Mental performance", description: "Clarity under pressure.", filter: "mental" },
  ],
  roster: {
    eyebrow: "The roster",
    title: "Meet the people behind the performance.",
    empty: "No coaches in this specialty yet — explore another filter or view all.",
  },
  statement: {
    lines: ["THE RIGHT COACH", "CHANGES HOW", "YOU TRAIN."],
    subline: "The relationship is the program. Choose with intention.",
  },
  cta: {
    eyebrow: "Next phase",
    headline: ["READY FOR", "YOUR NEXT", "PHASE?"],
    body: "Find the specialist who fits where you're going — then book through Performance or Elite memberships.",
    primary: "View memberships",
    secondary: "Start assessment",
  },
};

/** Ways to train with a coach (used by the session request sheet). */
export const coachingFormats = [
  { id: "live-1to1", label: "1:1 live", description: "In-person, one to one" },
  { id: "remote-1to1", label: "1:1 remote", description: "Video call + programming" },
  { id: "group", label: "Group", description: "Small-group sessions" },
];

export const coachingTimes = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
];

export function getCoachById(coachId) {
  return coaches.find((coach) => coach.id === coachId) ?? null;
}

export const testimonials = [
  {
    id: "1",
    quote:
      "Phase Rev changed how I approach training. Everything connects — strength, recovery, nutrition, and mindset in one place.",
    author: "Karan S.",
    role: "Performance Member",
    pillar: "Physical",
  },
  {
    id: "2",
    quote:
      "The mental wellness pillar alone is worth the membership. My focus on the pitch has never been sharper.",
    author: "Divya M.",
    role: "Elite Member",
    pillar: "Athletic",
  },
  {
    id: "3",
    quote:
      "Thoughtful meal suggestions removed all the guesswork. I finally understand how to fuel properly.",
    author: "Rohan K.",
    role: "Performance Member",
    pillar: "Nutrition",
  },
];
