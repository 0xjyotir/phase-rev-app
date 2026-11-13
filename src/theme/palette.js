/**
 * Raw brand palette.
 *
 * Hex values come 1:1 from the Phase Rev web codebase so the app and the
 * website stay visually related:
 *   - Marketing site tokens  → phaserev/src/app/globals.css + src/constants/theme.ts
 *   - Rev member app tokens  → phaserev/src/app/rev-app.css (.rev-app / html.dark .rev-app)
 *
 * Components should NOT import this file for UI colors. Use the semantic tokens
 * from `useTheme().colors` (./themes.js) so light/dark/glass keep working.
 * The brand screens (welcome, hero media, coach photos) are the exception:
 * they always sit on dark imagery and use palette values directly.
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
  cyanLight: "#00A9C7", // website light-mode accent
  cyanStrongLight: "#0088A3",
  cyanStrongDark: "#5ED7E8",
  cyanInk: "#03181D", // text on cyan buttons

  // Status
  danger: "#D14343",
  success: "#22A06B",
  warning: "#E0A100",

  // Globe (nutrition regional meals) — from the website ARCHITECTURE.md
  globeOcean: "#14181C",
  globeLand: "#3D4650",

  white: "#FFFFFF",
  transparent: "transparent",
};
