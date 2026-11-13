/**
 * Root layout — the entry point of the whole app (Expo Router).
 *
 * Responsibilities:
 *   1. Keep the splash screen up until fonts are loaded AND the persisted
 *      stores have rehydrated from AsyncStorage (no flash of the wrong screen).
 *   2. Mount AppProviders (theme, glass, appearance, navigation theme).
 *   3. Declare the root native Stack and the three access levels — the same
 *      model as the website (public pages · member-only pages):
 *
 *        guests only   → (auth): /welcome, /login
 *        members only  → (tabs) + everything that reads or writes member data
 *        everyone      → the public ecosystem: /discover, /ecosystem, /pillar/[id],
 *                        /coaches, /coaches/[id], /membership, /assessment
 *
 *      `Stack.Protected` swaps the groups when the session changes, so login and
 *      logout never navigate manually.
 *
 * Presentation (iOS-native):
 *   push            details (exercise, history, coach, pillar, profile…)
 *   modal (sheet)   assessment, routine builder, journal entry, reframe, meal, coach request
 *   formSheet       wellbeing check (half-height sheet with grabber)
 *   fullScreenModal live workout, session complete, breathing, guided session, reaction drill
 */
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useDayRollover } from "@/hooks/useDayRollover";
import { useStoresHydrated } from "@/hooks/useStoresHydrated";
import { IS_IOS } from "@/lib/platform";
import { AppProviders } from "@/providers/AppProviders";
import { useTheme } from "@/providers/ThemeProvider";
import { selectIsSignedIn, useSessionStore } from "@/stores/session-store";
import { fontAssets, fonts } from "@/theme";

preventAutoHideAsync().catch(() => {});

/** Deep links land on top of the tabs, so "back" always has somewhere to go. */
export const unstable_settings = { anchor: "(tabs)" };

const SHEET = { presentation: "modal", animation: IS_IOS ? undefined : "slide_from_bottom" };
const FOCUS = {
  presentation: "fullScreenModal",
  headerShown: false,
  animation: IS_IOS ? undefined : "fade",
};

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
  useDayRollover();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: true, // native navigation bar; full-bleed screens opt out below
          contentStyle: { backgroundColor: colors.background },
          headerBackButtonDisplayMode: "minimal",
          headerTitleStyle: { fontFamily: fonts.semibold, color: colors.text },
          headerLargeTitleStyle: { fontFamily: fonts.bold, color: colors.text },
          animation: IS_IOS ? undefined : "slide_from_right",
        }}
      >
        {/* Guests only */}
        <Stack.Protected guard={!isSignedIn} redirectTo="/">
          <Stack.Screen name="(auth)" options={{ headerShown: false, animation: "fade" }} />
        </Stack.Protected>

        {/* Members only */}
        <Stack.Protected guard={isSignedIn} redirectTo="/welcome">
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "fade" }} />
          <Stack.Screen name="workout/active" options={{ ...FOCUS, gestureEnabled: false }} />
          <Stack.Screen name="workout/complete" options={{ ...FOCUS, gestureEnabled: false }} />
          <Stack.Screen name="history/[id]" />
          <Stack.Screen name="exercise/[id]" />
          <Stack.Screen name="routine/new" options={SHEET} />
          <Stack.Screen name="breathing" options={FOCUS} />
          <Stack.Screen name="session/[id]" options={FOCUS} />
          <Stack.Screen name="reaction" options={FOCUS} />
          <Stack.Screen name="journal/index" />
          <Stack.Screen name="journal/new" options={SHEET} />
          <Stack.Screen name="reframe" options={SHEET} />
          <Stack.Screen
            name="wellbeing"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.75, 1],
              sheetGrabberVisible: true,
              sheetCornerRadius: 28,
            }}
          />
          <Stack.Screen name="meal/new" options={SHEET} />
          <Stack.Screen name="coaches/request" options={SHEET} />
          <Stack.Screen name="profile" />
        </Stack.Protected>

        {/* Everyone — the public ecosystem (website marketing pages) */}
        <Stack.Screen name="discover" />
        <Stack.Screen name="ecosystem" />
        <Stack.Screen name="pillar/[id]" />
        <Stack.Screen name="coaches/index" />
        <Stack.Screen name="coaches/[id]" />
        <Stack.Screen name="membership" />
        <Stack.Screen name="assessment" options={SHEET} />
        <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
      </Stack>
    </>
  );
}
