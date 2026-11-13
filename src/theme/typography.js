/**
 * Typography system — one voice on every platform.
 *
 *   - Instrument Sans → all UI text, numbers and timers. A calm, slightly
 *                       editorial grotesk with tabular figures (SIL Open Font
 *                       License, free to ship inside an app).
 *   - Oswald          → the PHASE REV wordmark and uppercase brand headlines
 *                       ("REWORK YOUR BODY."), same as the website.
 *   - JetBrains Mono  → eyebrows, the website's "technical voice"
 *                       ("PILLAR 01 · PHYSICAL").
 *
 * Native chrome picks the same faces up: navigation-bar titles and large
 * titles, header button labels, tab bar labels and segmented controls all read
 * `fonts.*` below. System alerts and action sheets stay in SF, as Apple intends.
 *
 * Fonts are loaded once in src/app/_layout.js via `fontAssets`.
 * Components use <AppText variant="h2"> — never set fontFamily by hand.
 * To try a different family, change the imports + `FAMILY` below; nothing else.
 */
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from "@expo-google-fonts/instrument-sans";
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono";
import { Oswald_500Medium, Oswald_600SemiBold } from "@expo-google-fonts/oswald";
import { Platform } from "react-native";

/** Passed to `useFonts()` in the root layout. Keys become usable fontFamily names. */
export const fontAssets = {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
  Oswald_500Medium,
  Oswald_600SemiBold,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
};

const IOS = Platform.OS === "ios";

const FAMILY = {
  regular: "InstrumentSans_400Regular",
  medium: "InstrumentSans_500Medium",
  semibold: "InstrumentSans_600SemiBold",
  bold: "InstrumentSans_700Bold",
};

/**
 * Plain fontFamily names for places that need a string (TextInput, native
 * header and tab bar title styles, segmented controls). Each weight is its own
 * file, so never combine these with `fontWeight`.
 */
export const fonts = {
  regular: FAMILY.regular,
  medium: FAMILY.medium,
  semibold: FAMILY.semibold,
  bold: FAMILY.bold,
  rounded: FAMILY.bold, // big numbers (kept as a name so older call sites keep working)
  display: "Oswald_600SemiBold",
  displayMedium: "Oswald_500Medium",
  mono: "JetBrainsMono_500Medium",
  monoBold: "JetBrainsMono_700Bold",
};

/**
 * PostScript names, for the rare native control that looks fonts up with
 * `UIFont(name:)` directly (the iOS segmented control) instead of React
 * Native's font manager, which understands the names in `fonts`.
 */
export const postScriptFonts = {
  regular: "InstrumentSans-Regular",
  medium: "InstrumentSans-Medium",
  semibold: "InstrumentSans-SemiBold",
  bold: "InstrumentSans-Bold",
};

const TABULAR = { fontVariant: ["tabular-nums"] };

/** Style fragments per weight. */
const face = {
  regular: { fontFamily: fonts.regular },
  medium: { fontFamily: fonts.medium },
  semibold: { fontFamily: fonts.semibold },
  bold: { fontFamily: fonts.bold },
  number: { fontFamily: fonts.bold, ...TABULAR },
  numberSemibold: { fontFamily: fonts.semibold, ...TABULAR },
  mono: { fontFamily: fonts.mono },
};

/**
 * Text variants (consumed by <AppText>). Sizes follow Apple's text styles on
 * iOS (Large Title 34 · Title 28/22/20 · Headline 17 · Body 17 · Subheadline 15
 * · Footnote 13 · Caption 11) and the Material scale on Android (body 16).
 * Instrument Sans is set a touch tighter at display sizes and neutral in body.
 */
const BODY_SIZE = IOS ? 17 : 16;
const BODY_LINE = 23;

export const textVariants = {
  // Brand voice — uppercase Oswald ("REWORK YOUR BODY.")
  hero: { fontFamily: fonts.display, fontSize: 44, lineHeight: 48, letterSpacing: 0.4 },
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 37, letterSpacing: 0.4 },
  brandTitle: { fontFamily: fonts.display, fontSize: 24, lineHeight: 29, letterSpacing: 0.4 },

  // App headings
  largeTitle: { ...face.bold, fontSize: 34, lineHeight: 41, letterSpacing: -0.7 },
  h1: { ...face.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.55 },
  h2: { ...face.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.35 },
  h3: { ...face.semibold, fontSize: 20, lineHeight: 25, letterSpacing: -0.25 },
  title: { ...face.semibold, fontSize: 17, lineHeight: 22, letterSpacing: -0.15 },

  // Body
  body: { ...face.regular, fontSize: BODY_SIZE, lineHeight: BODY_LINE, letterSpacing: -0.1 },
  bodyMedium: { ...face.medium, fontSize: BODY_SIZE, lineHeight: BODY_LINE, letterSpacing: -0.1 },
  bodyStrong: {
    ...face.semibold,
    fontSize: BODY_SIZE,
    lineHeight: BODY_LINE,
    letterSpacing: -0.1,
  },
  small: { ...face.regular, fontSize: 15, lineHeight: 20, letterSpacing: -0.05 },
  smallMedium: { ...face.medium, fontSize: 15, lineHeight: 20, letterSpacing: -0.05 },
  smallStrong: { ...face.semibold, fontSize: 15, lineHeight: 20, letterSpacing: -0.05 },
  caption: { ...face.regular, fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  captionStrong: { ...face.semibold, fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  micro: { ...face.medium, fontSize: 11, lineHeight: 14, letterSpacing: 0.1 },

  // Technical voice — mono, uppercase, tracked ("PILLAR 01 · PHYSICAL")
  eyebrow: {
    ...face.mono,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  // Numbers — tabular so counters and timers never jitter
  metricLarge: { ...face.number, fontSize: 40, lineHeight: 46, letterSpacing: -1 },
  metric: { ...face.number, fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  metricSmall: { ...face.numberSemibold, fontSize: 20, lineHeight: 25, letterSpacing: -0.3 },
  timer: { ...face.number, fontSize: 40, lineHeight: 46, letterSpacing: -0.8 },
};
