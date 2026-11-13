/**
 * Routine builder (modal) — create a reusable plan, e.g. "PUSH A".
 * Web: WorkoutBuilder.
 *
 * A routine = name · gym/calisthenics · days per week · exercises with
 * sets, reps, rest. Save it, or save and run it as today's workout.
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  AppText,
  Button,
  Card,
  EmptyState,
  Screen,
  ScreenHeader,
  SectionHeader,
  SegmentedControl,
  Stepper,
  TextField,
} from "@/components/ui";
import { ExercisePicker } from "@/features/workouts/components/builder/ExercisePicker";
import { RoutineExerciseEditor } from "@/features/workouts/components/builder/RoutineExerciseEditor";
import { haptics } from "@/lib/haptics";
import { createId } from "@/lib/id";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

const MODES = [
  { id: "gym", label: "Gym" },
  { id: "calisthenics", label: "Calisthenics" },
];

/** Sensible defaults for a newly added exercise. */
function createLine(exercise) {
  const isHold = exercise.trackingMode === "hold";
  return {
    exerciseId: exercise.id,
    sets: 3,
    repRange: isHold ? "20–30 SEC" : "8–10",
    rir: isHold ? undefined : "1–2",
    restSeconds: exercise.defaultRestSeconds ?? 120,
  };
}

export default function RoutineBuilderScreen() {
  const router = useRouter();
  const saveRoutine = useTrainingStore((state) => state.saveRoutine);
  const applyRoutineAsToday = useTrainingStore((state) => state.applyRoutineAsToday);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("gym");
  const [daysPerWeek, setDaysPerWeek] = useState(2);
  const [lines, setLines] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(true);

  const canSave = name.trim().length > 0 && lines.length > 0;

  const updateLine = (index, patch) =>
    setLines((current) => current.map((line, i) => (i === index ? { ...line, ...patch } : line)));

  const moveLine = (index, direction) =>
    setLines((current) => {
      const next = [...current];
      const target = index + direction;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setLines([]); // exercises are mode-specific
  };

  const save = ({ runToday }) => {
    if (!canSave) return;
    const routine = {
      id: createId("rt"),
      name: name.trim(),
      description: description.trim() || `${lines.length}-exercise ${mode} routine`,
      mode,
      daysPerWeek,
      exercises: lines,
    };
    saveRoutine(routine);
    if (runToday) applyRoutineAsToday(routine.id);
    haptics.success();
    router.back();
  };

  return (
    <Screen
      header={<ScreenHeader title="New routine" leftIcon="x" />}
      keyboardAware
      footer={
        <View style={styles.footer}>
          <Button
            label="Save"
            variant="secondary"
            style={styles.flex}
            disabled={!canSave}
            onPress={() => save({ runToday: false })}
          />
          <Button
            label="Save & set as today"
            style={styles.flexWide}
            disabled={!canSave}
            onPress={() => save({ runToday: true })}
          />
        </View>
      }
    >
      <Card style={styles.gap}>
        <TextField
          label="Name"
          placeholder="e.g. PUSH A"
          value={name}
          onChangeText={setName}
          autoCapitalize="characters"
        />
        <TextField
          label="Description"
          placeholder="Strength-focused push session"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.gapXs}>
          <AppText variant="caption" color="textMuted">
            Training type
          </AppText>
          <SegmentedControl options={MODES} value={mode} onChange={changeMode} size="sm" />
        </View>
        <Stepper
          label="Days per week"
          value={daysPerWeek}
          min={1}
          max={7}
          onChange={setDaysPerWeek}
        />
      </Card>

      <SectionHeader
        title="Exercises"
        subtitle={
          lines.length
            ? `${lines.length} added · default 3 × 8–10 · RIR 1–2`
            : "Add at least one exercise"
        }
        actionLabel={pickerOpen ? "Hide list" : "Add exercise"}
        onActionPress={() => setPickerOpen((open) => !open)}
      />

      {lines.length === 0 && !pickerOpen ? (
        <EmptyState
          icon="plus"
          title="No exercises yet"
          message="Tap “Add exercise” to build your routine."
        />
      ) : null}

      {lines.map((line, index) => (
        <RoutineExerciseEditor
          key={line.exerciseId}
          line={line}
          index={index}
          isFirst={index === 0}
          isLast={index === lines.length - 1}
          onChange={(patch) => updateLine(index, patch)}
          onMove={(direction) => moveLine(index, direction)}
          onRemove={() => setLines((current) => current.filter((_, i) => i !== index))}
        />
      ))}

      {pickerOpen ? (
        <ExercisePicker
          mode={mode}
          excludeIds={lines.map((line) => line.exerciseId)}
          onPick={(exercise) => setLines((current) => [...current, createLine(exercise)])}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
  gapXs: { gap: spacing.xs },
  footer: { flexDirection: "row", gap: spacing.sm },
  flex: { flex: 1, alignSelf: "stretch" },
  flexWide: { flex: 1.6, alignSelf: "stretch" },
});
