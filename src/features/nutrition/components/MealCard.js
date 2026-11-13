/**
 * MealCard — a catalog meal (meal plan or regional meal) with macros and
 * an "Add to today" button that logs it.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip } from "@/components/ui";
import { spacing } from "@/theme";

export function MealCard({ meal, meta, onAdd, tone = "surface" }) {
  return (
    <Card tone={tone} padding="md" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="bodyStrong">{meal.title}</AppText>
          {meta ? (
            <AppText variant="caption" color="textMuted">
              {meta}
            </AppText>
          ) : null}
        </View>
        <AppText variant="smallStrong" color="accentStrong" tabular>
          {meal.calories} kcal
        </AppText>
      </View>
      <AppText variant="small" color="textMuted">
        {meal.description}
      </AppText>
      <View style={styles.macros}>
        <Macro label="Protein" value={meal.protein} />
        <Macro label="Carbs" value={meal.carbs} />
        <Macro label="Fat" value={meal.fat} />
      </View>
      <View style={styles.footer}>
        <View style={styles.tags}>
          {meal.tags.slice(0, 2).map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </View>
        {onAdd ? (
          <Button label="Add" icon="plus" variant="soft" size="sm" onPress={() => onAdd(meal)} />
        ) : null}
      </View>
    </Card>
  );
}

function Macro({ label, value }) {
  return (
    <View style={styles.macro}>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
      <AppText variant="smallStrong" tabular>
        {value}g
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  header: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  flex: { flex: 1, gap: 2 },
  macros: { flexDirection: "row", gap: spacing.xl },
  macro: { gap: 2 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  tags: { flexDirection: "row", gap: spacing.xs, flex: 1, flexWrap: "wrap" },
});
