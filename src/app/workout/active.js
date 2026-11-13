/**
 * Active workout — focused logging mode (full-screen, screen stays awake).
 *
 *   header      minimise · name · options, live stopwatch, sets / volume / now, Finish
 *   exercises   current one expanded with set rows, others collapsed
 *   rest timer  floats above the bottom edge after each completed set
 *
 * Minimising keeps the session running: on iOS 26 it lives in the tab bar
 * accessory (like a mini player); elsewhere a "Resume" pill sits above the tabs.
 * "Options" opens the native action sheet on iOS.
 */
import { useKeepAwake } from "expo-keep-awake";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { ActionSheetIOS, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmbientBackground, AppText, Button, Dialog } from "@/components/ui";
import { ActiveExerciseCard } from "@/features/workouts/components/active/ActiveExerciseCard";
import { ActiveSessionHeader } from "@/features/workouts/components/active/ActiveSessionHeader";
import { RestTimerBar } from "@/features/workouts/components/active/RestTimerBar";
import { useActiveSession } from "@/features/workouts/hooks/useTraining";
import { haptics } from "@/lib/haptics";
import { IS_IOS } from "@/lib/platform";
import { useTheme } from "@/providers/ThemeProvider";
import { useTrainingStore } from "@/stores/training-store";
import { GUTTER, spacing } from "@/theme";

export default function ActiveWorkoutScreen() {
  useKeepAwake();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { activeSession, progress } = useActiveSession();
  const finishWorkout = useTrainingStore((state) => state.finishWorkout);
  const discardWorkout = useTrainingStore((state) => state.discardWorkout);
  const restActive = useTrainingStore(
    (state) => state.rest.endsAt != null || state.rest.pausedRemaining != null,
  );
  const [dialog, setDialog] = useState(null); // "finish" | "discard" | null

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

  const requestFinish = () => setDialog(progress.completedSets === 0 ? "discard" : "finish");

  const openOptions = () => {
    if (IS_IOS) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: activeSession.session.name,
          message: "Minimise to keep the timer running, or discard this session without saving.",
          options: ["Minimise workout", "Finish & save", "Discard workout", "Cancel"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 3,
          userInterfaceStyle: isDark ? "dark" : "light",
        },
        (index) => {
          if (index === 0) router.back();
          // Let the action sheet finish dismissing before the confirmation alert appears.
          if (index === 1) setTimeout(requestFinish, 350);
          if (index === 2) setTimeout(() => setDialog("discard"), 350);
        },
      );
    } else {
      setDialog("discard");
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <AmbientBackground />
      <SafeAreaView edges={["top"]}>
        <ActiveSessionHeader
          activeSession={activeSession}
          progress={progress}
          onMinimize={() => router.back()}
          onFinish={requestFinish}
          onMore={openOptions}
        />
      </SafeAreaView>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, restActive && styles.contentWithRest]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
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
          <Button label="Finish workout" icon="flag" size="lg" fullWidth onPress={requestFinish} />
        </View>
      </ScrollView>

      {restActive ? (
        <SafeAreaView edges={["bottom"]} style={styles.restDock} pointerEvents="box-none">
          <RestTimerBar />
        </SafeAreaView>
      ) : null}

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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge * 2,
    gap: spacing.md,
  },
  contentWithRest: { paddingBottom: 260 },
  finishBlock: { gap: spacing.md, marginTop: spacing.md },
  restDock: {
    position: "absolute",
    left: GUTTER,
    right: GUTTER,
    bottom: spacing.sm,
  },
});
