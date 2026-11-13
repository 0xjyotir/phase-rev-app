/**
 * SetRow — log one set: weight · reps · RIR (or hold seconds) · ✓
 *
 * "Can I log my next set with almost no friction?"
 *   - Fields are pre-filled with today's target as placeholders.
 *   - Tapping ✓ with empty fields logs the target/previous values.
 *   - Completing a set starts the rest timer (handled in training-store).
 *   - Subtle feedback: "Target hit · +2.5 kg", "+1 rep vs last".
 */
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Icon } from "@/components/ui";
import { getSetFeedback } from "@/features/workouts/lib/workout-math";
import { SET_TYPE_LABELS, getPreviousLabel } from "@/features/workouts/lib/labels";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { useTrainingStore } from "@/stores/training-store";
import { radius, spacing } from "@/theme";
import { NumberCell } from "./NumberCell";

/** @param {{ sessionExercise: any, set: any, setIndex: number, trackingMode: "weight"|"reps"|"hold", showRir: boolean }} props */
export function SetRow({ sessionExercise, set, setIndex, trackingMode, showRir }) {
  const { colors } = useTheme();
  const updateSet = useTrainingStore((state) => state.updateSet);
  const completeSet = useTrainingStore((state) => state.completeSet);

  const feedback = getSetFeedback(set);
  const typeLabel = SET_TYPE_LABELS[set.setType];
  const update = (patch) => updateSet(sessionExercise.id, setIndex, patch);

  const toggle = () => {
    const result = completeSet(sessionExercise.id, setIndex);
    if (result.completed) haptics.success();
    else haptics.tap();
  };

  return (
    <View
      style={[
        styles.row,
        {
          borderColor: set.completed ? "transparent" : colors.border,
          backgroundColor: set.completed ? colors.accentSoft : colors.surfaceSoft,
        },
      ]}
    >
      <View style={styles.header}>
        <AppText variant="smallStrong" tabular>
          Set {set.setNumber}
        </AppText>
        {typeLabel ? (
          <View style={[styles.typePill, { backgroundColor: colors.surfaceSoft }]}>
            <AppText variant="caption" color="textMuted">
              {typeLabel}
            </AppText>
          </View>
        ) : null}
        <AppText variant="caption" color="textMuted" style={styles.prev} tabular>
          Prev {getPreviousLabel(set)}
        </AppText>
      </View>

      <View style={styles.inputs}>
        {trackingMode === "hold" ? (
          <Field label="Hold (sec)" flex={2}>
            <NumberCell
              value={set.holdSeconds}
              placeholder={String(set.targetHoldSeconds ?? "")}
              onCommit={(holdSeconds) => update({ holdSeconds })}
              decimal={false}
              completed={set.completed}
              accessibilityLabel={`Hold seconds, set ${set.setNumber}`}
            />
          </Field>
        ) : (
          <>
            {trackingMode === "weight" ? (
              <Field label="Kg" flex={1.4}>
                <NumberCell
                  value={set.weight}
                  placeholder={String(set.targetWeight ?? set.previousWeight ?? "")}
                  onCommit={(weight) => update({ weight })}
                  completed={set.completed}
                  accessibilityLabel={`Weight in kilograms, set ${set.setNumber}`}
                />
              </Field>
            ) : null}
            <Field label="Reps" flex={1}>
              <NumberCell
                value={set.reps}
                placeholder={String(set.previousReps ?? set.targetReps.match(/\d+/)?.[0] ?? "")}
                onCommit={(reps) => update({ reps })}
                decimal={false}
                completed={set.completed}
                accessibilityLabel={`Reps, set ${set.setNumber}`}
              />
            </Field>
            {showRir ? (
              <Field label="RIR" flex={0.8}>
                <NumberCell
                  value={set.rir}
                  placeholder="–"
                  onCommit={(rir) => update({ rir })}
                  decimal={false}
                  completed={set.completed}
                  accessibilityLabel={`Reps in reserve, set ${set.setNumber}`}
                />
              </Field>
            ) : null}
          </>
        )}

        <Pressable
          onPress={toggle}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: set.completed }}
          accessibilityLabel={`Mark set ${set.setNumber} ${set.completed ? "not done" : "done"}`}
          style={({ pressed }) => [
            styles.check,
            {
              backgroundColor: set.completed ? colors.accent : colors.surfaceSoft,
              borderColor: set.completed ? colors.accent : colors.borderStrong,
            },
            pressed && { transform: [{ scale: 0.94 }] },
          ]}
        >
          <Icon name="check" size={20} color={set.completed ? "onAccent" : "textMuted"} />
        </Pressable>
      </View>

      {feedback ? (
        <View style={styles.feedback}>
          <Icon
            name="trending-up"
            size={13}
            color={feedback.tone === "success" ? "success" : "accentStrong"}
          />
          <AppText
            variant="captionStrong"
            color={feedback.tone === "success" ? "success" : "accentStrong"}
          >
            {feedback.label}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

function Field({ label, flex, children }) {
  return (
    <View style={{ flex, gap: 2 }}>
      <AppText variant="caption" color="textMuted" align="center">
        {label}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  typePill: { borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  prev: { marginLeft: "auto" },
  inputs: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  check: {
    width: 50,
    height: 44,
    borderRadius: radius.sm,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  feedback: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
});
