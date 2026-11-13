/**
 * RegionalMealsCard — "Meals shaped by where you live."
 * Web: RegionalMealsSection (globe + region banner with chevrons + meal panel).
 *
 * The chosen region is saved to the member profile (setSelectedRegion), so the
 * app reopens on the same cuisine.
 */
import { useWindowDimensions, StyleSheet, View } from "react-native";
import { AppText, Card, IconButton, SectionHeader } from "@/components/ui";
import { getRegionById, nutritionRegions } from "@/constants/nutrition-regions";
import { haptics } from "@/lib/haptics";
import { GUTTER, spacing } from "@/theme";
import { MealCard } from "./MealCard";
import { RegionGlobe } from "./RegionGlobe";

export function RegionalMealsCard({ selectedRegionId, onSelectRegion, onAddMeal }) {
  const { width } = useWindowDimensions();
  const region = getRegionById(selectedRegionId);
  const index = nutritionRegions.findIndex((r) => r.id === region.id);
  const globeSize = Math.min(300, width - GUTTER * 2 - spacing.xxl * 2);

  const step = (direction) => {
    // Wrap around like the web chevrons.
    const next =
      nutritionRegions[(index + direction + nutritionRegions.length) % nutritionRegions.length];
    haptics.select();
    onSelectRegion(next.id);
  };

  return (
    <Card style={styles.card}>
      <SectionHeader
        eyebrow={`${nutritionRegions.length} global regions`}
        title="Regional meals"
        subtitle="Ingredients you can actually find, macro-balanced"
      />

      <RegionGlobe region={region} size={globeSize} />

      <View style={styles.banner}>
        <IconButton
          icon="chevron-left"
          onPress={() => step(-1)}
          accessibilityLabel="Previous region"
        />
        <View style={styles.bannerText}>
          <AppText variant="h3" align="center">
            {region.name}
          </AppText>
          <AppText variant="caption" color="textMuted" align="center">
            {region.cuisine} · {index + 1} / {nutritionRegions.length}
          </AppText>
        </View>
        <IconButton icon="chevron-right" onPress={() => step(1)} accessibilityLabel="Next region" />
      </View>

      <AppText variant="small" color="textMuted" align="center">
        {region.description}
      </AppText>

      <View style={styles.meals}>
        {region.meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} tone="soft" onAdd={onAddMeal} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  banner: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  bannerText: { flex: 1 },
  meals: { gap: spacing.sm },
});
