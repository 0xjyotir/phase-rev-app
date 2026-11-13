/**
 * Log a meal (sheet) — quick custom entry for anything not in the meal plans:
 * name + calories + macros. Calories auto-fill from macros (4/4/9) if left blank.
 * Tap a suggestion to start from a Phase Rev meal.
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip, Screen, TextField } from "@/components/ui";
import { mealPlans } from "@/constants/nutrition";
import { useProfile } from "@/hooks/useProfile";
import { haptics } from "@/lib/haptics";
import { GUTTER, spacing } from "@/theme";

const toNumber = (text) => {
  const value = Number(String(text).replace(",", "."));
  return Number.isFinite(value) && value >= 0 ? value : 0;
};

export default function LogMealScreen() {
  const router = useRouter();
  const { actions } = useProfile();
  const [title, setTitle] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const macroCalories = Math.round(toNumber(protein) * 4 + toNumber(carbs) * 4 + toNumber(fat) * 9);
  const totalCalories = calories ? toNumber(calories) : macroCalories;
  const canSave = title.trim().length > 0 && totalCalories > 0;

  const fill = (meal) => {
    haptics.select();
    setTitle(meal.title);
    setCalories(String(meal.calories));
    setProtein(String(meal.protein));
    setCarbs(String(meal.carbs));
    setFat(String(meal.fat));
  };

  const save = () => {
    if (!canSave) return;
    actions.addMealToLog({
      title: title.trim(),
      calories: totalCalories,
      protein: toNumber(protein),
      carbs: toNumber(carbs),
      fat: toNumber(fat),
    });
    haptics.success();
    router.back();
  };

  return (
    <Screen
      variant="modal"
      title="Log a meal"
      keyboardAware
      headerActions={[{ label: "Add", prominent: true, disabled: !canSave, onPress: save }]}
    >
      <View style={styles.gapSm}>
        <AppText variant="captionStrong" color="textMuted" style={styles.label}>
          START FROM A PHASE REV MEAL
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bleed}
          contentContainerStyle={styles.chips}
        >
          {mealPlans.map((meal) => (
            <Chip key={meal.id} label={meal.title} size="md" selected={title === meal.title} onPress={() => fill(meal)} />
          ))}
        </ScrollView>
      </View>

      <Card style={styles.gapLg}>
        <TextField label="Meal" placeholder="e.g. Paneer wrap" value={title} onChangeText={setTitle} />
        <TextField
          label="Calories"
          placeholder={macroCalories ? `${macroCalories} (from macros)` : "kcal"}
          suffix="kcal"
          keyboardType="number-pad"
          value={calories}
          onChangeText={setCalories}
        />
        <View style={styles.row}>
          <TextField style={styles.flex} label="Protein" suffix="g" keyboardType="decimal-pad" value={protein} onChangeText={setProtein} />
          <TextField style={styles.flex} label="Carbs" suffix="g" keyboardType="decimal-pad" value={carbs} onChangeText={setCarbs} />
          <TextField style={styles.flex} label="Fat" suffix="g" keyboardType="decimal-pad" value={fat} onChangeText={setFat} />
        </View>
      </Card>

      <Button
        label={canSave ? `Add ${totalCalories} kcal to today` : "Add to today"}
        icon="plus"
        size="lg"
        fullWidth
        disabled={!canSave}
        onPress={save}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  gapSm: { gap: spacing.sm },
  gapLg: { gap: spacing.lg },
  label: { marginLeft: spacing.xs },
  bleed: { marginHorizontal: -GUTTER },
  chips: { gap: spacing.sm, paddingHorizontal: GUTTER },
  row: { flexDirection: "row", gap: spacing.sm },
  flex: { flex: 1 },
});
