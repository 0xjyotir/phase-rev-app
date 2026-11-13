/**
 * MoodWeekCard — the last 7 days of mood check-ins as bars (Great = 5 … Stressed = 1).
 */
import { StyleSheet } from "react-native";
import { BarChart } from "@/components/charts";
import { AppText, Card, SectionHeader } from "@/components/ui";
import { getMoodById } from "@/constants/mental";
import { addDays, toDateKey, WEEKDAY_SHORT } from "@/lib/dates";
import { spacing } from "@/theme";

export function MoodWeekCard({ entries }) {
  const byDate = Object.fromEntries(entries.map((entry) => [entry.date, entry]));
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i - 6));
  const data = days.map((date) => ({
    label: WEEKDAY_SHORT[date.getDay()],
    value: getMoodById(byDate[toDateKey(date)]?.moodId)?.score ?? 0,
  }));
  const logged = data.filter((d) => d.value > 0);
  const average = logged.length ? logged.reduce((sum, d) => sum + d.value, 0) / logged.length : 0;

  return (
    <Card style={styles.card}>
      <SectionHeader title="Your week" subtitle={`${logged.length} of 7 days checked in`} />
      <BarChart data={data} height={100} highlightIndex={6} />
      <AppText variant="caption" color="textMuted">
        Average mood {average ? average.toFixed(1) : "—"} / 5
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
});
