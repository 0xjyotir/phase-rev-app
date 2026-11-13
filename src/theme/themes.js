/**
 * Semantic color themes.
 *
 * Every component reads colors by *meaning* (surface, textMuted, accent…),
 * never by hex. Swapping `lightTheme` ↔ `darkTheme` restyles the whole app.
 *
 * Mapping to the web CSS variables (rev-app.css):
 *   background   → --rev-bg
 *   surface      → --rev-surface
 *   surfaceSoft  → --rev-surface-soft
 *   text         → --rev-text
 *   textMuted    → --rev-muted
 *   border       → --rev-border
 *   accent       → --rev-accent
 *   accentSoft   → --rev-accent-soft
 *   accentStrong → --rev-accent-strong
 */
import { palette } from "./palette";

/** @typedef {typeof lightColors} ThemeColors */

const lightColors = {
  background: palette.lightBg,
  surface: palette.lightSurface,
  surfaceSoft: palette.lightSurfaceSoft,
  surfaceInverse: palette.black,

  text: palette.lightText,
  textMuted: palette.lightMuted,
  textInverse: palette.snow,

  border: palette.lightBorder,
  borderStrong: palette.lightBorderStrong,

  accent: palette.cyanLight,
  accentSoft: "#E5F7FB",
  accentStrong: palette.cyanStrongLight,
  onAccent: palette.white,

  brand: palette.teal,
  champagne: "#A8843F",
  champagneSoft: "rgba(168, 132, 63, 0.14)",

  danger: palette.danger,
  dangerSoft: "rgba(209, 67, 67, 0.10)",
  success: palette.success,
  successSoft: "rgba(34, 160, 107, 0.12)",

  overlay: "rgba(28, 36, 48, 0.45)",
  shadow: "rgba(16, 24, 40, 0.08)",

  // Heatmap intensities (consistency calendar), level 1 → 3
  heat1: "rgba(0, 169, 199, 0.20)",
  heat2: "rgba(0, 169, 199, 0.45)",
  heat3: palette.cyanLight,

  tabBar: "rgba(255, 255, 255, 0.96)",
  globeOcean: "#DDE6EC",
  globeLand: "#B9C6D0",
  globeHighlight: "rgba(0, 169, 199, 0.55)",
};

/** @type {ThemeColors} */
const darkColors = {
  background: palette.darkBg,
  surface: palette.darkSurface,
  surfaceSoft: palette.darkSurfaceSoft,
  surfaceInverse: palette.snow,

  text: palette.darkText,
  textMuted: palette.darkMuted,
  textInverse: palette.lightText,

  border: palette.darkBorder,
  borderStrong: palette.darkBorderStrong,

  accent: palette.cyan,
  accentSoft: "rgba(0, 188, 212, 0.14)",
  accentStrong: palette.cyanStrongDark,
  onAccent: palette.cyanInk,

  brand: palette.teal,
  champagne: palette.champagne,
  champagneSoft: "rgba(196, 162, 101, 0.14)",

  danger: "#F06464",
  dangerSoft: "rgba(240, 100, 100, 0.14)",
  success: "#3CCB8B",
  successSoft: "rgba(60, 203, 139, 0.14)",

  overlay: "rgba(8, 10, 12, 0.72)",
  shadow: "rgba(0, 0, 0, 0.35)",

  heat1: "rgba(0, 188, 212, 0.22)",
  heat2: "rgba(0, 188, 212, 0.50)",
  heat3: palette.cyan,

  tabBar: "rgba(23, 27, 32, 0.96)",
  globeOcean: palette.globeOcean,
  globeLand: palette.globeLand,
  globeHighlight: "rgba(0, 188, 212, 0.55)",
};

export const lightTheme = { name: "light", isDark: false, colors: lightColors };
export const darkTheme = { name: "dark", isDark: true, colors: darkColors };
