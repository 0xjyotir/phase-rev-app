/**
 * ExercisePicker — searchable list of exercises to add to a routine.
 * Only shows movements for the routine's training mode that aren't added yet.
 */
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Card, Divider, Icon, TextField } from "@/components/ui";
import { exercises } from "@/constants/exercises";
import { getExerciseMeta } from "@/features/workouts/lib/labels";
import { spacing } from "@/theme";

export function ExercisePicker({ mode, excludeIds, onPick }) {
  const [query, setQuery] = useState("");

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter(
      (exercise) =>
        exercise.mode === mode &&
        !excludeIds.includes(exercise.id) &&
        (!q || exercise.name.toLowerCase().includes(q)),
    );
  }, [mode, excludeIds, query]);

  return (
    <Card padding="md" style={styles.card}>
      <TextField
        icon="search"
        placeholder="Find an exercise"
        value={query}
        onChangeText={setQuery}
        compact
      />
      <View>
        {options.length === 0 ? (
          <AppText variant="small" color="textMuted" style={styles.empty}>
            No more {mode} exercises to add.
          </AppText>
        ) : (
          options.map((exercise, index) => (
            <View key={exercise.id}>
              {index > 0 ? <Divider /> : null}
              <Pressable
                onPress={() => onPick(exercise)}
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
                accessibilityRole="button"
                accessibilityLabel={`Add ${exercise.name}`}
              >
                <View style={styles.flex}>
                  <AppText variant="smallStrong">{exercise.name}</AppText>
                  <AppText variant="caption" color="textMuted">
                    {getExerciseMeta(exercise)}
                  </AppText>
                </View>
                <Icon name="plus-circle" size={20} color="accent" />
              </Pressable>
            </View>
          ))
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md },
  flex: { flex: 1, gap: 2 },
  empty: { paddingVertical: spacing.md },
});
