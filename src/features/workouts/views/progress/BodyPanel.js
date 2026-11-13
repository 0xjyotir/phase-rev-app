/**
 * BodyPanel — Progress → Body: weight, measurements, photos, steps & water.
 * Body tracking supports training; it does not compete with it.
 */
import { StyleSheet, View } from "react-native";
import { Card, SectionHeader, StatRow, StatTile } from "@/components/ui";
import { BodyWeightCard } from "@/features/workouts/components/body/BodyWeightCard";
import { MeasurementsCard } from "@/features/workouts/components/body/MeasurementsCard";
import { ProgressPhotosCard } from "@/features/workouts/components/body/ProgressPhotosCard";
import { useProfile } from "@/hooks/useProfile";
import { spacing } from "@/theme";

export function BodyPanel() {
  const { profile } = useProfile();
  const { hydration } = profile.nutrition;

  return (
    <View style={styles.gap}>
      <BodyWeightCard />
      <MeasurementsCard />
      <ProgressPhotosCard />
      <Card style={styles.gapSm}>
        <SectionHeader title="Daily basics" subtitle="Secondary metrics" />
        <StatRow>
          <StatTile label="Steps" value="8,240" tone="soft" />
          <StatTile
            label="Water"
            value={`${hydration.current}`}
            unit={`/ ${hydration.target} ${hydration.unit}`}
            tone="soft"
          />
        </StatRow>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
  gapSm: { gap: spacing.md },
});
