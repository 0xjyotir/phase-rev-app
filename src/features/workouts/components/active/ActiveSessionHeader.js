/**
 * ActiveSessionHeader — sticky top of the live workout:
 * minimise · name · live stopwatch · sets / volume / now · Finish.
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
          <AppText variant="caption" color="accent">
            In progress
          </AppText>
          <AppText variant="title" numberOfLines={1}>
            {activeSession.session.name}
          </AppText>
        </View>
        <IconButton icon="more-horizontal" onPress={onMore} accessibilityLabel="Workout options" />
      </View>

      <View style={styles.statsRow}>
        <AppText variant="timer" color="accentStrong" tabular>
          {formatStopwatch(elapsed)}
        </AppText>
        <Button label="Finish" size="sm" onPress={onFinish} />
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
    <View style={{ flex, minWidth: 0 }}>
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
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    topRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingTop: spacing.sm },
    titles: { flex: 1, alignItems: "center" },
    statsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    strip: {
      flexDirection: "row",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: theme.colors.surfaceSoft,
    },
  });
