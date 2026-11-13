/**
 * ActiveWorkoutPill — floating "workout in progress" bar shown above the tab
 * bar while a session is live. Tap → back to the active workout screen.
 *
 * Mounted once in src/app/(tabs)/_layout.js.
 */
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Icon } from "@/components/ui";
import { useActiveSession } from "@/features/workouts/hooks/useTraining";
import { useNow } from "@/hooks/useNow";
import { formatStopwatch } from "@/lib/format";
import { useThemedStyles } from "@/providers/ThemeProvider";
import { GUTTER, radius, spacing } from "@/theme";

export function ActiveWorkoutPill() {
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const { activeSession, progress } = useActiveSession();
  const now = useNow(1000, Boolean(activeSession));

  if (!activeSession) return null;

  const elapsed = (now - activeSession.startedAt) / 1000;

  return (
    <Pressable
      onPress={() => router.push("/workout/active")}
      style={({ pressed }) => [styles.pill, pressed && { opacity: 0.9 }]}
      accessibilityRole="button"
      accessibilityLabel="Resume workout"
    >
      <View style={styles.dot} />
      <View style={styles.text}>
        <AppText variant="smallStrong" color="onAccent" numberOfLines={1}>
          {activeSession.session.name}
        </AppText>
        <AppText variant="caption" color="onAccent" tabular>
          {formatStopwatch(elapsed)} · {progress.completedSets}/{progress.totalSets} sets
        </AppText>
      </View>
      <AppText variant="smallStrong" color="onAccent">
        Resume
      </AppText>
      <Icon name="chevron-up" size={18} color="onAccent" />
    </Pressable>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginHorizontal: GUTTER,
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: radius.pill,
      backgroundColor: theme.colors.accent,
      ...theme.shadow,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.onAccent,
    },
    text: { flex: 1 },
  });
