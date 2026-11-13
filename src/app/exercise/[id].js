/**
 * Exercise detail — form, numbers and history for one movement.
 * Web: ExerciseDetailDrawer + ExerciseVideoModal.
 *
 * Previous · next target · personal record · est. 1RM → strength chart →
 * muscles → technique cues → common errors → recent sessions.
 */
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  AppText,
  Card,
  Chip,
  EmptyState,
  Icon,
  Screen,
  SectionHeader,
  StatRow,
  StatTile,
} from "@/components/ui";
import { getExerciseById } from "@/constants/exercises";
import { FormVideoCard } from "@/features/workouts/components/FormVideoCard";
import { StrengthProgressCard } from "@/features/workouts/components/progress/StrengthProgressCard";
import { getExerciseMeta, getTargetLabel } from "@/features/workouts/lib/labels";
import { buildSessionPlan, getLastPerformance } from "@/features/workouts/lib/session-plan";
import { getPersonalRecords } from "@/features/workouts/lib/training-analytics";
import { formatSet, getBestSet } from "@/features/workouts/lib/workout-math";
import { formatRelativeDay } from "@/lib/dates";
import { capitalize } from "@/lib/format";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const exercise = getExerciseById(id);
  const history = useTrainingStore((state) => state.history);
  const routines = useTrainingStore((state) => state.routines);
  const isFavorite = useTrainingStore((state) => state.favoriteExerciseIds.includes(id));
  const toggleFavorite = useTrainingStore((state) => state.toggleFavorite);

  const stats = useMemo(() => {
    if (!exercise) return null;
    const last = getLastPerformance(history, exercise.id);
    const record = getPersonalRecords(history).find((r) => r.exerciseId === exercise.id) ?? null;

    // Next target: plan the first routine that includes this exercise.
    const routine = routines.find((r) =>
      r.exercises.some((line) => line.exerciseId === exercise.id),
    );
    const planned = routine
      ? buildSessionPlan(routine, history).exercises.find((e) => e.exerciseId === exercise.id)
      : null;

    const recent = history
      .filter((entry) => entry.exercises.some((e) => e.exerciseId === exercise.id))
      .slice(0, 3)
      .map((entry) => ({
        id: entry.id,
        when: formatRelativeDay(entry.performedAt),
        sets: entry.exercises.find((e) => e.exerciseId === exercise.id).sets,
      }));

    return {
      previous: last ? formatSet(getBestSet(last.sets)) : "—",
      target: planned ? getTargetLabel(planned.sets[0], planned.repRange) : "—",
      record: record?.display ?? "—",
      e1rm: record?.e1rm ? `${record.e1rm} kg` : "—",
      recent,
    };
  }, [exercise, history, routines]);

  if (!exercise) {
    return (
      <Screen title="Exercise">
        <EmptyState icon="alert-circle" title="Exercise not found" />
      </Screen>
    );
  }

  return (
    <Screen
      title={exercise.name}
      headerActions={[
        {
          label: isFavorite ? "Remove from favorites" : "Add to favorites",
          icon: isFavorite ? "heart-fill" : "heart",
          tintColor: isFavorite ? colors.danger : undefined,
          onPress: () => {
            haptics.select();
            toggleFavorite(exercise.id);
          },
        },
      ]}
    >
      <View style={styles.titleBlock}>
        <AppText variant="eyebrow" color="accent">
          {exercise.mode === "gym" ? "Gym" : "Calisthenics"}
        </AppText>
        <AppText variant="h1">{exercise.name}</AppText>
        <AppText variant="body" color="textMuted">
          {getExerciseMeta(exercise)}
        </AppText>
      </View>

      <FormVideoCard exerciseName={exercise.name} />

      <Card style={styles.gapSm}>
        <StatRow>
          <StatTile label="Last best" value={stats.previous} tone="soft" />
          <StatTile
            label="Next target"
            value={stats.target}
            tone="soft"
            valueColor="accentStrong"
          />
        </StatRow>
        <StatRow>
          <StatTile label="Personal record" value={stats.record} tone="soft" />
          <StatTile label="Est. 1RM" value={stats.e1rm} tone="soft" />
        </StatRow>
      </Card>

      <StrengthProgressCard history={history} exerciseId={exercise.id} title="Recent performance" />

      <Card style={styles.gapSm}>
        <SectionHeader title="Muscle impact" />
        <View style={styles.chips}>
          {exercise.primaryMuscles.map((muscle) => (
            <Chip key={muscle} label={muscle} tone="accent" size="md" />
          ))}
          {/* Show the muscle group too, unless it's already one of the primary muscles. */}
          {exercise.primaryMuscles.some((m) => m.toLowerCase() === exercise.muscleGroup) ? null : (
            <Chip label={capitalize(exercise.muscleGroup)} size="md" />
          )}
        </View>
      </Card>

      <Card style={styles.gapSm}>
        <SectionHeader title="Technique" subtitle="Cue these every rep" />
        {exercise.technique.map((cue, index) => (
          <View key={cue} style={styles.cueRow}>
            <AppText variant="eyebrow" color="accent" style={styles.cueNumber}>
              {String(index + 1).padStart(2, "0")}
            </AppText>
            <AppText variant="body" style={styles.flex}>
              {cue}
            </AppText>
          </View>
        ))}
      </Card>

      <Card style={styles.gapSm}>
        <SectionHeader title="Common errors" />
        {exercise.commonErrors.map((error) => (
          <View key={error} style={styles.cueRow}>
            <Icon name="x-circle" size={16} color="danger" />
            <AppText variant="body" style={styles.flex}>
              {error}
            </AppText>
          </View>
        ))}
      </Card>

      {stats.recent.length ? (
        <Card style={styles.gapSm}>
          <SectionHeader title="Recent sessions" />
          {stats.recent.map((session) => (
            <View key={session.id} style={styles.recentRow}>
              <AppText variant="smallStrong" style={styles.recentWhen}>
                {session.when}
              </AppText>
              <AppText variant="small" color="textMuted" style={styles.flex} tabular>
                {session.sets.map(formatSet).join("  ·  ")}
              </AppText>
            </View>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleBlock: { gap: spacing.xs },
  gapSm: { gap: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  cueRow: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  cueNumber: { paddingTop: 4, width: 22 },
  flex: { flex: 1 },
  recentRow: { flexDirection: "row", gap: spacing.md },
  recentWhen: { width: 96 },
});
