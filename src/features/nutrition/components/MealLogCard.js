/**
 * MealLogCard — today's meals. Tap to tick a planned meal as eaten (macros
 * update instantly), long-press to remove, "Log a meal" for anything else.
 * Web: meal log in NutritionDashboardSection.
 */
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { AppText, Button, Card, Divider, Icon, SectionHeader } from "@/components/ui";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { spacing } from "@/theme";

export function MealLogCard({ mealLog, onToggle, onRemove, onAdd }) {
  const { colors } = useTheme();
  const eaten = mealLog.filter((meal) => meal.logged).length;

  const confirmRemove = (meal) => {
    if (!onRemove) return;
    haptics.warning();
    Alert.alert(`Remove ${meal.meal}?`, "It will be taken off today's log.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => onRemove(meal.id) },
    ]);
  };

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="Meal log"
        subtitle={`${eaten} of ${mealLog.length} meals logged today`}
        actionLabel={onAdd ? "Log a meal" : undefined}
        onActionPress={onAdd}
      />
      <View>
        {mealLog.map((meal, index) => (
          <View key={meal.id}>
            {index > 0 ? <Divider inset={40} /> : null}
            <Pressable
              onPress={() => {
                haptics.select();
                onToggle(meal.id);
              }}
              onLongPress={() => confirmRemove(meal)}
              delayLongPress={350}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: meal.logged }}
              accessibilityLabel={`${meal.meal}, ${meal.calories} calories`}
              accessibilityHint="Double-tap to mark as eaten. Long-press to remove."
            >
              <View
                style={[
                  styles.check,
                  meal.logged
                    ? { backgroundColor: colors.accent, borderColor: colors.accent }
                    : { borderColor: colors.borderStrong },
                ]}
              >
                {meal.logged ? <Icon name="check" size={13} color="onAccent" weight="bold" /> : null}
              </View>
              <View style={styles.text}>
                <AppText variant="smallStrong" color={meal.logged ? "text" : "textMuted"}>
                  {meal.meal}
                </AppText>
                <AppText variant="caption" color="textMuted">
                  {meal.logged ? meal.time : "Planned"} · P {meal.protein}g · C {meal.carbs}g · F{" "}
                  {meal.fat}g
                </AppText>
              </View>
              <AppText variant="smallStrong" tabular color={meal.logged ? "text" : "textMuted"}>
                {meal.calories}
              </AppText>
            </Pressable>
          </View>
        ))}
      </View>
      {mealLog.length === 0 && onAdd ? (
        <Button label="Log your first meal" icon="plus" variant="soft" fullWidth onPress={onAdd} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
});
