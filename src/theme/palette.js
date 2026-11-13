/**
 * Raw brand palette.
 *
 * These hex values are copied 1:1 from the Phase Rev web codebase so the app
 * and the website stay visually identical:
 *   - Marketing site tokens  → phaserev/src/app/globals.css + src/constants/theme.ts
 *   - Rev member app tokens  → phaserev/src/app/rev-app.css (.rev-app / html.dark .rev-app)
 *
 * Components should NOT import this file directly. Use semantic tokens from
 * `useTheme().colors` (see ./themes.js) so light/dark mode keeps working.
 */
export const palette = {
  // ── Marketing / brand surface ─────────────────────────────────────────
  black: "#050505", // --bg-primary (night)
  blackElevated: "#111111", // --bg-elevated (night)
  ink: "#050607", // navbar background
  snow: "#F6F6F6", // --text-primary (night)
  navText: "#F2F3F3",
  navMuted: "#8E979D",

  // Deep teal — the primary marketing accent
  teal: "#085F70",
  tealHover: "#3E828F",
  tealActive: "#064451",
  tealLight: "#77A7B0",

  // Champagne — secondary premium accent
  champagne: "#C4A265",
  champagneLight: "#DBC484",

  // ── Rev member app (cyan system) ───────────────────────────────────────
  cyan: "#00BCD4", // wordmark "REV" + dark-mode accent
  cyanLight: "#00A9C7", // light-mode accent
  cyanStrongLight: "#0088A3",
  cyanStrongDark: "#5ED7E8",
  cyanInk: "#042028", // text on cyan buttons in dark mode

  // Light app surfaces
  lightBg: "#F4F6F8",
  lightSurface: "#FFFFFF",
  lightSurfaceSoft: "#EEF2F5",
  lightText: "#1C2430",
  lightMuted: "#667085",
  lightBorder: "#E4E8EE",
  lightBorderStrong: "#CFD6DE",

  // Dark app surfaces
  darkBg: "#0F1215",
  darkSurface: "#171B20",
  darkSurfaceSoft: "#1E242B",
  darkText: "#F2F4F7",
  darkMuted: "#98A2B3",
  darkBorder: "#2A313A",
  darkBorderStrong: "#3A434E",

  // Status
  danger: "#D14343",
  success: "#22A06B",
  warning: "#E0A100",

  // Globe (nutrition regional meals) — from ARCHITECTURE.md
  globeOcean: "#14181C",
  globeLand: "#3D4650",

  white: "#FFFFFF",
  transparent: "transparent",
};
