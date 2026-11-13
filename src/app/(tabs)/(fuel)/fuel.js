/**
 * Fuel — Rev Nutrition (Pillar 03).
 * Web equivalent: /rev-nutrition (hero dashboard, regional globe, command center).
 *
 * today's macros → water → meal log → regional meals (globe) → meal plans →
 * this week → expert → about the pillar
 *
 * All writes go through useProfile().actions so they're saved per member, and
 * the day rolls over at midnight (yesterday is archived for the weekly chart).
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Card, Icon, Screen, SectionHeader } from "@/components/ui";
import { regionalMealsCopy } from "@/constants/nutrition";
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
  const router = useRouter();
  const { profile, actions } = useProfile();
  const { nutrition } = profile;

  const addMeal = (meal) => {
    actions.addMealToLog(meal);
    haptics.success();
  };

  return (
    <Screen
      variant="tab"
      title="Fuel"
      lazy
      headerActions={[
        { label: "Log a meal", icon: "plus", onPress: () => router.push("/meal/new") },
      ]}
    >
      <View style={styles.intro}>
        <AppText variant="eyebrow" color="accent">
          Pillar 03 · Rev Nutrition
        </AppText>
        <AppText variant="small" color="textMuted">
          Precision fuel for how you live and train.
        </AppText>
      </View>

      <MacroRingsCard nutrition={nutrition} />
      <HydrationCard hydration={nutrition.hydration} onAdd={actions.addWater} />
      <MealLogCard
        mealLog={nutrition.mealLog}
        onToggle={actions.toggleMealLogged}
        onRemove={actions.removeMeal}
        onAdd={() => router.push("/meal/new")}
      />

      <SectionHeader
        size="lg"
        eyebrow="14 global regions"
        title={regionalMealsCopy.title}
        subtitle="Ingredients you can actually find, macro-balanced."
      />
      <RegionalMealsCard
        selectedRegionId={nutrition.selectedRegionId}
        onSelectRegion={actions.setSelectedRegion}
        onAddMeal={addMeal}
      />

      <SectionHeader
        size="lg"
        title={regionalMealsCopy.mealPlansTitle}
        subtitle="Macro-balanced meals designed by nutritionists, ready in minutes."
      />
      <MealPlansCard onAddMeal={addMeal} />

      <SectionHeader size="lg" title="This week" subtitle="Calories per day against your target" />
      <WeeklyCaloriesCard nutrition={nutrition} />

      <NutritionExpertCard />

      <Card onPress={() => router.push("/pillar/nutrition")} style={styles.aboutRow}>
        <View style={styles.flex}>
          <AppText variant="bodyStrong">About Rev Nutrition</AppText>
          <AppText variant="caption" color="textMuted">
            How the plan works, regions, membership
          </AppText>
        </View>
        <Icon name="chevron-right" size={14} color="textTertiary" weight="bold" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.xs },
  aboutRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1, gap: 2 },
});
