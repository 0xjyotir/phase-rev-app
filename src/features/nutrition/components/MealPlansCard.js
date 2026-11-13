/**
 * MealPlansCard — curated meal templates filtered by breakfast / lunch / dinner / snacks.
 * Web: MealPlanCardsSection.
 */
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, SectionHeader } from "@/components/ui";
import { mealPeriods, mealPlans } from "@/constants/nutrition";
import { spacing } from "@/theme";
import { MealCard } from "./MealCard";

export function MealPlansCard({ onAddMeal }) {
  const [period, setPeriod] = useState("all");
  const meals = period === "all" ? mealPlans : mealPlans.filter((meal) => meal.period === period);

  return (
    <View style={styles.gap}>
      <SectionHeader title="Meal plans" subtitle="Macro-aware ideas for every part of the day" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {mealPeriods.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            size="md"
            selected={period === item.id}
            onPress={() => setPeriod(item.id)}
          />
        ))}
      </ScrollView>
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          meta={`${meal.cuisine} · ${meal.prepTime}`}
          onAdd={onAddMeal}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  chips: { gap: spacing.sm, paddingRight: spacing.lg },
});
