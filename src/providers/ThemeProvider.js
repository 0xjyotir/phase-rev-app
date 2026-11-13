/**
 * ThemeProvider — decides light vs dark (and glass vs solid) and exposes the
 * theme via `useTheme()`.
 *
 * Resolution order for the color scheme:
 *   1. `forceScheme` prop (the brand welcome/login screens are always dark)
 *   2. User preference from Profile → Appearance (preferences-store)
 *   3. Otherwise the OS color scheme ("system")
 *
 * `glass` is true on iOS 26+ (Liquid Glass) unless the user turned on
 * Reduce Transparency — components use it to pick glass vs solid surfaces.
 *
 * Usage inside any component:
 *   const { colors, isDark, glass } = useTheme();
 *   const styles = useThemedStyles(createStyles); // see below
 */
import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useReduceTransparency } from "@/hooks/useReduceTransparency";
import { LIQUID_GLASS } from "@/lib/platform";
import { usePreferencesStore } from "@/stores/preferences-store";
import { darkTheme, fonts, lightTheme, makeShadow, radius, spacing, textVariants } from "@/theme";

const ThemeContext = createContext(null);

/**
 * @param {{ forceScheme?: "light" | "dark", children: React.ReactNode }} props
 */
export function ThemeProvider({ children, forceScheme }) {
  const systemScheme = useColorScheme();
  const appearance = usePreferencesStore((state) => state.appearance);
  const reduceTransparency = useReduceTransparency();

  const preferred = appearance === "system" ? (systemScheme ?? "dark") : appearance;
  const resolvedScheme = forceScheme ?? preferred;
  const glass = LIQUID_GLASS && !reduceTransparency;

  const value = useMemo(() => {
    const base = resolvedScheme === "light" ? lightTheme : darkTheme;
    return {
      ...base,
      glass,
      fonts,
      spacing,
      radius,
      text: textVariants,
      shadow: makeShadow(base.isDark),
    };
  }, [resolvedScheme, glass]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Returns the active theme: { name, isDark, glass, colors, fonts, spacing, radius, text, shadow }. */
export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used inside <ThemeProvider>.");
  }
  return theme;
}

/**
 * Memoized, theme-aware StyleSheet factory.
 *
 *   const createStyles = (theme) => StyleSheet.create({ card: { backgroundColor: theme.colors.surface } });
 *   const styles = useThemedStyles(createStyles);
 *
 * Declare `createStyles` at module level (outside the component) so it is stable.
 */
export function useThemedStyles(createStyles) {
  const theme = useTheme();
  return useMemo(() => createStyles(theme), [createStyles, theme]);
}
