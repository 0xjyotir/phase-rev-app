/**
 * ExerciseListItem — a row in the exercise library.
 * Tap → /exercise/[id]. Heart toggles favorite (training-store).
 */
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, IconButton } from "@/components/ui";
import { getExerciseMeta } from "@/features/workouts/lib/labels";
import { useTheme } from "@/providers/ThemeProvider";
import { useTrainingStore } from "@/stores/training-store";
import { radius, spacing } from "@/theme";

const TRACKING_LABEL = { weight: "kg × reps", reps: "reps", hold: "hold" };

export function ExerciseListItem({ exercise }) {
  const router = useRouter();
  const { colors } = useTheme();
  const isFavorite = useTrainingStore((state) => state.favoriteExerciseIds.includes(exercise.id));
  const toggleFavorite = useTrainingStore((state) => state.toggleFavorite);

  return (
    <Pressable
      onPress={() => router.push(`/exercise/${exercise.id}`)}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.85 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={exercise.name}
    >
      <View style={[styles.thumb, { backgroundColor: colors.surfaceSoft }]}>
        <AppText variant="eyebrow" color="accent">
          {exercise.muscleGroup.slice(0, 3)}
        </AppText>
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {exercise.name}
        </AppText>
        <AppText variant="caption" color="textMuted" numberOfLines={1}>
          {getExerciseMeta(exercise)} · {TRACKING_LABEL[exercise.trackingMode]}
        </AppText>
      </View>
      <IconButton
        icon="heart"
        variant="ghost"
        active={isFavorite}
        size={38}
        iconSize={18}
        onPress={() => toggleFavorite(exercise.id)}
        accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
});
