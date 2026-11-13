/**
 * HydrationCard — water progress with quick-add buttons.
 * Web: HydrationWidget.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Icon, ProgressBar } from "@/components/ui";
import { WATER_STEPS } from "@/constants/nutrition";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

export function HydrationCard({ hydration, onAdd }) {
  const glasses = Math.round(hydration.current / 0.25);
  const goalGlasses = Math.round(hydration.target / 0.25);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Icon name="droplet" size={18} color="accent" />
        <AppText variant="title" style={styles.flex}>
          Hydration
        </AppText>
        <AppText variant="smallStrong" tabular>
          {hydration.current} / {hydration.target} {hydration.unit}
        </AppText>
      </View>
      <ProgressBar value={hydration.current} max={hydration.target} height={10} />
      <AppText variant="caption" color="textMuted">
        {glasses} of {goalGlasses} glasses (250 ml)
      </AppText>
      <View style={styles.actions}>
        {WATER_STEPS.map((liters) => (
          <Button
            key={liters}
            label={`+${liters * 1000} ml`}
            variant="soft"
            size="sm"
            style={styles.flex}
            onPress={() => {
              haptics.select();
              onAdd(liters);
            }}
          />
        ))}
        <Button
          label="Undo"
          variant="ghost"
          size="sm"
          disabled={hydration.current <= 0}
          onPress={() => onAdd(-WATER_STEPS[0])}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1, alignSelf: "stretch" },
  actions: { flexDirection: "row", gap: spacing.sm },
});
