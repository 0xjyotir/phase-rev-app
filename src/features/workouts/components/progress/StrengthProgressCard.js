/**
 * StrengthProgressCard — "Am I getting stronger?" for one lift.
 * Plots the best set of each session as an estimated 1RM (Epley).
 *
 *   <StrengthProgressCard history={history} exerciseId="barbell-bench-press" />
 */
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { LineChart } from "@/components/charts";
import { AppText, Card, Chip, SectionHeader } from "@/components/ui";
import { getExerciseById } from "@/constants/exercises";
import { getExerciseProgress } from "@/features/workouts/lib/training-analytics";
import { spacing } from "@/theme";

export function StrengthProgressCard({ history, exerciseId, title }) {
  const exercise = getExerciseById(exerciseId);
  const isHold = exercise?.trackingMode === "hold";
  const points = useMemo(() => getExerciseProgress(history, exerciseId, 8), [history, exerciseId]);

  if (points.length < 2) return null;

  const first = points[0].value;
  const last = points[points.length - 1].value;
  const delta = Math.round((last - first) * 10) / 10;
  const unit = isHold ? "s" : " kg";

  return (
    <Card style={styles.card}>
      <SectionHeader
        title={title ?? exercise?.name ?? "Strength"}
        subtitle={isHold ? "Best hold per session" : "Estimated 1RM per session"}
      />
      <View style={styles.headline}>
        <AppText variant="metric" tabular>
          {last}
          {unit}
        </AppText>
        <Chip
          label={`${delta >= 0 ? "+" : ""}${delta}${unit} over ${points.length} sessions`}
          tone={delta >= 0 ? "success" : "danger"}
        />
      </View>
      <LineChart data={points} height={140} formatValue={(v) => `${Math.round(v)}${unit}`} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  headline: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
});
