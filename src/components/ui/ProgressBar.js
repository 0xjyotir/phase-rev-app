/**
 * ProgressBar — thin rounded bar (web: MacroBar / .phys-skill-track).
 *
 *   <ProgressBar value={142} max={165} />
 *   <ProgressBar percent={80} color="champagne" height={6} />
 */
import { StyleSheet, View } from "react-native";
import { toPercent } from "@/lib/format";
import { useTheme } from "@/providers/ThemeProvider";
import { radius } from "@/theme";

export function ProgressBar({
  value,
  max,
  percent,
  color = "accent",
  track = "surfaceSoft",
  height = 8,
  style,
}) {
  const { colors } = useTheme();
  const pct = percent ?? toPercent(value, max);

  return (
    <View
      style={[styles.track, { height, backgroundColor: colors[track] ?? track }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: pct }}
    >
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: colors[color] ?? color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  // alignSelf stretch (not width 100%) so the bar also works with `flex: 1` inside rows
  track: { alignSelf: "stretch", borderRadius: radius.pill, overflow: "hidden" },
  fill: { height: "100%", borderRadius: radius.pill },
});
