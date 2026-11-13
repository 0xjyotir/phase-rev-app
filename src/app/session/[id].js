/**
 * Guided session — full-screen focus mode for meditation, performance
 * psychology and visualization scripts (constants/mental.js → guidedScripts).
 *
 *   /session/deep-focus · /session/pre-game-focus · /session/visualization ·
 *   /session/evening-wind-down
 *
 * A calm orb breathes in the middle, prompts change on their own (with a soft
 * haptic), and the time is computed from timestamps so locking the phone
 * doesn't break it. Finishing logs mindful minutes to the member profile.
 */
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ProgressRing } from "@/components/charts";
import {
  AmbientBackground,
  AppText,
  Button,
  EmptyState,
  Icon,
  IconButton,
  Screen,
  ScreenHeader,
} from "@/components/ui";
import { breathingPatterns, getGuidedScript, getScriptMinutes } from "@/constants/mental";
import { BreathingCircle } from "@/features/mental/components/BreathingCircle";
import { useNow } from "@/hooks/useNow";
import { useProfile } from "@/hooks/useProfile";
import { formatClock } from "@/lib/format";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

const CALM = breathingPatterns.find((pattern) => pattern.id === "sleep");

export default function GuidedSessionScreen() {
  useKeepAwake();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { actions } = useProfile();
  const script = getGuidedScript(id);

  const [running, setRunning] = useState(false);
  const [elapsedBefore, setElapsedBefore] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [ended, setEnded] = useState(false); // stops the clock once the script is over
  const now = useNow(500, running && !ended);

  const boundaries = useMemo(() => {
    if (!script) return [];
    let total = 0;
    return script.steps.map((step) => {
      const start = total;
      total += step.seconds;
      return { start, end: total };
    });
  }, [script]);
  const totalSeconds = boundaries.at(-1)?.end ?? 0;
  const elapsed = Math.min(
    totalSeconds,
    elapsedBefore + (running && startedAt ? (now - startedAt) / 1000 : 0),
  );
  const stepIndex = Math.max(
    0,
    boundaries.findIndex((b) => elapsed >= b.start && elapsed < b.end),
  );
  const currentIndex = elapsed >= totalSeconds ? boundaries.length - 1 : stepIndex;
  const finished = totalSeconds > 0 && elapsed >= totalSeconds;

  // Gentle haptic whenever the prompt changes; a success tap at the end.
  const lastStep = useRef(-1);
  const celebrated = useRef(false);
  useEffect(() => {
    if (!running) return;
    if (lastStep.current !== currentIndex) {
      if (lastStep.current !== -1) haptics.select();
      lastStep.current = currentIndex;
    }
    if (finished && !celebrated.current) {
      celebrated.current = true;
      haptics.success();
    }
  }, [running, currentIndex, finished]);

  if (!script) {
    return (
      <Screen variant="bare">
        <ScreenHeader leftIcon="x" padded={false} />
        <EmptyState icon="compass" title="Session not found" />
      </Screen>
    );
  }

  if (finished && !ended) setEnded(true); // render-time adjustment, no effect needed

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

  const jump = (direction) => {
    const target = Math.min(boundaries.length - 1, Math.max(0, currentIndex + direction));
    haptics.select();
    setElapsedBefore(boundaries[target].start);
    if (running) setStartedAt(Date.now());
  };

  const close = () => {
    const minutes = Math.round(elapsed / 60);
    if (minutes >= 1) {
      actions.logMindfulSession(
        minutes,
        script.type === "Meditation" ? "meditation" : "visualization",
      );
    }
    router.back();
  };

  const step = script.steps[currentIndex];
  const percent = totalSeconds ? (elapsed / totalSeconds) * 100 : 0;

  return (
    <View style={styles.root}>
      <AmbientBackground />
      <Screen variant="bare" scroll={false} background="transparent" gap={spacing.xl}>
        <ScreenHeader
          leftIcon="x"
          padded={false}
          title={script.title}
          subtitle={`${script.type} · ${getScriptMinutes(script)} min`}
          onLeftPress={close}
        />

        <View style={styles.center}>
          <View style={styles.orb}>
            <BreathingCircle pattern={CALM} running={false} size={220} />
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <ProgressRing percent={percent} size={260} strokeWidth={4} showValue={false} />
            </View>
          </View>
        </View>

        <View style={styles.prompt}>
          {finished ? (
            <>
              <Icon name="check-circle" size={28} color="accent" />
              <AppText variant="h2" align="center">
                Session complete
              </AppText>
              <AppText variant="body" color="textMuted" align="center">
                {`${getScriptMinutes(script)} mindful minutes. Carry this calm into what’s next.`}
              </AppText>
            </>
          ) : (
            <>
              {running || elapsed > 0 ? (
                <AppText variant="eyebrow" color="accent" align="center">
                  {`Step ${currentIndex + 1} of ${script.steps.length}`}
                </AppText>
              ) : (
                <AppText variant="small" color="textMuted" align="center">
                  {script.summary}
                </AppText>
              )}
              <AppText variant="h3" align="center" style={styles.promptText}>
                {running || elapsed > 0
                  ? step.text
                  : "Find a comfortable position. Press start when you’re ready."}
              </AppText>
            </>
          )}
        </View>

        <AppText variant="smallStrong" color="textMuted" align="center" tabular>
          {formatClock(elapsed)} / {formatClock(totalSeconds)}
        </AppText>

        {finished ? (
          <Button label="Done" icon="check" size="lg" fullWidth onPress={close} />
        ) : (
          <View style={styles.controls}>
            <IconButton
              icon="chevron-left"
              onPress={() => jump(-1)}
              disabled={currentIndex === 0}
              accessibilityLabel="Previous prompt"
            />
            <Button
              label={running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
              icon={running ? "pause" : "play"}
              size="lg"
              style={styles.flex}
              onPress={toggle}
            />
            <IconButton
              icon="chevron-right"
              onPress={() => jump(1)}
              disabled={currentIndex >= script.steps.length - 1}
              accessibilityLabel="Next prompt"
            />
          </View>
        )}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 280 },
  orb: { width: 260, height: 260, alignItems: "center", justifyContent: "center" },
  prompt: { gap: spacing.sm, alignItems: "center", minHeight: 120 },
  promptText: { paddingHorizontal: spacing.md },
  controls: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1, alignSelf: "stretch" },
});
