/**
 * AppProviders — every app-wide provider, composed in one place.
 *
 * Web equivalent: phaserev/src/providers/index.tsx (AppProviders).
 *
 * Nesting (outer → inner):
 *   ThemeProvider            our design tokens + light/dark (useTheme)
 *     NavigationThemeBridge  feeds the same colors to Expo Router so screen
 *                            transitions never flash white
 *
 * Expo Router already mounts SafeAreaProvider for us.
 * Global state lives in Zustand stores (src/stores) — no provider needed.
 */
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "expo-router";
import { useMemo } from "react";
import { ThemeProvider, useTheme } from "./ThemeProvider";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <NavigationThemeBridge>{children}</NavigationThemeBridge>
    </ThemeProvider>
  );
}

function NavigationThemeBridge({ children }) {
  const { isDark, colors } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.accent,
      },
    };
  }, [isDark, colors]);

  return <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>;
}
