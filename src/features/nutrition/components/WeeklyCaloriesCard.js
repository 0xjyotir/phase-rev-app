/**
 * WeeklyCaloriesCard — calories per day (last 7 days) against the target line.
 * Live: built from the member's archived days + today (see lib/nutrition-day.js).
 */
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { BarChart } from "@/components/charts";
import { AppText, Card, StatRow, StatTile } from "@/components/ui";
import { getNutritionScore, getWeekCalories } from "@/features/nutrition/lib/nutrition-day";
import { formatNumber } from "@/lib/format";
import { useTheme } from "@/providers/ThemeProvider";
import { spacing } from "@/theme";

export function WeeklyCaloriesCard({ nutrition }) {
  const { colors } = useTheme();
  const week = useMemo(() => getWeekCalories(nutrition), [nutrition]);
  const score = useMemo(() => getNutritionScore(nutrition), [nutrition]);
  const logged = week.filter((day) => day.value > 0 && !day.isToday);
  const average = logged.length
    ? Math.round(logged.reduce((sum, day) => sum + day.value, 0) / logged.length)
    : null;
  const target = nutrition.calories.target;

  return (
    <Card style={styles.card}>
      <StatRow>
        <StatTile label="Daily average" value={average ? formatNumber(average) : "—"} unit="kcal" tone="soft" />
        <StatTile label="Target" value={formatNumber(target)} unit="kcal" tone="soft" />
        <StatTile
          label="Score"
          value={score == null ? "—" : score}
          unit={score == null ? "" : "%"}
          tone="soft"
          valueColor="accentStrong"
        />
      </StatRow>
      <BarChart
        data={week.map((day) => ({ label: day.label, value: day.value }))}
        target={target}
        highlightIndex={6}
      />
      <View style={styles.legend}>
        <View style={[styles.legendLine, { borderColor: colors.champagne }]} />
        <AppText variant="caption" color="textMuted">
          Dashed line = your {formatNumber(target)} kcal target
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  legend: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  legendLine: { width: 18, borderTopWidth: 1.5, borderStyle: "dashed" },
});
