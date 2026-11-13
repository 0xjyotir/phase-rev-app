/**
 * Home dashboard sample data.
 *
 * Web source: phaserev/src/constants/dashboard.ts
 *
 * ⚠️  Still mock data (same as the web build). Workouts on Home are derived
 *     live from training-store; achievements + the static activity seed below
 *     should come from `GET /users/me/dashboard` once the backend exists.
 */

/** `icon` is a Feather icon name. */
export const achievements = [
  {
    id: "1",
    title: "7-Day Streak",
    description: "Completed gym or calisthenics sessions 7 days in a row",
    icon: "zap",
    unlocked: true,
  },
  {
    id: "2",
    title: "Volume Climber",
    description: "Hit a new weekly training volume PR",
    icon: "trending-up",
    unlocked: true,
  },
  {
    id: "3",
    title: "Skill Progress",
    description: "Improved a calisthenics skill progression",
    icon: "award",
    unlocked: true,
  },
  {
    id: "4",
    title: "Consistency King",
    description: "Complete 50 gym or calisthenics sessions",
    icon: "star",
    unlocked: false,
  },
];

/** Non-workout activity (achievements, check-ins). Workouts are merged in from history. */
export const activitySeed = [
  {
    id: "a-1",
    type: "achievement",
    title: "Unlocked: Volume Climber",
    time: "2 days ago",
    pillar: "Progress",
  },
  { id: "a-2", type: "mind", title: "Box breathing · 5 min", time: "3 days ago", pillar: "Mind" },
];

/** Weekly training target used by the Home "This week" card. */
export const WEEKLY_SESSION_TARGET = 5;
