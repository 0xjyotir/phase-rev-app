/**
 * TrainingSnapshotCard — "This week" numbers (web: TrainingSnapshot).
 */
import { StyleSheet } from "react-native";
import { Card, SectionHeader, StatRow, StatTile } from "@/components/ui";
import { formatVolume } from "@/lib/format";
import { spacing } from "@/theme";

export function TrainingSnapshotCard({ totals, streak }) {
  return (
    <Card style={styles.card}>
      <SectionHeader title="This week" subtitle="Monday to today" />
      <StatRow>
        <StatTile label="Workouts" value={totals.workouts} tone="soft" />
        <StatTile label="Sets" value={totals.sets} tone="soft" />
        <StatTile label="Streak" value={streak} unit="days" tone="soft" valueColor="accentStrong" />
      </StatRow>
      <StatRow>
        <StatTile label="Volume" value={formatVolume(totals.volumeKg)} tone="soft" />
        <StatTile label="PRs" value={`+${totals.prs}`} tone="soft" valueColor="success" />
      </StatRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
});
