/**
 * Guided breathing — full-screen focus mode.
 * Params: ?pattern=<breathing pattern id>&title=<session title>
 *
 * Start → the circle follows the pattern's phases with a soft haptic on each
 * phase change; cycles + elapsed time are counted. "Finish & log" adds mindful
 * minutes to the member's profile. The screen stays awake.
 */
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  AmbientBackground,
  AppText,
  Button,
  Chip,
  Screen,
  ScreenHeader,
  StatRow,
  StatTile,
} from "@/components/ui";
import { breathingPatterns, getBreathingPattern } from "@/constants/mental";
import { BreathingCircle } from "@/features/mental/components/BreathingCircle";
import { useNow } from "@/hooks/useNow";
import { useProfile } from "@/hooks/useProfile";
import { formatStopwatch } from "@/lib/format";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

export default function BreathingScreen() {
  useKeepAwake();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [patternId, setPatternId] = useState(getBreathingPattern(params.pattern).id);
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
      actions.logMindfulSession(Math.max(1, Math.round(elapsed / 60)), "breathing");
      haptics.success();
    }
    router.back();
  };

  return (
    <View style={styles.root}>
      <AmbientBackground />
      <Screen variant="bare" scroll={false} background="transparent" gap={spacing.xl}>
        <ScreenHeader
          leftIcon="x"
          padded={false}
          title={params.title ?? pattern.name}
          subtitle={pattern.summary}
        />

        {!running && elapsed === 0 ? (
          <View style={styles.patterns}>
            {breathingPatterns.map((item) => (
              <Chip
                key={item.id}
                label={item.name}
                selected={item.id === patternId}
                onPress={() => setPatternId(item.id)}
              />
            ))}
          </View>
        ) : null}

        <View style={styles.center}>
          <BreathingCircle
            pattern={pattern}
            running={running}
            size={270}
            onCycle={() => setCycles((c) => c + 1)}
            onPhase={() => haptics.select()}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  patterns: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 300 },
  actions: { gap: spacing.sm },
});
