/**
 * VolumeTrendCard — total volume headline + 7D / 30D / 90D trend chart.
 * Web: ProgressOverview ("Strength & volume" + "Volume trend").
 */
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LineChart } from "@/components/charts";
import { AppText, Card, SectionHeader, SegmentedControl, StatRow, StatTile } from "@/components/ui";
import {
  getTrainingTotals,
  getVolumeSeries,
  VOLUME_RANGES,
} from "@/features/workouts/lib/training-analytics";
import { formatMinutes, formatNumber, formatVolume } from "@/lib/format";
import { spacing } from "@/theme";

const RANGE_DAYS = { "7D": 7, "30D": 30, "90D": 90 };

export function VolumeTrendCard({ history }) {
  const [range, setRange] = useState("30D");

  const series = useMemo(() => getVolumeSeries(history, range), [history, range]);
  const totals = useMemo(
    () => getTrainingTotals(history, { days: RANGE_DAYS[range] }),
    [history, range],
  );

  return (
    <Card style={styles.card}>
      <SectionHeader title="Strength & volume" subtitle="How much you've lifted recently" />

      <View>
        <AppText variant="caption" color="textMuted">
          Total volume · last {RANGE_DAYS[range]} days
        </AppText>
        <AppText variant="metric" tabular>
          {formatVolume(totals.volumeKg)}
        </AppText>
      </View>

      <StatRow>
        <StatTile label="Workouts" value={totals.workouts} tone="soft" />
        <StatTile label="Sets" value={totals.sets} tone="soft" />
        <StatTile label="Time" value={formatMinutes(totals.minutes)} tone="soft" />
      </StatRow>

      <SegmentedControl
        options={VOLUME_RANGES.map((id) => ({ id, label: id }))}
        value={range}
        onChange={setRange}
        size="sm"
      />

      <LineChart data={series} height={160} formatValue={(v) => `${formatNumber(v / 1000, 1)}t`} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
});
