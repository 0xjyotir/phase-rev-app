/**
 * AppProviders — every app-wide provider, composed in one place.
 *
 * Web equivalent: phaserev/src/providers/index.tsx (AppProviders).
 *
 * Nesting (outer → inner):
 *   ThemeProvider            design tokens + light/dark + glass (useTheme)
 *     AppearanceSync         pushes the in-app appearance choice to the OS window,
 *                            so native chrome (Liquid Glass tab bar, nav bars,
 *                            alerts, keyboards) matches the app, not just our views
 *     NavigationThemeBridge  feeds the same colors to Expo Router so screen
 *                            transitions and tab switches never flash white
 *
 * Expo Router already mounts SafeAreaProvider for us.
 * Global state lives in Zustand stores (src/stores) — no provider needed.
 */
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "expo-router";
import { useEffect, useMemo } from "react";
import { Appearance, Platform } from "react-native";
import { usePreferencesStore } from "@/stores/preferences-store";
import { ThemeProvider, useTheme } from "./ThemeProvider";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AppearanceSync />
      <NavigationThemeBridge>{children}</NavigationThemeBridge>
    </ThemeProvider>
  );
}

function AppearanceSync() {
  const appearance = usePreferencesStore((state) => state.appearance);

  useEffect(() => {
    if (Platform.OS === "web") return;
    try {
      Appearance.setColorScheme(appearance === "system" ? "unspecified" : appearance);
    } catch {
      // Older runtimes without an override API simply follow the system.
    }
  }, [appearance]);

  return null;
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
        card: colors.backgroundElevated,
        text: colors.text,
        border: colors.separator,
        notification: colors.accent,
      },
    };
  }, [isDark, colors]);

  return <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>;
}
