/**
 * ExercisePlanRow — one exercise in today's plan, BEFORE starting.
 *
 * Shows the progressive-overload comparison from the web TodayWorkout row:
 *   "Last time 80 kg × 7"   (grey)   vs   "Aim for 82.5 kg × 6–8"   (cyan)
 *
 * Tap → exercise detail (form cues, PR, history chart).
 */
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Chip, Icon } from "@/components/ui";
import { getExerciseById } from "@/constants/exercises";
import {
  getExerciseMeta,
  getOrderLabel,
  getPrescriptionLabel,
  getPreviousLabel,
  getTargetLabel,
} from "@/features/workouts/lib/labels";
import { useTheme } from "@/providers/ThemeProvider";
import { spacing } from "@/theme";

export function ExercisePlanRow({ sessionExercise }) {
  const router = useRouter();
  const { colors } = useTheme();
  const exercise = getExerciseById(sessionExercise.exerciseId);
  if (!exercise) return null;

  const firstSet = sessionExercise.sets[0];
  const isSuperset = Boolean(sessionExercise.supersetGroup);

  return (
    <Pressable
      onPress={() => router.push(`/exercise/${exercise.id}`)}
      style={({ pressed }) => [
        styles.row,
        isSuperset && {
          borderLeftWidth: 3,
          borderLeftColor: colors.accent,
          paddingLeft: spacing.md,
        },
        pressed && { backgroundColor: colors.surfaceSoft },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.name}, ${getPrescriptionLabel(sessionExercise)}`}
    >
      <AppText variant="eyebrow" color="textMuted" style={styles.order}>
        {getOrderLabel(sessionExercise)}
      </AppText>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <AppText variant="title" style={styles.flex} numberOfLines={2}>
            {exercise.name}
          </AppText>
          <Icon name="chevron-right" size={18} color="textMuted" />
        </View>
        <AppText variant="small" color="textMuted">
          {getExerciseMeta(exercise)}
          {sessionExercise.notes ? ` · ${sessionExercise.notes}` : ""}
        </AppText>

        <View style={styles.prescriptionRow}>
          <AppText variant="bodyStrong" tabular>
            {getPrescriptionLabel(sessionExercise)}
          </AppText>
          {isSuperset ? (
            <Chip label={`Superset ${sessionExercise.supersetGroup}`} tone="accent" />
          ) : null}
        </View>

        <View style={styles.compare}>
          <View style={styles.flex}>
            <AppText variant="caption" color="textMuted">
              Last time
            </AppText>
            <AppText variant="smallMedium" color="textMuted" tabular>
              {getPreviousLabel(firstSet)}
            </AppText>
          </View>
          <View style={styles.flex}>
            <AppText variant="caption" color="textMuted">
              Aim for
            </AppText>
            <AppText variant="smallStrong" color="accentStrong" tabular>
              {getTargetLabel(firstSet, sessionExercise.repRange)}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md, padding: spacing.lg },
  order: { paddingTop: 4, width: 28 },
  body: { flex: 1, gap: spacing.xs },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
  prescriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  compare: { flexDirection: "row", gap: spacing.lg, marginTop: spacing.sm },
});
