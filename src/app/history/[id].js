/**
 * Workout summary — a past session: totals, muscle split and every set.
 * Opened from Progress → History, Home → Recent, or "View session".
 */
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  AppText,
  Card,
  Chip,
  EmptyState,
  ProgressBar,
  Screen,
  ScreenHeader,
  SectionHeader,
  StatRow,
  StatTile,
} from "@/components/ui";
import { HistoryExerciseList } from "@/features/workouts/components/HistoryExerciseList";
import { useHistoryEntry } from "@/features/workouts/hooks/useTraining";
import { getMuscleDistribution } from "@/features/workouts/lib/training-analytics";
import { formatLongDate, formatTimeOfDay } from "@/lib/dates";
import { formatNumber } from "@/lib/format";
import { spacing } from "@/theme";

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const entry = useHistoryEntry(id);

  // Muscle split for this single session (reuse the analytics helper with a 1-entry history).
  const split = useMemo(
    () =>
      entry
        ? getMuscleDistribution([entry], { days: 100000, now: new Date(entry.performedAt) })
        : [],
    [entry],
  );

  if (!entry) {
    return (
      <Screen header={<ScreenHeader title="Workout" />}>
        <EmptyState
          icon="alert-circle"
          title="Workout not found"
          message="It may have been removed."
        />
      </Screen>
    );
  }

  return (
    <Screen header={<ScreenHeader title="Workout summary" />}>
      <View style={styles.titleBlock}>
        <AppText variant="h1">{entry.name}</AppText>
        <AppText variant="small" color="textMuted">
          {formatLongDate(entry.performedAt)} · {formatTimeOfDay(entry.performedAt)}
        </AppText>
        {entry.prs > 0 ? (
          <Chip
            icon="award"
            label={`${entry.prs} personal record${entry.prs > 1 ? "s" : ""}`}
            tone="champagne"
          />
        ) : null}
      </View>

      <Card style={styles.gapSm}>
        <StatRow>
          <StatTile label="Duration" value={entry.durationMin} unit="min" tone="soft" />
          <StatTile label="Sets" value={entry.sets} tone="soft" />
          <StatTile label="Volume" value={formatNumber(entry.volumeKg)} unit="kg" tone="soft" />
        </StatRow>
      </Card>

      {split.length ? (
        <Card style={styles.gapSm}>
          <SectionHeader title="Muscle split" />
          {split.map((row) => (
            <View key={row.id} style={styles.splitRow}>
              <AppText variant="smallMedium" style={styles.splitLabel}>
                {row.muscle}
              </AppText>
              <ProgressBar percent={row.percent} height={6} style={styles.flex} />
              <AppText variant="caption" color="textMuted" style={styles.splitValue} tabular>
                {row.percent}%
              </AppText>
            </View>
          ))}
        </Card>
      ) : null}

      <SectionHeader title="Exercises" subtitle="Tap an exercise for its history" />
      <HistoryExerciseList exercises={entry.exercises} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleBlock: { gap: spacing.xs },
  gapSm: { gap: spacing.md },
  splitRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  splitLabel: { width: 80 },
  splitValue: { width: 36, textAlign: "right" },
  flex: { flex: 1 },
});
