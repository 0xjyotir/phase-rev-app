/**
 * ProgressRing — circular progress (web: MacroVizSection SVG rings).
 *
 *   <ProgressRing percent={84} size={88} label="Protein" value="142g" />
 *   <ProgressRing percent={60} size={180} strokeWidth={14}>{custom center}</ProgressRing>
 */
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "@/providers/ThemeProvider";
import { spacing } from "@/theme";
import { AppText } from "@/components/ui/AppText";

export function ProgressRing({
  percent,
  size = 88,
  strokeWidth = 8,
  color = "accent",
  track = "surfaceStrong",
  value,
  label,
  showValue = true,
  children,
}) {
  const { colors } = useTheme();
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);

  return (
    <View style={styles.wrapper}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={colors[track] ?? track}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={colors[color] ?? color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            // Start at 12 o'clock instead of 3 o'clock
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        {children || showValue ? (
          <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="box-none">
            {children ?? (
              <AppText variant="smallStrong" tabular>
                {value ?? `${Math.round(clamped)}%`}
              </AppText>
            )}
          </View>
        ) : null}
      </View>
      {label ? (
        <AppText variant="caption" color="textMuted">
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", gap: spacing.xs },
  center: { alignItems: "center", justifyContent: "center" },
});
