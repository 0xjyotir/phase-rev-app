/**
 * ProgressBar — thin rounded bar that eases to its value.
 *
 *   <ProgressBar value={142} max={165} />
 *   <ProgressBar percent={80} color="champagne" height={6} />
 */
import { useEffect, useState } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
import { toPercent } from "@/lib/format";
import { useTheme } from "@/providers/ThemeProvider";
import { radius } from "@/theme";

export function ProgressBar({
  value,
  max,
  percent,
  color = "accent",
  track = "surfaceStrong",
  height = 8,
  style,
}) {
  const { colors } = useTheme();
  const pct = percent ?? toPercent(value, max);
  // useState initializer creates the Animated.Value exactly once per mount.
  const [anim] = useState(() => new Animated.Value(pct));

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [anim, pct]);

  return (
    <View
      style={[styles.track, { height, backgroundColor: colors[track] ?? track }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            width:
              Platform.OS === "web"
                ? `${pct}%`
                : anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }),
            backgroundColor: colors[color] ?? color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // alignSelf stretch (not width 100%) so the bar also works with `flex: 1` inside rows
  track: { alignSelf: "stretch", borderRadius: radius.pill, overflow: "hidden" },
  fill: { height: "100%", borderRadius: radius.pill },
});
