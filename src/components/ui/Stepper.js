/**
 * Stepper — − value + control for small integers (sets, days/week, rest).
 *
 *   <Stepper value={sets} min={1} max={8} onChange={setSets} />
 *   <Stepper value={rest} step={15} format={formatRestLabel} onChange={setRest} />
 */
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export function Stepper({ value, onChange, min = 0, max = 99, step = 1, format = String, label }) {
  const { colors } = useTheme();
  const clamp = (next) => Math.max(min, Math.min(max, next));

  const button = (icon, disabled, next, a11y) => (
    <Pressable
      onPress={() => {
        haptics.select();
        onChange(clamp(next));
      }}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [styles.button, (pressed || disabled) && { opacity: disabled ? 0.3 : 0.6 }]}
    >
      <Icon name={icon} size={14} color="text" weight="bold" />
    </Pressable>
  );

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="captionStrong" color="textMuted">
          {label}
        </AppText>
      ) : null}
      <View style={[styles.control, { backgroundColor: colors.surfaceSoft }]}>
        {button("minus", value <= min, value - step, `Decrease ${label ?? "value"}`)}
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <AppText
          variant="smallStrong"
          style={styles.value}
          tabular
          accessibilityLabel={`${label ?? "Value"} ${format(value)}`}
        >
          {format(value)}
        </AppText>
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        {button("plus", value >= max, value + step, `Increase ${label ?? "value"}`)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs + 2 },
  control: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radius.sm,
    borderCurve: "continuous",
    height: 36,
  },
  button: { width: 44, height: 36, alignItems: "center", justifyContent: "center" },
  divider: { width: StyleSheet.hairlineWidth, height: 18 },
  value: { minWidth: 48, textAlign: "center" },
});
