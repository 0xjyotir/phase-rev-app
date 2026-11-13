/**
 * (auth) group — screens for signed-out visitors.
 *
 * Always rendered in the dark brand theme (like the website's /login page),
 * regardless of the user's appearance setting.
 */
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { palette } from "@/theme";

export default function AuthLayout() {
  return (
    <ThemeProvider forceScheme="dark">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.black },
          animation: "fade",
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" options={{ animation: "slide_from_bottom" }} />
      </Stack>
    </ThemeProvider>
  );
}
