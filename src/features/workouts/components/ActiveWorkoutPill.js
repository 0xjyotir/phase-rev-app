/**
 * ActiveWorkoutPill — "workout in progress", one tap from anywhere in the app.
 *
 *   variant="accessory"  content for the iOS 26 tab bar accessory (the system
 *                        draws the Liquid Glass capsule; `placement` is "regular"
 *                        above the tab bar, or "inline" when the bar is minimised)
 *   variant="floating"   our own cyan capsule above the JS tab bar (Android,
 *                        iOS 18 and earlier, web)
 *
 * Mounted once in src/app/(tabs)/_layout.js.
 */
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Icon } from "@/components/ui";
import { useActiveSession } from "@/features/workouts/hooks/useTraining";
import { useNow } from "@/hooks/useNow";
import { formatStopwatch } from "@/lib/format";
import { haptics } from "@/lib/haptics";
import { useTheme, useThemedStyles } from "@/providers/ThemeProvider";
import { GUTTER, radius, spacing } from "@/theme";

export function ActiveWorkoutPill({ variant = "floating", placement = "regular" }) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { activeSession, progress } = useActiveSession();
  const now = useNow(1000, Boolean(activeSession));

  if (!activeSession) return null;

  const elapsed = formatStopwatch((now - activeSession.startedAt) / 1000);
  const open = () => {
    haptics.tap();
    router.push("/workout/active");
  };

  if (variant === "accessory") {
    const inline = placement === "inline";
    return (
      <Pressable
        onPress={open}
        style={[styles.accessory, inline && styles.accessoryInline]}
        accessibilityRole="button"
        accessibilityLabel={`Resume ${activeSession.session.name}, ${elapsed}`}
      >
        <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
        {!inline ? (
          <View style={styles.flex}>
            <AppText variant="smallStrong" numberOfLines={1}>
              {activeSession.session.name}
            </AppText>
            <AppText variant="caption" color="textMuted" tabular numberOfLines={1}>
              {progress.completedSets}/{progress.totalSets} sets
            </AppText>
          </View>
        ) : null}
        <AppText
          variant="smallStrong"
          color="accentStrong"
          tabular
          style={inline ? styles.flex : null}
          maxFontSizeMultiplier={1.2}
        >
          {elapsed}
        </AppText>
        <Icon name="play-circle" size={inline ? 20 : 26} color="accent" />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={open}
      style={({ pressed }) => [styles.pill, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
      accessibilityRole="button"
      accessibilityLabel="Resume workout"
    >
      <View style={[styles.liveDot, { backgroundColor: colors.onAccent }]} />
      <View style={styles.flex}>
        <AppText variant="smallStrong" color="onAccent" numberOfLines={1}>
          {activeSession.session.name}
        </AppText>
        <AppText variant="caption" color="onAccent" tabular>
          {elapsed} · {progress.completedSets}/{progress.totalSets} sets
        </AppText>
      </View>
      <AppText variant="smallStrong" color="onAccent">
        Resume
      </AppText>
      <Icon name="chevron-up" size={16} color="onAccent" weight="bold" />
    </Pressable>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    flex: { flex: 1 },
    accessory: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    accessoryInline: { paddingHorizontal: spacing.md, gap: spacing.sm },
    liveDot: { width: 8, height: 8, borderRadius: 4 },
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
  });
