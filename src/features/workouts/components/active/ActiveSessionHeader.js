/**
 * ActiveSessionHeader — pinned top of the live workout:
 * minimise · name · options, live stopwatch + Finish, and a sets / volume / now strip.
 * Web: ActiveWorkoutBar.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, IconButton } from "@/components/ui";
import { getExerciseById } from "@/constants/exercises";
import { useNow } from "@/hooks/useNow";
import { formatNumber, formatStopwatch } from "@/lib/format";
import { useThemedStyles } from "@/providers/ThemeProvider";
import { GUTTER, radius, spacing } from "@/theme";

export function ActiveSessionHeader({ activeSession, progress, onMinimize, onFinish, onMore }) {
  const styles = useThemedStyles(createStyles);
  const now = useNow(1000);
  const elapsed = (now - activeSession.startedAt) / 1000;

  const current = activeSession.session.exercises.find(
    (e) => e.id === activeSession.currentExerciseId,
  );
  const currentName = current ? getExerciseById(current.exerciseId)?.name : "—";

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <IconButton
          icon="chevron-down"
          onPress={onMinimize}
          accessibilityLabel="Minimise workout"
        />
        <View style={styles.titles}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <AppText variant="captionStrong" color="accentStrong">
              In progress
            </AppText>
          </View>
          <AppText variant="title" numberOfLines={1}>
            {activeSession.session.name}
          </AppText>
        </View>
        <IconButton icon="more-horizontal" onPress={onMore} accessibilityLabel="Workout options" />
      </View>

      <View style={styles.statsRow}>
        <AppText
          variant="timer"
          color="accentStrong"
          tabular
          maxFontSizeMultiplier={1.2}
          accessibilityLabel={`Elapsed ${formatStopwatch(elapsed)}`}
        >
          {formatStopwatch(elapsed)}
        </AppText>
        <Button label="Finish" icon="flag" size="sm" onPress={onFinish} />
      </View>

      <View style={styles.strip}>
        <Stat label="Sets" value={`${progress.completedSets}/${progress.totalSets}`} />
        <Stat label="Volume" value={`${formatNumber(progress.volumeKg)} kg`} />
        <Stat label="Now" value={currentName} flex={1.6} />
      </View>
    </View>
  );
}

function Stat({ label, value, flex = 1 }) {
  return (
    <View style={{ flex, minWidth: 0, gap: 2 }}>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
      <AppText variant="smallStrong" numberOfLines={1} tabular>
        {value}
      </AppText>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    wrapper: {
      paddingHorizontal: GUTTER,
      paddingBottom: spacing.md,
      gap: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.separator,
    },
    topRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingTop: spacing.sm },
    titles: { flex: 1, alignItems: "center", gap: 1 },
    liveRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.accent },
    statsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    strip: {
      flexDirection: "row",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radius.md,
      borderCurve: "continuous",
      backgroundColor: theme.colors.surfaceSoft,
    },
  });
