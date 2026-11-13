/**
 * TrainingPanel — Progress → Training: "Am I getting stronger?"
 * Order follows the web ProgressOverview: snapshot → week → volume → strength →
 * muscles → consistency → PRs → insights.
 */
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, SectionHeader } from "@/components/ui";
import { WeekStrip } from "@/features/workouts/components/WeekStrip";
import { ConsistencyCard } from "@/features/workouts/components/progress/ConsistencyCard";
import { InsightsCard } from "@/features/workouts/components/progress/InsightsCard";
import { MuscleDistributionCard } from "@/features/workouts/components/progress/MuscleDistributionCard";
import { PersonalRecordsCard } from "@/features/workouts/components/progress/PersonalRecordsCard";
import { StrengthProgressCard } from "@/features/workouts/components/progress/StrengthProgressCard";
import { TrainingSnapshotCard } from "@/features/workouts/components/progress/TrainingSnapshotCard";
import { VolumeTrendCard } from "@/features/workouts/components/progress/VolumeTrendCard";
import { useStreak, useWeekSchedule } from "@/features/workouts/hooks/useTraining";
import { getThisWeekTotals } from "@/features/workouts/lib/training-analytics";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export function TrainingPanel() {
  const history = useTrainingStore((state) => state.history);
  const weekPlan = useTrainingStore((state) => state.weekPlan);
  const week = useWeekSchedule();
  const streak = useStreak();
  const weekTotals = useMemo(() => getThisWeekTotals(history), [history]);

  return (
    <View style={styles.gap}>
      <TrainingSnapshotCard totals={weekTotals} streak={streak} />
      <Card style={styles.gap}>
        <SectionHeader title="Weekly schedule" subtitle="Push · Pull · Legs · Rest" />
        <WeekStrip days={week} />
      </Card>
      <VolumeTrendCard history={history} />
      <StrengthProgressCard
        history={history}
        exerciseId="barbell-bench-press"
        title="Bench press"
      />
      <MuscleDistributionCard history={history} />
      <ConsistencyCard history={history} weekPlan={weekPlan} />
      <PersonalRecordsCard history={history} />
      <InsightsCard history={history} />
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
});
