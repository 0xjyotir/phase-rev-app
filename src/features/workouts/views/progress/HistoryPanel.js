/**
 * HistoryPanel — Progress → History: every finished workout, newest first.
 */
import { StyleSheet, View } from "react-native";
import { AppText, EmptyState } from "@/components/ui";
import { HistoryCard } from "@/features/workouts/components/progress/HistoryCard";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export function HistoryPanel() {
  const history = useTrainingStore((state) => state.history);

  if (!history.length) {
    return (
      <EmptyState
        icon="clock"
        title="No workouts yet"
        message="Finish your first session and it shows up here."
      />
    );
  }

  return (
    <View style={styles.gap}>
      <AppText variant="small" color="textMuted">
        {history.length} sessions logged
      </AppText>
      {history.map((entry) => (
        <HistoryCard key={entry.id} entry={entry} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
});
