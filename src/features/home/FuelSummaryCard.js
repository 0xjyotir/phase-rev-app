/**
 * FuelSummaryCard — calories + macros + water at a glance (web: "Fuel today").
 * Reads the member's nutrition from useProfile(); tap → Fuel tab.
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Card, Chip, Icon, ProgressBar } from "@/components/ui";
import { useProfile } from "@/hooks/useProfile";
import { toPercent } from "@/lib/format";
import { spacing } from "@/theme";

const MACROS = [
  { key: "protein", label: "Protein" },
  { key: "carbs", label: "Carbs" },
  { key: "fat", label: "Fat" },
];

export function FuelSummaryCard() {
  const router = useRouter();
  const { profile } = useProfile();
  const { calories, hydration } = profile.nutrition;

  return (
    <Card
      onPress={() => router.navigate("/fuel")}
      accessibilityLabel="Open nutrition"
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="title">Fuel today</AppText>
          <AppText variant="small" color="textMuted">
            Calories and macros at a glance
          </AppText>
        </View>
        <Chip label={`${toPercent(calories.current, calories.target)}% of goal`} />
      </View>

      <View style={styles.caloriesRow}>
        <AppText variant="metric" tabular>
          {calories.current}
        </AppText>
        <AppText variant="body" color="textMuted">
          / {calories.target} kcal
        </AppText>
      </View>

      <View style={styles.macros}>
        {MACROS.map(({ key, label }) => {
          const macro = profile.nutrition[key];
          return (
            <View key={key} style={styles.macro}>
              <View style={styles.macroHeader}>
                <AppText variant="smallMedium">{label}</AppText>
                <AppText variant="small" color="textMuted" tabular>
                  {macro.current}g / {macro.target}g
                </AppText>
              </View>
              <ProgressBar value={macro.current} max={macro.target} />
            </View>
          );
        })}
      </View>

      <Card tone="soft" padding="md" style={styles.water}>
        <Icon name="droplet" size={16} color="accent" />
        <AppText variant="smallMedium" style={styles.flex}>
          Water
        </AppText>
        <AppText variant="smallStrong" tabular>
          {hydration.current}
          {hydration.unit} / {hydration.target}
          {hydration.unit}
        </AppText>
      </Card>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  header: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  flex: { flex: 1 },
  caloriesRow: { flexDirection: "row", alignItems: "baseline", gap: spacing.sm },
  macros: { gap: spacing.md },
  macro: { gap: spacing.xs },
  macroHeader: { flexDirection: "row", justifyContent: "space-between" },
  water: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
});
