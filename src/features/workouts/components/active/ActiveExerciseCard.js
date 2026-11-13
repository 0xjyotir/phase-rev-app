/**
 * ActiveExerciseCard — one exercise during a live session.
 *
 * Collapsed: name, prescription, "2/3 sets", last time vs aim for.
 * Expanded (the current exercise): every SetRow + "Add set" + form link.
 * Tapping the header makes it the current exercise.
 */
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip, Icon } from "@/components/ui";
import { getExerciseById } from "@/constants/exercises";
import {
  getExerciseMeta,
  getOrderLabel,
  getPrescriptionLabel,
  getPreviousLabel,
  getTargetLabel,
} from "@/features/workouts/lib/labels";
import { parseRepRange } from "@/features/workouts/lib/workout-math";
import { formatRestLabel } from "@/lib/format";
import { useTheme } from "@/providers/ThemeProvider";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";
import { SetRow } from "./SetRow";

export function ActiveExerciseCard({ sessionExercise, expanded }) {
  const router = useRouter();
  const { colors } = useTheme();
  const setCurrentExercise = useTrainingStore((state) => state.setCurrentExercise);
  const addSet = useTrainingStore((state) => state.addSet);

  const exercise = getExerciseById(sessionExercise.exerciseId);
  if (!exercise) return null;

  const done = sessionExercise.sets.filter((set) => set.completed).length;
  const total = sessionExercise.sets.length;
  const allDone = done === total;
  const isHoldRange = parseRepRange(sessionExercise.repRange).unit === "sec";
  const trackingMode = isHoldRange ? "hold" : exercise.trackingMode;

  return (
    <Card
      active={expanded}
      padding="none"
      style={
        sessionExercise.supersetGroup
          ? { borderLeftWidth: 3, borderLeftColor: colors.accent }
          : null
      }
    >
      <Pressable
        onPress={() => setCurrentExercise(expanded ? null : sessionExercise.id)}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${exercise.name}, ${done} of ${total} sets done`}
      >
        <View
          style={[styles.badge, { backgroundColor: allDone ? colors.accent : colors.surfaceSoft }]}
        >
          {allDone ? (
            <Icon name="check" size={16} color="onAccent" />
          ) : (
            <AppText variant="eyebrow" color="textMuted">
              {getOrderLabel(sessionExercise)}
            </AppText>
          )}
        </View>

        <View style={styles.titles}>
          <AppText variant="title" numberOfLines={2}>
            {exercise.name}
          </AppText>
          <AppText variant="caption" color="textMuted">
            {getExerciseMeta(exercise)} · rest {formatRestLabel(sessionExercise.restSeconds)}
          </AppText>
          <View style={styles.metaRow}>
            <AppText variant="smallStrong" tabular>
              {getPrescriptionLabel(sessionExercise)}
            </AppText>
            <Chip label={`${done}/${total} sets`} tone={allDone ? "success" : "neutral"} />
          </View>
        </View>

        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={20} color="textMuted" />
      </Pressable>

      {!expanded ? (
        <View style={styles.compare}>
          <AppText variant="caption" color="textMuted">
            Last {getPreviousLabel(sessionExercise.sets[0])}
          </AppText>
          <AppText variant="captionStrong" color="accentStrong">
            Aim {getTargetLabel(sessionExercise.sets[0], sessionExercise.repRange)}
          </AppText>
        </View>
      ) : (
        <View style={styles.body}>
          {sessionExercise.notes ? (
            <AppText variant="small" color="textMuted">
              Note: {sessionExercise.notes}
            </AppText>
          ) : null}
          {sessionExercise.sets.map((set, index) => (
            <SetRow
              key={`${sessionExercise.id}-${set.setNumber}`}
              sessionExercise={sessionExercise}
              set={set}
              setIndex={index}
              trackingMode={trackingMode}
              showRir={Boolean(sessionExercise.rir)}
            />
          ))}
          <View style={styles.actions}>
            <Button
              label="Add set"
              icon="plus"
              variant="secondary"
              size="sm"
              onPress={() => addSet(sessionExercise.id)}
            />
            <Button
              label="Form"
              icon="play-circle"
              variant="ghost"
              size="sm"
              onPress={() => router.push(`/exercise/${exercise.id}`)}
            />
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, padding: spacing.lg },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  titles: { flex: 1, gap: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs },
  compare: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  body: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg, gap: spacing.sm },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
});
