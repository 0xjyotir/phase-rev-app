/**
 * ThemeProvider — decides light vs dark and exposes the theme via `useTheme()`.
 *
 * Resolution order:
 *   1. User preference from Profile → Appearance (preferences-store)
 *   2. Otherwise the OS color scheme ("system")
 *
 * Usage inside any component:
 *   const { colors, isDark } = useTheme();
 *   const styles = useThemedStyles(createStyles); // see below
 */
import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { usePreferencesStore } from "@/stores/preferences-store";
import { darkTheme, fonts, lightTheme, makeShadow, radius, spacing, textVariants } from "@/theme";

const ThemeContext = createContext(null);

/**
 * @param {{ forceScheme?: "light" | "dark" }} props
 *   forceScheme — pin a subtree to one scheme. The (auth) screens use
 *   `forceScheme="dark"` so the brand welcome/login always look like the website.
 */
export function ThemeProvider({ children, forceScheme }) {
  const systemScheme = useColorScheme();
  const appearance = usePreferencesStore((state) => state.appearance);

  const preferred = appearance === "system" ? (systemScheme ?? "dark") : appearance;
  const resolvedScheme = forceScheme ?? preferred;

  const value = useMemo(() => {
    const base = resolvedScheme === "light" ? lightTheme : darkTheme;
    return {
      ...base,
      fonts,
      spacing,
      radius,
      text: textVariants,
      shadow: makeShadow(base.isDark),
    };
  }, [resolvedScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Returns the active theme: { name, isDark, colors, fonts, spacing, radius, text, shadow }. */
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
