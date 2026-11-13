/**
 * RestTimerBar — the rest countdown that appears after every completed set.
 * Controls (web RestTimer): −30 s · +30 s · Pause/Resume · Skip.
 *
 * Time is computed from a stored end timestamp (training-store → rest), so it
 * stays correct if the phone is locked or the app is backgrounded. When it
 * reaches zero: warning haptic + the bar hides itself.
 */
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, ProgressBar } from "@/components/ui";
import { useNow } from "@/hooks/useNow";
import { formatClock } from "@/lib/format";
import { haptics } from "@/lib/haptics";
import { usePreferencesStore } from "@/stores/preferences-store";
import { selectRestRemaining, useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export function RestTimerBar() {
  const rest = useTrainingStore((state) => state.rest);
  const adjustRest = useTrainingStore((state) => state.adjustRest);
  const toggleRestPause = useTrainingStore((state) => state.toggleRestPause);
  const skipRest = useTrainingStore((state) => state.skipRest);
  const step = usePreferencesStore((state) => state.restStepSeconds);

  const isRunning = rest.endsAt != null;
  const isPaused = rest.pausedRemaining != null;
  const now = useNow(250, isRunning);
  const remaining = selectRestRemaining(rest, now);
  const notifiedFor = useRef(null);

  // Finished → buzz once, then clear the timer.
  useEffect(() => {
    if (isRunning && remaining === 0 && notifiedFor.current !== rest.endsAt) {
      notifiedFor.current = rest.endsAt;
      haptics.warning();
      skipRest();
    }
  }, [isRunning, remaining, rest.endsAt, skipRest]);

  if (!isRunning && !isPaused) return null;

  const percent = rest.totalSeconds ? (remaining / rest.totalSeconds) * 100 : 0;

  return (
    <Card active style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <AppText variant="smallMedium" color="textMuted">
            {isPaused ? "Rest paused" : "Rest"}
          </AppText>
          <AppText variant="timer" color="accentStrong" tabular accessibilityLiveRegion="polite">
            {formatClock(remaining)}
          </AppText>
        </View>
        <Button label="Skip" size="sm" onPress={skipRest} />
      </View>
      <ProgressBar percent={percent} height={6} />
      <View style={styles.controls}>
        <Button
          label={`−${step}s`}
          variant="secondary"
          size="sm"
          style={styles.flex}
          onPress={() => adjustRest(-step)}
        />
        <Button
          label={`+${step}s`}
          variant="secondary"
          size="sm"
          style={styles.flex}
          onPress={() => adjustRest(step)}
        />
        <Button
          label={isPaused ? "Resume" : "Pause"}
          icon={isPaused ? "play" : "pause"}
          variant="soft"
          size="sm"
          style={styles.flex}
          onPress={toggleRestPause}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  controls: { flexDirection: "row", gap: spacing.sm },
  flex: { flex: 1, alignSelf: "stretch" },
});
