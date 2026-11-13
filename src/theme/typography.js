/**
 * Typography system.
 *
 * iOS uses Apple's system typefaces so every screen reads like a first-party
 * app (and scales with Dynamic Type):
 *   - SF Pro          → all UI text (headings, body, labels)
 *   - SF Pro Rounded  → metrics, timers and big numbers (`ui-rounded`)
 *   - SF Mono         → eyebrows, the Phase Rev "technical voice" (`ui-monospace`)
 *
 * Android and web keep the website's brand fonts:
 *   - Outfit         → UI text (Rev member app on the web)
 *   - JetBrains Mono → eyebrows, timers
 *
 * On every platform:
 *   - Oswald → the PHASE REV wordmark and uppercase brand headlines ("REWORK YOUR BODY.")
 *
 * Fonts are loaded once in src/app/_layout.js via `fontAssets`.
 * Components use <AppText variant="h2"> — never set fontFamily by hand.
 */
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono";
import { Oswald_500Medium, Oswald_600SemiBold } from "@expo-google-fonts/oswald";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import { Platform } from "react-native";

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

const IOS = Platform.OS === "ios";

/**
 * Font "families" as style fragments. On iOS a weight is a fontWeight on the
 * system face; on Android each weight is its own font file.
 */
const face = IOS
  ? {
      regular: { fontWeight: "400" },
      medium: { fontWeight: "500" },
      semibold: { fontWeight: "600" },
      bold: { fontWeight: "700" },
      heavy: { fontWeight: "800" },
      rounded: { fontFamily: "ui-rounded", fontWeight: "700" },
      roundedSemibold: { fontFamily: "ui-rounded", fontWeight: "600" },
      mono: { fontFamily: "ui-monospace", fontWeight: "500" },
      monoBold: { fontFamily: "ui-rounded", fontWeight: "700" },
    }
  : {
      regular: { fontFamily: "Outfit_400Regular" },
      medium: { fontFamily: "Outfit_500Medium" },
      semibold: { fontFamily: "Outfit_600SemiBold" },
      bold: { fontFamily: "Outfit_700Bold" },
      heavy: { fontFamily: "Outfit_700Bold" },
      rounded: { fontFamily: "Outfit_700Bold" },
      roundedSemibold: { fontFamily: "Outfit_600SemiBold" },
      mono: { fontFamily: "JetBrainsMono_500Medium" },
      monoBold: { fontFamily: "JetBrainsMono_700Bold" },
    };

/**
 * Plain fontFamily names for places that need a string (TextInput, native
 * header title styles). `undefined` on iOS = the system font.
 */
export const fonts = {
  regular: IOS ? undefined : "Outfit_400Regular",
  medium: IOS ? undefined : "Outfit_500Medium",
  semibold: IOS ? undefined : "Outfit_600SemiBold",
  bold: IOS ? undefined : "Outfit_700Bold",
  rounded: IOS ? "ui-rounded" : "Outfit_700Bold",
  display: "Oswald_600SemiBold",
  displayMedium: "Oswald_500Medium",
  mono: IOS ? "ui-monospace" : "JetBrainsMono_500Medium",
  monoBold: IOS ? "ui-rounded" : "JetBrainsMono_700Bold",
};

/**
 * Text variants (consumed by <AppText>). Sizes follow Apple's text styles on
 * iOS (Large Title 34 · Title 28/22/20 · Headline 17 · Body 17 · Subheadline 15
 * · Footnote 13 · Caption 12) and the website's Tailwind scale elsewhere.
 */
export const textVariants = {
  // Brand voice — uppercase Oswald ("REWORK YOUR BODY.")
  hero: { fontFamily: fonts.display, fontSize: 44, lineHeight: 48, letterSpacing: 0.4 },
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 37, letterSpacing: 0.4 },
  brandTitle: { fontFamily: fonts.display, fontSize: 24, lineHeight: 29, letterSpacing: 0.4 },

  // App headings
  largeTitle: { ...face.bold, fontSize: 34, lineHeight: 41, letterSpacing: IOS ? 0.37 : -0.6 },
  h1: { ...face.bold, fontSize: 28, lineHeight: 34, letterSpacing: IOS ? 0.36 : -0.5 },
  h2: { ...face.bold, fontSize: 22, lineHeight: 28, letterSpacing: IOS ? 0.35 : -0.3 },
  h3: { ...face.semibold, fontSize: 20, lineHeight: 25, letterSpacing: IOS ? 0.38 : -0.2 },
  title: { ...face.semibold, fontSize: 17, lineHeight: 22, letterSpacing: IOS ? -0.43 : 0 },

  // Body
  body: { ...face.regular, fontSize: IOS ? 17 : 16, lineHeight: IOS ? 22 : 23, letterSpacing: IOS ? -0.43 : 0 },
  bodyMedium: { ...face.medium, fontSize: IOS ? 17 : 16, lineHeight: IOS ? 22 : 23, letterSpacing: IOS ? -0.43 : 0 },
  bodyStrong: { ...face.semibold, fontSize: IOS ? 17 : 16, lineHeight: IOS ? 22 : 23, letterSpacing: IOS ? -0.43 : 0 },
  small: { ...face.regular, fontSize: 15, lineHeight: 20, letterSpacing: IOS ? -0.23 : 0 },
  smallMedium: { ...face.medium, fontSize: 15, lineHeight: 20, letterSpacing: IOS ? -0.23 : 0 },
  smallStrong: { ...face.semibold, fontSize: 15, lineHeight: 20, letterSpacing: IOS ? -0.23 : 0 },
  caption: { ...face.regular, fontSize: 13, lineHeight: 18, letterSpacing: IOS ? -0.08 : 0 },
  captionStrong: { ...face.semibold, fontSize: 13, lineHeight: 18, letterSpacing: IOS ? -0.08 : 0 },
  micro: { ...face.medium, fontSize: 11, lineHeight: 13, letterSpacing: IOS ? 0.06 : 0.2 },

  // Technical voice — mono, uppercase, tracked ("PILLAR 01 · PHYSICAL")
  eyebrow: {
    ...face.mono,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  // Numbers
  metricLarge: { ...face.rounded, fontSize: 40, lineHeight: 46, letterSpacing: -0.6 },
  metric: { ...face.rounded, fontSize: 28, lineHeight: 34, letterSpacing: -0.4 },
  metricSmall: { ...face.roundedSemibold, fontSize: 20, lineHeight: 25, letterSpacing: -0.2 },
  timer: { ...face.monoBold, fontSize: 40, lineHeight: 46, letterSpacing: -0.5 },
};
