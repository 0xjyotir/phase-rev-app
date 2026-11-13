/**
 * AmbientBackground — the soft light field behind every main screen.
 *
 * Liquid Glass is only as beautiful as what's behind it. This paints three
 * blurred brand lights (deep teal top-left, Rev cyan right, a hint of
 * champagne low) on the page color, so glass cards, the tab bar and the
 * navigation bar refract colour as you scroll — the same ambient glow the
 * website uses behind its glass panels.
 *
 *   <AmbientBackground />               // fills its parent, fixed (tab roots)
 *   <AmbientBackground variant="top" /> // a single glow for pushed screens
 *
 * Pure SVG (no blur filters), so it costs one layer and renders identically
 * on iOS, Android and web.
 */
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, Ellipse, RadialGradient, Rect, Stop } from "react-native-svg";
import { useTheme } from "@/providers/ThemeProvider";

function Glow({ id, color }) {
  return (
    <RadialGradient id={id} cx="50%" cy="50%" r="50%">
      <Stop offset="0" stopColor={color} stopOpacity={1} />
      <Stop offset="0.55" stopColor={color} stopOpacity={0.35} />
      <Stop offset="1" stopColor={color} stopOpacity={0} />
    </RadialGradient>
  );
}

export const AmbientBackground = memo(function AmbientBackground({ variant = "full", style }) {
  const { colors } = useTheme();

  if (variant === "top") {
    return (
      <View pointerEvents="none" style={[styles.top, style]}>
        <Svg width="100%" height="100%" viewBox="0 0 400 420" preserveAspectRatio="none">
          <Defs>
            <Glow id="topA" color={colors.glowA} />
            <Glow id="topB" color={colors.glowB} />
          </Defs>
          <Ellipse cx="70" cy="150" rx="260" ry="210" fill="url(#topA)" />
          <Ellipse cx="360" cy="90" rx="200" ry="170" fill="url(#topB)" />
        </Svg>
      </View>
    );
  }

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 860" preserveAspectRatio="none">
        <Defs>
          <Glow id="ambA" color={colors.glowA} />
          <Glow id="ambB" color={colors.glowB} />
          <Glow id="ambC" color={colors.glowC} />
        </Defs>
        <Rect x="0" y="0" width="400" height="860" fill={colors.background} />
        <Ellipse cx="40" cy="120" rx="300" ry="260" fill="url(#ambA)" />
        <Ellipse cx="390" cy="380" rx="230" ry="240" fill="url(#ambB)" />
        <Ellipse cx="120" cy="780" rx="280" ry="200" fill="url(#ambC)" />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  top: { position: "absolute", top: -260, left: 0, right: 0, height: 640 },
});
