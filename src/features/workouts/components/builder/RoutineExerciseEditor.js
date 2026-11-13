/**
 * RoutineExerciseEditor — one exercise line inside the routine builder.
 * Edit sets · rep range · rest, reorder (↑ ↓) or remove.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, IconButton, Stepper, TextField } from "@/components/ui";
import { getExerciseById } from "@/constants/exercises";
import { formatRestLabel } from "@/lib/format";
import { spacing } from "@/theme";

export function RoutineExerciseEditor({
  line,
  index,
  isFirst,
  isLast,
  onChange,
  onMove,
  onRemove,
}) {
  const exercise = getExerciseById(line.exerciseId);

  return (
    <Card tone="soft" padding="md" style={styles.card}>
      <View style={styles.header}>
        <AppText variant="eyebrow" color="accent">
          {String(index + 1).padStart(2, "0")}
        </AppText>
        <AppText variant="bodyStrong" style={styles.flex} numberOfLines={1}>
          {exercise?.name ?? line.exerciseId}
        </AppText>
        <IconButton
          icon="arrow-up"
          variant="ghost"
          size={34}
          iconSize={16}
          disabled={isFirst}
          onPress={() => onMove(-1)}
          accessibilityLabel="Move up"
        />
        <IconButton
          icon="arrow-down"
          variant="ghost"
          size={34}
          iconSize={16}
          disabled={isLast}
          onPress={() => onMove(1)}
          accessibilityLabel="Move down"
        />
        <IconButton
          icon="x"
          variant="ghost"
          size={34}
          iconSize={16}
          onPress={onRemove}
          accessibilityLabel="Remove exercise"
        />
      </View>

      <View style={styles.controls}>
        <Stepper
          label="Sets"
          value={line.sets}
          min={1}
          max={8}
          onChange={(sets) => onChange({ sets })}
        />
        <Stepper
          label="Rest"
          value={line.restSeconds}
          min={30}
          max={300}
          step={15}
          format={formatRestLabel}
          onChange={(restSeconds) => onChange({ restSeconds })}
        />
      </View>

      <TextField
        label={exercise?.trackingMode === "hold" ? "Hold range" : "Rep range"}
        value={line.repRange}
        onChangeText={(repRange) => onChange({ repRange })}
        compact
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  flex: { flex: 1, marginLeft: spacing.xs },
  controls: { flexDirection: "row", gap: spacing.lg, flexWrap: "wrap" },
});
