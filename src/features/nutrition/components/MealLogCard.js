/**
 * MealLogCard — today's meals; tick to mark eaten (macros update instantly).
 * Web: meal log in NutritionDashboardSection (store method existed, UI wasn't wired — it is here).
 */
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Card, Divider, Icon, SectionHeader } from "@/components/ui";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export function MealLogCard({ mealLog, onToggle }) {
  const { colors } = useTheme();
  const eaten = mealLog.filter((meal) => meal.logged).length;

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="Meal log"
        subtitle={`${eaten} of ${mealLog.length} meals logged today`}
      />
      <View>
        {mealLog.map((meal, index) => (
          <View key={meal.id}>
            {index > 0 ? <Divider /> : null}
            <Pressable
              onPress={() => {
                haptics.select();
                onToggle(meal.id);
              }}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: meal.logged }}
              accessibilityLabel={`${meal.meal}, ${meal.calories} calories`}
            >
              <View
                style={[
                  styles.check,
                  meal.logged
                    ? { backgroundColor: colors.accent, borderColor: colors.accent }
                    : { borderColor: colors.borderStrong },
                ]}
              >
                {meal.logged ? <Icon name="check" size={14} color="onAccent" /> : null}
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
              <AppText variant="smallStrong" tabular>
                {meal.calories}
              </AppText>
            </Pressable>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md },
  check: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
});
