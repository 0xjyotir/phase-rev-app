/**
 * MuscleDistributionCard — which muscles get the most / least work (last 30 days).
 * Web: MuscleDistribution.
 */
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Card, ProgressBar, SectionHeader } from "@/components/ui";
import { getMuscleDistribution } from "@/features/workouts/lib/training-analytics";
import { spacing } from "@/theme";

export function MuscleDistributionCard({ history }) {
  const rows = useMemo(() => getMuscleDistribution(history, { days: 30 }), [history]);
  if (!rows.length) return null;

  const leastTrained = rows[rows.length - 1];

  return (
    <Card style={styles.card}>
      <SectionHeader title="Muscle distribution" subtitle="Share of sets · last 30 days" />
      {rows.map((row) => (
        <View key={row.id} style={styles.row}>
          <View style={styles.labels}>
            <AppText variant="smallMedium">{row.muscle}</AppText>
            <AppText variant="caption" color="textMuted" tabular>
              {row.percent}% · {row.sets} sets
            </AppText>
          </View>
          <ProgressBar
            percent={row.percent}
            height={6}
            color={row.id === leastTrained.id ? "champagne" : "accent"}
          />
        </View>
      ))}
      <AppText variant="caption" color="textMuted">
        Least trained:{" "}
        <AppText variant="captionStrong" color="champagne">
          {leastTrained.muscle}
        </AppText>
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { gap: spacing.xs },
  labels: { flexDirection: "row", justifyContent: "space-between" },
});
