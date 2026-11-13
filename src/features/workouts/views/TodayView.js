/**
 * TodayView — Train → Today.
 *
 * "They should not need to hunt for the workout."
 *   1. Live session?   → resume card
 *   2. Training day?   → hero card + exercise list (last time vs aim for)
 *   3. Rest day?       → rest card + quick routine picks
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Divider, EmptyState, SectionHeader } from "@/components/ui";
import { ExercisePlanRow } from "@/features/workouts/components/ExercisePlanRow";
import { WorkoutHeroCard } from "@/features/workouts/components/WorkoutHeroCard";
import { useActiveSession, useTodayPlan } from "@/features/workouts/hooks/useTraining";
import { useStartWorkout } from "@/features/workouts/hooks/useStartWorkout";
import { useMember } from "@/hooks/useMember";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export function TodayView({ onOpenRoutines }) {
  const router = useRouter();
  const startWorkout = useStartWorkout();
  const { firstName } = useMember();
  const { plan, isOverride, trainedToday } = useTodayPlan();
  const { activeSession, progress } = useActiveSession();
  const routines = useTrainingStore((state) => state.routines);

  if (activeSession) {
    return (
      <Card active style={styles.gap}>
        <AppText variant="smallMedium" color="accent">
          In progress
        </AppText>
        <AppText variant="h2">{activeSession.session.name}</AppText>
        <AppText variant="body" color="textMuted">
          {progress.completedSets} of {progress.totalSets} sets logged ·{" "}
          {progress.volumeKg.toLocaleString()} kg
        </AppText>
        <Button
          label="Resume workout"
          icon="play"
          size="lg"
          fullWidth
          onPress={() => router.push("/workout/active")}
        />
      </Card>
    );
  }

  if (!plan) {
    return (
      <View style={styles.gap}>
        <EmptyState
          icon="moon"
          title="Rest day"
          message="Recovery is part of the program. Feeling good? Run any routine instead."
        />
        <SectionHeader title="Train anyway" subtitle="Pick a routine to run today" />
        {routines.map((routine) => (
          <Card
            key={routine.id}
            padding="md"
            style={styles.pickRow}
            onPress={() => startWorkout(routine.id)}
          >
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{routine.name}</AppText>
              <AppText variant="caption" color="textMuted">
                {routine.exercises.length} exercises
              </AppText>
            </View>
            <Button
              label="Start"
              size="sm"
              variant="soft"
              onPress={() => startWorkout(routine.id)}
            />
          </Card>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.gap}>
      <WorkoutHeroCard
        plan={plan}
        firstName={firstName}
        isOverride={isOverride}
        trainedToday={trainedToday}
        onStart={() => startWorkout()}
        onChangePlan={onOpenRoutines}
      />

      <Card padding="none">
        <View style={styles.listHeader}>
          <AppText variant="bodyStrong">Exercises</AppText>
          <AppText variant="small" color="textMuted">
            {"Work top to bottom. Cyan = today’s target · grey = last time."}
          </AppText>
        </View>
        {plan.exercises.map((sessionExercise) => (
          <View key={sessionExercise.id}>
            <Divider />
            <ExercisePlanRow sessionExercise={sessionExercise} />
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
  flex: { flex: 1 },
  pickRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  listHeader: { padding: spacing.lg, gap: spacing.xxs },
});
