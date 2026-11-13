/**
 * ConsistencyCard — monthly heatmap + current / best streak.
 * Web: the consistency calendar in ProgressOverview (`.phys-heatmap`).
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Heatmap } from "@/components/charts";
import { Card, SectionHeader, StatRow, StatTile } from "@/components/ui";
import { getConsistency } from "@/features/workouts/lib/training-analytics";
import { spacing } from "@/theme";

export function ConsistencyCard({ history, weekPlan }) {
  const consistency = useMemo(() => getConsistency({ history, weekPlan }), [history, weekPlan]);

  return (
    <Card style={styles.card}>
      <SectionHeader title="Consistency" subtitle={consistency.monthLabel} />
      <StatRow>
        <StatTile
          label="Streak"
          value={consistency.currentStreak}
          unit="days"
          tone="soft"
          valueColor="accentStrong"
        />
        <StatTile label="Best" value={consistency.bestStreak} unit="days" tone="soft" />
        <StatTile
          label="This month"
          value={consistency.workoutsThisMonth}
          unit="sessions"
          tone="soft"
        />
      </StatRow>
      <Heatmap days={consistency.days} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
});
