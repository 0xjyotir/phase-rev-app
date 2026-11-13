/**
 * Typography system.
 *
 * Fonts (same families as the web app — see phaserev/src/app/layout.tsx):
 *   - Outfit         → all UI text inside the Rev member app
 *   - Oswald         → brand wordmark + uppercase display headlines (marketing voice)
 *   - JetBrains Mono → eyebrows, timers and numeric metrics
 *
 * The font files are loaded once in `src/app/_layout.js` via `fontAssets`.
 * Components use `<AppText variant="h2">` instead of setting fontFamily manually.
 */
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono";
import { Oswald_500Medium, Oswald_600SemiBold } from "@expo-google-fonts/oswald";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";

/** Passed to `useFonts()` in the root layout. Keys become usable fontFamily names. */
export const fontAssets = {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Oswald_500Medium,
  Oswald_600SemiBold,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
};

export const fonts = {
  regular: "Outfit_400Regular",
  medium: "Outfit_500Medium",
  semibold: "Outfit_600SemiBold",
  bold: "Outfit_700Bold",
  display: "Oswald_600SemiBold",
  displayMedium: "Oswald_500Medium",
  mono: "JetBrainsMono_500Medium",
  monoBold: "JetBrainsMono_700Bold",
};

/**
 * Text variants. Each entry is a plain style object consumed by <AppText>.
 * Sizes follow the web app's Tailwind scale (text-sm = 14, text-base = 16 …).
 */
export const textVariants = {
  // Marketing voice — uppercase Oswald ("REWORK YOUR BODY.")
  hero: { fontFamily: fonts.display, fontSize: 44, lineHeight: 48, letterSpacing: 0.5 },
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38, letterSpacing: 0.5 },

  // App headings
  h1: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
  h2: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  h3: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  title: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22 },

  // Body
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 23 },
  small: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  smallMedium: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 },
  smallStrong: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  captionStrong: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16 },

  // Technical voice — mono, uppercase, tracked ("PILLAR 01 · PHYSICAL")
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },

  // Numbers
  metric: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.8 },
  metricSmall: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.3 },
  timer: { fontFamily: fonts.monoBold, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
};
