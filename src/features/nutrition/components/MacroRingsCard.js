/**
 * MacroRingsCard — calories ring + protein / carbs / fat rings.
 * Web: MacroVizSection (SVG macro rings) on /rev-nutrition.
 */
import { StyleSheet, View } from "react-native";
import { ProgressRing } from "@/components/charts";
import { AppText, Card, SectionHeader } from "@/components/ui";
import { toPercent } from "@/lib/format";
import { spacing } from "@/theme";

const MACROS = [
  { key: "protein", label: "Protein", color: "accent" },
  { key: "carbs", label: "Carbs", color: "accentStrong" },
  { key: "fat", label: "Fat", color: "champagne" },
];

export function MacroRingsCard({ nutrition }) {
  const { calories } = nutrition;
  const remaining = Math.max(0, calories.target - calories.current);

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="Today's macros"
        subtitle={`${remaining} kcal left to reach your target`}
      />
      <View style={styles.hero}>
        <ProgressRing
          percent={toPercent(calories.current, calories.target)}
          size={148}
          strokeWidth={12}
        >
          <AppText variant="metric" tabular>
            {calories.current}
          </AppText>
          <AppText variant="caption" color="textMuted">
            of {calories.target} kcal
          </AppText>
        </ProgressRing>
      </View>
      <View style={styles.row}>
        {MACROS.map(({ key, label, color }) => {
          const macro = nutrition[key];
          return (
            <View key={key} style={styles.macro}>
              <ProgressRing
                percent={toPercent(macro.current, macro.target)}
                size={76}
                strokeWidth={7}
                color={color}
                value={`${macro.current}g`}
              />
              <AppText variant="smallStrong">{label}</AppText>
              <AppText variant="caption" color="textMuted" tabular>
                of {macro.target}g
              </AppText>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  hero: { alignItems: "center" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  macro: { alignItems: "center", gap: 2, flex: 1 },
});
