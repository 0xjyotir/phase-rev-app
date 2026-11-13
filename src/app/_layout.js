/**
 * Root layout — the entry point of the whole app (Expo Router).
 *
 * Responsibilities:
 *   1. Keep the splash screen up until fonts are loaded AND the persisted
 *      stores have rehydrated from AsyncStorage (no flash of wrong screen).
 *   2. Mount AppProviders (theme + navigation theme).
 *   3. Declare the root Stack and the auth gate:
 *        guests  → (auth) group: /welcome, /login
 *        members → (tabs) + every member screen
 *      `Stack.Protected` swaps them automatically when the session changes,
 *      so login/logout never navigate manually.
 *
 * Route map (files under src/app):
 *   (auth)/welcome · (auth)/login
 *   (tabs)/index (Home) · train · fuel · mind · profile
 *   workout/active · workout/complete · history/[id] · exercise/[id]
 *   routine/new · assessment · breathing · coaches/index · coaches/[id] · membership
 */
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useStoresHydrated } from "@/hooks/useStoresHydrated";
import { AppProviders } from "@/providers/AppProviders";
import { useTheme } from "@/providers/ThemeProvider";
import { selectIsSignedIn, useSessionStore } from "@/stores/session-store";
import { fontAssets } from "@/theme";

preventAutoHideAsync().catch(() => {});

/** Deep links land on top of the tabs, so "back" always has somewhere to go. */
export const unstable_settings = { anchor: "(tabs)" };

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const storesHydrated = useStoresHydrated();
  const ready = (fontsLoaded || Boolean(fontError)) && storesHydrated;

  useEffect(() => {
    if (ready) hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

function RootNavigator() {
  const isSignedIn = useSessionStore(selectIsSignedIn);
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false, // every screen draws <ScreenHeader> itself
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        {/* Guests only */}
        <Stack.Protected guard={!isSignedIn} redirectTo="/">
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        </Stack.Protected>

        {/* Members only */}
        <Stack.Protected guard={isSignedIn} redirectTo="/welcome">
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen
            name="workout/active"
            options={{
              presentation: "fullScreenModal",
              gestureEnabled: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="workout/complete"
            options={{ presentation: "fullScreenModal", gestureEnabled: false, animation: "fade" }}
          />
          <Stack.Screen name="history/[id]" />
          <Stack.Screen name="exercise/[id]" />
          <Stack.Screen
            name="routine/new"
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="assessment"
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="breathing"
            options={{ presentation: "fullScreenModal", animation: "fade" }}
          />
          <Stack.Screen name="coaches/index" />
          <Stack.Screen name="coaches/[id]" />
          <Stack.Screen name="membership" />
        </Stack.Protected>

        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
