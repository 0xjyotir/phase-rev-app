/**
 * Semantic color themes.
 *
 * Components read colors by *meaning* (surface, textMuted, accent…), never by
 * hex. Swapping lightTheme ↔ darkTheme restyles the whole app.
 *
 * The scheme follows iOS conventions so the native chrome (Liquid Glass tab
 * bar, navigation bars, alerts) and our own views feel like one system:
 *
 *   background     page base (behind the ambient glow)
 *   surface        opaque card color — used when glass is unavailable
 *   surfaceSoft    translucent fill for tiles/inputs inside cards (≈ tertiarySystemFill)
 *   surfaceStrong  stronger translucent fill (pressed rows, tracks)
 *   text / textMuted / textTertiary   label · secondaryLabel · tertiaryLabel
 *   border / separator / borderStrong hairlines
 *   accent         Rev cyan (brand) · accentSoft tinted fill · accentStrong readable text
 *   glow*          the ambient light field the glass refracts
 *
 * Mapping to the web CSS variables (rev-app.css): background → --rev-bg,
 * surface → --rev-surface, text → --rev-text, textMuted → --rev-muted,
 * accent → --rev-accent, accentSoft → --rev-accent-soft, accentStrong → --rev-accent-strong.
 */
import { palette } from "./palette";

/** @typedef {typeof darkColors} ThemeColors */

const darkColors = {
  background: "#050607",
  backgroundElevated: "#0D1013",
  surface: "#121619",
  surfaceSoft: "rgba(235, 245, 250, 0.065)",
  surfaceStrong: "rgba(235, 245, 250, 0.11)",
  surfaceInverse: palette.snow,

  text: "#F2F4F7",
  textMuted: "rgba(235, 240, 245, 0.62)",
  textTertiary: "rgba(235, 240, 245, 0.36)",
  textInverse: "#101828",

  border: "rgba(255, 255, 255, 0.08)",
  separator: "rgba(255, 255, 255, 0.10)",
  borderStrong: "rgba(255, 255, 255, 0.18)",

  accent: palette.cyan,
  accentSoft: "rgba(0, 188, 212, 0.16)",
  accentStrong: palette.cyanStrongDark,
  onAccent: palette.cyanInk,

  brand: palette.teal,
  champagne: palette.champagne,
  champagneSoft: "rgba(196, 162, 101, 0.16)",

  danger: "#FF6B6B",
  dangerSoft: "rgba(255, 107, 107, 0.15)",
  success: "#3CCB8B",
  successSoft: "rgba(60, 203, 139, 0.15)",
  warning: "#F2B84B",

  overlay: "rgba(0, 0, 0, 0.6)",
  shadow: "rgba(0, 0, 0, 0.5)",

  // Heatmap intensities (consistency calendar), level 1 → 3
  heat1: "rgba(0, 188, 212, 0.24)",
  heat2: "rgba(0, 188, 212, 0.52)",
  heat3: palette.cyan,

  tabBar: "rgba(14, 17, 20, 0.92)",
  globeOcean: "#10161B",
  globeLand: "#3A4550",
  globeHighlight: "rgba(0, 188, 212, 0.6)",

  // Ambient light field behind glass
  glowA: "rgba(8, 95, 112, 0.65)", // deep teal, top-left
  glowB: "rgba(0, 188, 212, 0.26)", // rev cyan, right
  glowC: "rgba(196, 162, 101, 0.13)", // champagne, low
};

/** @type {ThemeColors} */
const lightColors = {
  background: "#EDF1F4",
  backgroundElevated: "#F7F9FA",
  surface: "#FFFFFF",
  surfaceSoft: "rgba(16, 24, 40, 0.045)",
  surfaceStrong: "rgba(16, 24, 40, 0.085)",
  surfaceInverse: palette.black,

  text: "#101828",
  textMuted: "rgba(16, 24, 40, 0.60)",
  textTertiary: "rgba(16, 24, 40, 0.36)",
  textInverse: palette.snow,

  border: "rgba(16, 24, 40, 0.08)",
  separator: "rgba(16, 24, 40, 0.10)",
  borderStrong: "rgba(16, 24, 40, 0.18)",

  accent: "#0097B2",
  accentSoft: "rgba(0, 151, 178, 0.12)",
  accentStrong: "#007A91",
  onAccent: palette.white,

  brand: palette.teal,
  champagne: "#9A7633",
  champagneSoft: "rgba(168, 132, 63, 0.14)",

  danger: palette.danger,
  dangerSoft: "rgba(209, 67, 67, 0.10)",
  success: "#1E9461",
  successSoft: "rgba(34, 160, 107, 0.12)",
  warning: "#B98300",

  overlay: "rgba(16, 24, 40, 0.4)",
  shadow: "rgba(16, 24, 40, 0.12)",

  heat1: "rgba(0, 151, 178, 0.20)",
  heat2: "rgba(0, 151, 178, 0.45)",
  heat3: "#0097B2",

  tabBar: "rgba(255, 255, 255, 0.94)",
  globeOcean: "#DCE6EC",
  globeLand: "#B6C4CF",
  globeHighlight: "rgba(0, 151, 178, 0.55)",

  glowA: "rgba(0, 169, 199, 0.20)",
  glowB: "rgba(94, 215, 232, 0.24)",
  glowC: "rgba(219, 196, 132, 0.22)",
};

export const darkTheme = { name: "dark", isDark: true, colors: darkColors };
export const lightTheme = { name: "light", isDark: false, colors: lightColors };
