/**
 * RoutineCard — a saved plan in Library → Routines.
 * Actions: Start now · Set as today · Delete (custom routines only).
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip, IconButton } from "@/components/ui";
import { getExerciseById } from "@/constants/exercises";
import { spacing } from "@/theme";

export function RoutineCard({ routine, isToday, onStart, onSetToday, onDelete }) {
  return (
    <Card active={isToday} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="h3">{routine.name}</AppText>
          <AppText variant="small" color="textMuted">
            {routine.description || "Custom routine"}
          </AppText>
        </View>
        {onDelete ? (
          <IconButton
            icon="trash-2"
            variant="ghost"
            size={38}
            iconSize={18}
            onPress={onDelete}
            accessibilityLabel={`Delete ${routine.name}`}
          />
        ) : null}
      </View>

      <View style={styles.chips}>
        <Chip label={routine.mode === "gym" ? "Gym" : "Calisthenics"} tone="accent" />
        <Chip label={`${routine.daysPerWeek}× / week`} />
        <Chip label={`${routine.exercises.length} exercises`} />
        {isToday ? <Chip label="Today" tone="success" /> : null}
      </View>

      <View style={styles.list}>
        {routine.exercises.map((line, index) => (
          <View key={`${line.exerciseId}-${index}`} style={styles.line}>
            <AppText variant="eyebrow" color="textMuted" style={styles.order}>
              {String(index + 1).padStart(2, "0")}
            </AppText>
            <AppText variant="smallMedium" style={styles.flex} numberOfLines={1}>
              {getExerciseById(line.exerciseId)?.name ?? line.exerciseId}
            </AppText>
            <AppText variant="caption" color="textMuted" tabular>
              {line.sets} × {line.repRange}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button label="Start now" icon="play" size="sm" onPress={onStart} />
        {!isToday ? (
          <Button label="Set as today" variant="secondary" size="sm" onPress={onSetToday} />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  flex: { flex: 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  list: { gap: spacing.sm },
  line: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  order: { width: 22 },
  actions: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
});
