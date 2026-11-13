/**
 * Spacing, radii and elevation — the "shape" of the UI.
 *
 * Radii come from rev-app.css:
 *   --rev-radius: 24px · --rev-radius-sm: 16px · --rev-radius-pill: 999px
 */

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
  xxxl: 32,
  huge: 48,
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
};

/** Horizontal page gutter used by <Screen>. */
export const GUTTER = spacing.lg;

/** Minimum touch target (Apple HIG / Material). */
export const HIT_SIZE = 44;

/**
 * Card elevation. Mirrors `--rev-shadow` (two soft layers) as closely as
 * React Native allows: iOS uses shadow*, Android uses elevation.
 */
export function makeShadow(isDark) {
  return {
    shadowColor: "#101828",
    shadowOpacity: isDark ? 0.3 : 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: isDark ? 0 : 2,
  };
}
