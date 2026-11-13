/**
 * HistoryExerciseList — what was lifted in a finished session, set by set.
 * Used by history/[id] (full summary of a past workout).
 */
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Card, Chip } from "@/components/ui";
import { getExerciseById } from "@/constants/exercises";
import { formatSet, getBestSet, totalVolume } from "@/features/workouts/lib/workout-math";
import { formatVolume } from "@/lib/format";
import { spacing } from "@/theme";

export function HistoryExerciseList({ exercises }) {
  const router = useRouter();

  return (
    <View style={styles.list}>
      {exercises.map((exercise, index) => {
        const meta = getExerciseById(exercise.exerciseId);
        const best = getBestSet(exercise.sets);
        const volume = totalVolume(exercise.sets);
        return (
          <Card key={`${exercise.exerciseId}-${index}`} padding="md" style={styles.card}>
            <Pressable
              onPress={() => router.push(`/exercise/${exercise.exerciseId}`)}
              style={styles.header}
            >
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{meta?.name ?? exercise.exerciseId}</AppText>
                <AppText variant="caption" color="textMuted">
                  {exercise.sets.length} sets{volume ? ` · ${formatVolume(volume)}` : ""}
                </AppText>
              </View>
              {best ? <Chip label={`Best ${formatSet(best)}`} tone="accent" /> : null}
            </Pressable>
            <View style={styles.sets}>
              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <AppText variant="caption" color="textMuted" style={styles.setNumber} tabular>
                    {String(setIndex + 1).padStart(2, "0")}
                  </AppText>
                  <AppText variant="smallMedium" tabular>
                    {formatSet(set)}
                  </AppText>
                </View>
              ))}
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  card: { gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1, gap: 2 },
  sets: { gap: spacing.xs },
  setRow: { flexDirection: "row", gap: spacing.md },
  setNumber: { width: 24 },
});
