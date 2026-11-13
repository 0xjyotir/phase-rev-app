/**
 * Reaction drill — the Athletic pillar's "Reaction training", as a real tool.
 *
 * Five trials: wait for the panel to turn cyan, then tap as fast as you can.
 * Tapping early is a false start (the trial repeats). The round's average,
 * median and best are saved to the member profile so progress is visible on
 * the Athletic pillar page.
 */
import { useKeepAwake } from "expo-keep-awake";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BarChart } from "@/components/charts";
import {
  AmbientBackground,
  AppText,
  Button,
  Card,
  Chip,
  Screen,
  ScreenHeader,
  StatRow,
  StatTile,
} from "@/components/ui";
import { nextDelay, summarizeRound, TRIALS_PER_ROUND } from "@/features/athletic/lib/reaction";
import { useProfile } from "@/hooks/useProfile";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { palette, radius, spacing } from "@/theme";

const now = () => (globalThis.performance?.now ? globalThis.performance.now() : Date.now());

export default function ReactionScreen() {
  useKeepAwake();
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, actions } = useProfile();
  const [phase, setPhase] = useState("idle"); // idle | waiting | go | early | result | done
  const [times, setTimes] = useState([]);
  const [lastTime, setLastTime] = useState(null);
  const goAt = useRef(0);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const summary = useMemo(() => summarizeRound(times), [times]);
  const history = profile.athletic.reactionResults.slice(0, 7).reverse();

  const arm = () => {
    setPhase("waiting");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      goAt.current = now();
      setPhase("go");
      haptics.tap();
    }, nextDelay());
  };

  const onPanelPress = () => {
    if (phase === "idle" || phase === "early" || phase === "result") {
      arm();
      return;
    }
    if (phase === "waiting") {
      clearTimeout(timer.current);
      haptics.warning();
      setPhase("early");
      return;
    }
    if (phase === "go") {
      const ms = Math.round(now() - goAt.current);
      const next = [...times, ms];
      setLastTime(ms);
      setTimes(next);
      if (next.length >= TRIALS_PER_ROUND) {
        const result = summarizeRound(next);
        actions.saveReactionResult({
          average: result.average,
          median: result.median,
          best: result.best,
        });
        haptics.success();
        setPhase("done");
      } else {
        haptics.select();
        setPhase("result");
      }
    }
  };

  const restart = () => {
    setTimes([]);
    setLastTime(null);
    setPhase("idle");
  };

  const panel = {
    idle: {
      bg: colors.surfaceSoft,
      title: "Tap to start",
      sub: "Wait for cyan, then tap as fast as you can.",
    },
    waiting: { bg: palette.ink, title: "Wait…", sub: "Don't anticipate. React." },
    go: { bg: palette.cyan, title: "TAP!", sub: "" },
    early: {
      bg: colors.dangerSoft,
      title: "False start",
      sub: "Too soon — tap to retry this trial.",
    },
    result: { bg: colors.accentSoft, title: `${lastTime} ms`, sub: "Tap for the next trial" },
  }[phase];

  return (
    <View style={styles.root}>
      <AmbientBackground />
      <Screen variant="bare" background="transparent" gap={spacing.xl}>
        <ScreenHeader
          leftIcon="x"
          padded={false}
          title="Reaction drill"
          subtitle={`Trial ${Math.min(times.length + 1, TRIALS_PER_ROUND)} of ${TRIALS_PER_ROUND}`}
        />

        {phase !== "done" ? (
          <Pressable
            onPressIn={onPanelPress}
            style={[styles.panel, { backgroundColor: panel.bg }]}
            accessibilityRole="button"
            accessibilityLabel={panel.title}
            accessibilityHint={panel.sub}
          >
            <AppText
              variant="display"
              align="center"
              color={
                phase === "go" ? palette.cyanInk : phase === "waiting" ? palette.navText : "text"
              }
            >
              {panel.title}
            </AppText>
            {panel.sub ? (
              <AppText
                variant="small"
                align="center"
                color={phase === "waiting" ? palette.navMuted : "textMuted"}
              >
                {panel.sub}
              </AppText>
            ) : null}
          </Pressable>
        ) : (
          <Card style={styles.gapMd}>
            <View style={styles.summaryTop}>
              <AppText variant="h2">Round complete</AppText>
              <Chip label={summary.rating.label} tone={summary.rating.tone} size="md" />
            </View>
            <StatRow>
              <StatTile
                label="Average"
                value={summary.average}
                unit="ms"
                tone="soft"
                size="lg"
                valueColor="accentStrong"
              />
              <StatTile label="Best" value={summary.best} unit="ms" tone="soft" size="lg" />
            </StatRow>
            <AppText variant="caption" color="textMuted">
              Median {summary.median} ms · trials {times.join(" · ")} ms
            </AppText>
          </Card>
        )}

        <View style={styles.dots}>
          {Array.from({ length: TRIALS_PER_ROUND }, (_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index < times.length ? colors.accent : colors.surfaceStrong },
              ]}
            />
          ))}
        </View>

        {history.length > 1 ? (
          <Card style={styles.gapMd}>
            <AppText variant="title">Recent rounds</AppText>
            <AppText variant="caption" color="textMuted">
              Average reaction time per round (lower is faster)
            </AppText>
            <BarChart
              data={history.map((item, index) => ({
                label: String(index + 1),
                value: item.average,
              }))}
              highlightIndex={history.length - 1}
              height={110}
            />
          </Card>
        ) : null}

        <View style={styles.gapSm}>
          {phase === "done" ? (
            <Button label="Go again" icon="rotate" size="lg" fullWidth onPress={restart} />
          ) : null}
          <Button label="Close" variant="ghost" fullWidth onPress={() => router.back()} />
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  gapSm: { gap: spacing.sm },
  gapMd: { gap: spacing.md },
  panel: {
    height: 340,
    borderRadius: radius.xxl,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xl,
  },
  summaryTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dots: { flexDirection: "row", justifyContent: "center", gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
