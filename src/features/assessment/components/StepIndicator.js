/**
 * StepIndicator — "Step 2 of 4 · Your target" with a segmented progress rail.
 */
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export function StepIndicator({ steps, currentIndex }) {
  const { colors } = useTheme();
  const step = steps[currentIndex];

  return (
    <View style={styles.wrapper}>
      <View style={styles.rail}>
        {steps.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.segment,
              { backgroundColor: index <= currentIndex ? colors.accent : colors.surfaceSoft },
            ]}
          />
        ))}
      </View>
      <AppText variant="eyebrow" color="accent">
        Step {currentIndex + 1} of {steps.length}
      </AppText>
      <AppText variant="h2">{step.title}</AppText>
      <AppText variant="small" color="textMuted">
        {step.description}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  rail: { flexDirection: "row", gap: spacing.xs, marginBottom: spacing.sm },
  segment: { flex: 1, height: 4, borderRadius: radius.pill },
});
