/**
 * Stepper — − value + control for small integers (sets, days/week, rest).
 *
 *   <Stepper value={sets} min={1} max={8} onChange={setSets} />
 *   <Stepper value={rest} step={15} format={formatRestLabel} onChange={setRest} />
 */
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { IconButton } from "./IconButton";

export function Stepper({ value, onChange, min = 0, max = 99, step = 1, format = String, label }) {
  const { colors } = useTheme();
  const clamp = (next) => Math.max(min, Math.min(max, next));

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="caption" color="textMuted">
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.control,
          { backgroundColor: colors.surfaceSoft, borderColor: colors.border },
        ]}
      >
        <IconButton
          icon="minus"
          variant="ghost"
          size={34}
          iconSize={16}
          disabled={value <= min}
          onPress={() => onChange(clamp(value - step))}
          accessibilityLabel={`Decrease ${label ?? "value"}`}
        />
        <AppText variant="smallStrong" style={styles.value} tabular>
          {format(value)}
        </AppText>
        <IconButton
          icon="plus"
          variant="ghost"
          size={34}
          iconSize={16}
          disabled={value >= max}
          onPress={() => onChange(clamp(value + step))}
          accessibilityLabel={`Increase ${label ?? "value"}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xxs },
  control: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.xxs,
  },
  value: { minWidth: 40, textAlign: "center" },
});
