/**
 * Spacing, radii and elevation — the "shape" of the UI.
 *
 * A 4-pt grid with generous section rhythm: cards breathe (20 pt padding),
 * sections are separated by 28 pt, and the page gutter is 20 pt on iOS —
 * the same margins Apple uses for inset-grouped lists on modern iPhones.
 *
 * Radii are "continuous" on iOS (see borderCurve in components): 26 pt cards
 * sit concentric with the 55 pt screen corners of Face ID iPhones.
 */
import { Platform } from "react-native";

/** 4-point spacing scale. Use `spacing.md` etc. instead of magic numbers. */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 28,
  xxxl: 32,
  huge: 48,
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 32,
  pill: 999,
};

/** Horizontal page gutter used by <Screen>. */
export const GUTTER = Platform.OS === "ios" ? 20 : 16;

/** Inner padding of a standard card. */
export const CARD_PADDING = 20;

/** Minimum touch target (Apple HIG / Material). */
export const HIT_SIZE = 44;

/**
 * Card elevation for opaque (non-glass) surfaces. Glass doesn't need a
 * drop shadow — it reads depth from what's behind it.
 */
export function makeShadow(isDark) {
  return {
    shadowColor: "#0B1220",
    shadowOpacity: isDark ? 0.32 : 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: isDark ? 0 : 2,
  };
}
