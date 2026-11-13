/**
 * MeasurementsCard — chest / waist / arms / thighs with change since last check-in.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, SectionHeader } from "@/components/ui";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export function MeasurementsCard() {
  const measurements = useTrainingStore((state) => state.measurements);

  return (
    <Card style={styles.card}>
      <SectionHeader title="Measurements" subtitle="Change since last month" />
      <View style={styles.grid}>
        {measurements.map((item) => (
          <Card key={item.id} tone="soft" padding="md" style={styles.cell}>
            <AppText variant="caption" color="textMuted">
              {item.label}
            </AppText>
            <AppText variant="metricSmall" tabular>
              {item.value} {item.unit}
            </AppText>
            <AppText
              variant="captionStrong"
              color={item.delta < 0 ? "success" : "accentStrong"}
              tabular
            >
              {item.delta > 0 ? "+" : ""}
              {item.delta.toFixed(1)} {item.unit}
            </AppText>
          </Card>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  cell: { width: "48.5%", gap: 2 },
});
