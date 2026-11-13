/**
 * ProgressView — Train → Progress (Training | History | Body).
 * Web: the "Progress" panel in rev-workouts-content.tsx.
 */
import { StyleSheet, View } from "react-native";
import { SegmentedControl } from "@/components/ui";
import { spacing } from "@/theme";
import { BodyPanel } from "./progress/BodyPanel";
import { HistoryPanel } from "./progress/HistoryPanel";
import { TrainingPanel } from "./progress/TrainingPanel";

const SUB_VIEWS = [
  { id: "training", label: "Training" },
  { id: "history", label: "History" },
  { id: "body", label: "Body" },
];

const PANELS = { training: TrainingPanel, history: HistoryPanel, body: BodyPanel };

export function ProgressView({ subView, onSubViewChange }) {
  const Panel = PANELS[subView] ?? TrainingPanel;
  return (
    <View style={styles.gap}>
      <SegmentedControl options={SUB_VIEWS} value={subView} onChange={onSubViewChange} size="sm" />
      <Panel />
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
});
