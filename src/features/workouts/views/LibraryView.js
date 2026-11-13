/**
 * LibraryView — Train → Library (Exercises | Routines).
 * Web: the "Library" panel in rev-workouts-content.tsx.
 */
import { StyleSheet, View } from "react-native";
import { SegmentedControl } from "@/components/ui";
import { spacing } from "@/theme";
import { ExercisesPanel } from "./library/ExercisesPanel";
import { RoutinesPanel } from "./library/RoutinesPanel";

const SUB_VIEWS = [
  { id: "exercises", label: "Exercises" },
  { id: "routines", label: "Routines" },
];

export function LibraryView({ subView, onSubViewChange, onAppliedToday }) {
  return (
    <View style={styles.gap}>
      <SegmentedControl options={SUB_VIEWS} value={subView} onChange={onSubViewChange} size="sm" />
      {subView === "exercises" ? (
        <ExercisesPanel />
      ) : (
        <RoutinesPanel onAppliedToday={onAppliedToday} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
});
