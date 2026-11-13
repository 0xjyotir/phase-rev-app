/**
 * WeeklyCaloriesCard — calories per day vs target (dashed champagne line).
 * Data: constants/nutrition.js → weeklyCalorieTrend (static until the API exists).
 */
import { StyleSheet } from "react-native";
import { BarChart } from "@/components/charts";
import { Card, SectionHeader } from "@/components/ui";
import { weeklyCalorieTrend } from "@/constants/nutrition";
import { WEEKDAY_SHORT } from "@/lib/dates";
import { spacing } from "@/theme";

export function WeeklyCaloriesCard() {
  const todayLabel = WEEKDAY_SHORT[new Date().getDay()];
  const data = weeklyCalorieTrend.map((day) => ({ label: day.day, value: day.calories }));
  const average = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="This week"
        subtitle={`Average ${average} kcal · target ${weeklyCalorieTrend[0].target}`}
      />
      <BarChart
        data={data}
        target={weeklyCalorieTrend[0].target}
        highlightIndex={data.findIndex((d) => d.label === todayLabel)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
});
