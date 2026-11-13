/**
 * RoutinesPanel — Library → Routines.
 * Create reusable plans, run one now, or set it as today's workout.
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog } from "@/components/ui";
import { seedRoutines } from "@/constants/training-seed";
import { RoutineCard } from "@/features/workouts/components/RoutineCard";
import { useStartWorkout } from "@/features/workouts/hooks/useStartWorkout";
import { useTodayPlan } from "@/features/workouts/hooks/useTraining";
import { haptics } from "@/lib/haptics";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

const SEED_IDS = new Set(seedRoutines.map((routine) => routine.id));

export function RoutinesPanel({ onAppliedToday }) {
  const router = useRouter();
  const startWorkout = useStartWorkout();
  const routines = useTrainingStore((state) => state.routines);
  const applyRoutineAsToday = useTrainingStore((state) => state.applyRoutineAsToday);
  const deleteRoutine = useTrainingStore((state) => state.deleteRoutine);
  const { routine: todayRoutine } = useTodayPlan();
  const [pendingDelete, setPendingDelete] = useState(null);

  return (
    <View style={styles.gap}>
      <Button
        label="Create routine"
        icon="plus"
        fullWidth
        variant="soft"
        onPress={() => router.push("/routine/new")}
      />

      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          isToday={todayRoutine?.id === routine.id}
          onStart={() => startWorkout(routine.id)}
          onSetToday={() => {
            applyRoutineAsToday(routine.id);
            haptics.success();
            onAppliedToday?.();
          }}
          onDelete={SEED_IDS.has(routine.id) ? undefined : () => setPendingDelete(routine)}
        />
      ))}

      <Dialog
        visible={Boolean(pendingDelete)}
        title="Delete routine?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" will be removed. Your past workouts stay in history.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteRoutine(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
});
