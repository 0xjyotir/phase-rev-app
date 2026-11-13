/**
 * TabStack — the navigator inside each tab (Today, Train, Fuel, Mind, Explore).
 *
 * Every tab owns a native stack so it gets a real navigation bar: a large title
 * that collapses on scroll, Liquid Glass on iOS 26, and SF Symbol bar buttons.
 * The stack's page is transparent and sits on the ambient light field, so the
 * glass cards, nav bar and tab bar all refract the same Phase Rev glow.
 *
 *   // src/app/(tabs)/(train)/_layout.js
 *   export default function TrainStack() { return <TabStack />; }
 */
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { IS_IOS } from "@/lib/platform";
import { useTheme } from "@/providers/ThemeProvider";

/**
 * @param {{ title: string }} props  the tab's title, so the very first frame of
 *   the native bar is already right (the screen refines options on mount)
 */
export function TabStack({ title }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <AmbientBackground />
      <Stack
        screenOptions={{
          title,
          contentStyle: { backgroundColor: "transparent" },
          headerBackButtonDisplayMode: "minimal",
          // iOS: native large-title bar. Android/web: the screen draws its own large title.
          headerShown: IS_IOS,
          headerLargeTitleEnabled: IS_IOS,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
