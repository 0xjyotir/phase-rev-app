/**
 * Active workout — focused logging mode (full-screen modal).
 *
 *   header      stopwatch, sets, volume, current exercise, Finish
 *   rest timer  appears after each completed set (sticky at the bottom)
 *   exercises   current one expanded with set rows, others collapsed
 *
 * Minimising (chevron-down) keeps the session running; the tab bar shows a
 * "Resume" pill. The screen stays awake while this screen is open.
 */
import { useKeepAwake } from "expo-keep-awake";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Dialog, Screen } from "@/components/ui";
import { ActiveExerciseCard } from "@/features/workouts/components/active/ActiveExerciseCard";
import { ActiveSessionHeader } from "@/features/workouts/components/active/ActiveSessionHeader";
import { RestTimerBar } from "@/features/workouts/components/active/RestTimerBar";
import { useActiveSession } from "@/features/workouts/hooks/useTraining";
import { haptics } from "@/lib/haptics";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export default function ActiveWorkoutScreen() {
  useKeepAwake();
  const router = useRouter();
  const { activeSession, progress } = useActiveSession();
  const finishWorkout = useTrainingStore((state) => state.finishWorkout);
  const discardWorkout = useTrainingStore((state) => state.discardWorkout);
  const restActive = useTrainingStore(
    (state) => state.rest.endsAt != null || state.rest.pausedRemaining != null,
  );
  const [dialog, setDialog] = useState(null); // "finish" | "options" | "discard" | null

  if (!activeSession) return <Redirect href="/train" />;

  const remainingSets = progress.totalSets - progress.completedSets;

  const handleFinish = () => {
    setDialog(null);
    const summary = finishWorkout();
    haptics.success();
    if (summary && summary.sets > 0) router.replace("/workout/complete");
    else router.back();
  };

  const handleDiscard = () => {
    setDialog(null);
    discardWorkout();
    router.back();
  };

  return (
    <Screen
      edges={["top", "bottom"]}
      gap={spacing.md}
      header={
        <ActiveSessionHeader
          activeSession={activeSession}
          progress={progress}
          onMinimize={() => router.back()}
          onFinish={() => setDialog(progress.completedSets === 0 ? "discard" : "finish")}
          onMore={() => setDialog("options")}
        />
      }
      footer={restActive ? <RestTimerBar /> : null}
      contentStyle={styles.content}
    >
      {activeSession.session.exercises.map((sessionExercise) => (
        <ActiveExerciseCard
          key={sessionExercise.id}
          sessionExercise={sessionExercise}
          expanded={activeSession.currentExerciseId === sessionExercise.id}
        />
      ))}

      <View style={styles.finishBlock}>
        <AppText variant="small" color="textMuted" align="center">
          {remainingSets === 0
            ? "Every set logged — great session."
            : `${remainingSets} sets left in this plan.`}
        </AppText>
        <Button
          label="Finish workout"
          icon="flag"
          size="lg"
          fullWidth
          onPress={() => setDialog(progress.completedSets === 0 ? "discard" : "finish")}
        />
      </View>

      <Dialog
        visible={dialog === "finish"}
        title="Finish workout?"
        message={
          remainingSets > 0
            ? `${progress.completedSets} of ${progress.totalSets} sets logged. Unticked sets won't be saved.`
            : "All sets logged. Nice work."
        }
        confirmLabel="Finish & save"
        cancelLabel="Keep training"
        onConfirm={handleFinish}
        onCancel={() => setDialog(null)}
      />

      <Dialog
        visible={dialog === "options"}
        title="Workout options"
        message="Minimise to keep the timer running, or discard this session without saving."
        confirmLabel="Discard workout"
        cancelLabel="Close"
        destructive
        onConfirm={() => setDialog("discard")}
        onCancel={() => setDialog(null)}
      />

      <Dialog
        visible={dialog === "discard"}
        title="Discard this workout?"
        message={
          progress.completedSets === 0
            ? "No sets are logged yet, so there's nothing to save."
            : "Everything logged in this session will be lost."
        }
        confirmLabel="Discard"
        cancelLabel="Keep training"
        destructive
        onConfirm={handleDiscard}
        onCancel={() => setDialog(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md },
  finishBlock: { gap: spacing.md, marginTop: spacing.md },
});
