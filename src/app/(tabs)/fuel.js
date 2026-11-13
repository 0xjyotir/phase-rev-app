/**
 * Fuel — Rev Nutrition (Pillar 03).
 * Web equivalent: /rev-nutrition (hero dashboard, regional globe, command center).
 *
 * macros → water → meal log → regional meals (globe) → meal plans → week → expert
 * All writes go through useProfile().actions so they're saved per member.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Screen } from "@/components/ui";
import { HydrationCard } from "@/features/nutrition/components/HydrationCard";
import { MacroRingsCard } from "@/features/nutrition/components/MacroRingsCard";
import { MealLogCard } from "@/features/nutrition/components/MealLogCard";
import { MealPlansCard } from "@/features/nutrition/components/MealPlansCard";
import { NutritionExpertCard } from "@/features/nutrition/components/NutritionExpertCard";
import { RegionalMealsCard } from "@/features/nutrition/components/RegionalMealsCard";
import { WeeklyCaloriesCard } from "@/features/nutrition/components/WeeklyCaloriesCard";
import { useProfile } from "@/hooks/useProfile";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

export default function FuelScreen() {
  const { profile, actions } = useProfile();
  const { nutrition } = profile;

  const addMeal = (meal) => {
    actions.addMealToLog(meal);
    haptics.success();
  };

  return (
    <Screen edges={["top"]}>
      <View style={styles.header}>
        <AppText variant="eyebrow" color="accent">
          Pillar 03 · Rev Nutrition
        </AppText>
        <AppText variant="h1">Fuel</AppText>
        <AppText variant="body" color="textMuted">
          Precision fuel for how you live and train.
        </AppText>
      </View>

      <MacroRingsCard nutrition={nutrition} />
      <HydrationCard hydration={nutrition.hydration} onAdd={actions.addWater} />
      <MealLogCard mealLog={nutrition.mealLog} onToggle={actions.toggleMealLogged} />
      <RegionalMealsCard
        selectedRegionId={nutrition.selectedRegionId}
        onSelectRegion={actions.setSelectedRegion}
        onAddMeal={addMeal}
      />
      <MealPlansCard onAddMeal={addMeal} />
      <WeeklyCaloriesCard />
      <NutritionExpertCard />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
});
