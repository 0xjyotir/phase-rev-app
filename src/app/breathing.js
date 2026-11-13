/**
 * Guided breathing — full-screen session player.
 * Params: ?pattern=<breathing pattern id>&title=<session title>
 *
 * Start → the circle follows the pattern's phases; cycles + elapsed time are
 * counted. "Finish" logs mindful minutes to the member profile.
 */
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Screen, ScreenHeader, StatRow, StatTile } from "@/components/ui";
import { getBreathingPattern } from "@/constants/mental";
import { BreathingCircle } from "@/features/mental/components/BreathingCircle";
import { useNow } from "@/hooks/useNow";
import { useProfile } from "@/hooks/useProfile";
import { formatStopwatch } from "@/lib/format";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

export default function BreathingScreen() {
  useKeepAwake();
  const router = useRouter();
  const { pattern: patternId, title } = useLocalSearchParams();
  const pattern = getBreathingPattern(patternId);
  const { actions } = useProfile();

  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [elapsedBefore, setElapsedBefore] = useState(0); // seconds from earlier runs (pause/resume)
  const [startedAt, setStartedAt] = useState(null);
  const now = useNow(1000, running);
  const elapsed = elapsedBefore + (running && startedAt ? (now - startedAt) / 1000 : 0);

  const toggle = () => {
    haptics.tap();
    if (running) {
      setElapsedBefore(elapsed);
      setStartedAt(null);
      setRunning(false);
    } else {
      setStartedAt(Date.now());
      setRunning(true);
    }
  };

  const finish = () => {
    if (elapsed >= 30) {
      actions.logMindfulSession(Math.max(1, Math.round(elapsed / 60)));
      haptics.success();
    }
    router.back();
  };

  return (
    <Screen
      scroll={false}
      header={
        <ScreenHeader title={title ?? pattern.name} subtitle={pattern.summary} leftIcon="x" />
      }
    >
      <View style={styles.center}>
        <BreathingCircle
          pattern={pattern}
          running={running}
          size={260}
          onCycle={() => setCycles((c) => c + 1)}
        />
      </View>

      <StatRow>
        <StatTile label="Time" value={formatStopwatch(elapsed)} tone="soft" />
        <StatTile label="Cycles" value={cycles} tone="soft" />
      </StatRow>

      <AppText variant="small" color="textMuted" align="center">
        {pattern.description}
      </AppText>

      <View style={styles.actions}>
        <Button
          label={running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
          icon={running ? "pause" : "play"}
          size="lg"
          fullWidth
          onPress={toggle}
        />
        <Button
          label={elapsed >= 30 ? "Finish & log" : "Close"}
          variant="ghost"
          fullWidth
          onPress={finish}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  actions: { gap: spacing.sm, paddingBottom: spacing.lg },
});
