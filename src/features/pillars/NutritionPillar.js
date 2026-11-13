/**
 * Rev Nutrition pillar page sections.
 * Web: /rev-nutrition (NutritionValueStrip, RegionalMealsSection teaser,
 * NutritionJourneySection, MealPlanCardsSection, NutritionExpertSection,
 * NutritionLeadCtaSection).
 *
 * The live tools (macros, water, meal log, globe) live in the Fuel tab;
 * this page tells the story and routes members there.
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip, Icon } from "@/components/ui";
import {
  mealPlans,
  nutritionJourney,
  nutritionLeadCta,
  nutritionValueProps,
  regionalMealsCopy,
} from "@/constants/nutrition";
import { nutritionRegions } from "@/constants/nutrition-regions";
import { MealCard } from "@/features/nutrition/components/MealCard";
import { NutritionExpertCard } from "@/features/nutrition/components/NutritionExpertCard";
import { useMemberLink } from "@/hooks/useMemberLink";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { FeatureTile, SectionIntro } from "./PillarParts";

export function NutritionPillar() {
  const go = useMemberLink();
  const { colors } = useTheme();

  const runStep = (action) => {
    if (action === "assessment") go("/assessment", true);
    else go("/fuel");
  };

  return (
    <>
      <View style={styles.grid}>
        {nutritionValueProps.map((item) => (
          <FeatureTile
            key={item.id}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </View>

      <SectionIntro
        eyebrow="Regional nutrition"
        headline={["MEALS SHAPED BY", "WHERE YOU LIVE."]}
        body={regionalMealsCopy.subtitle}
      />
      <Card style={styles.gapMd}>
        <View style={styles.regionHeader}>
          <View style={[styles.globe, { backgroundColor: colors.accentSoft }]}>
            <Icon name="globe" size={22} color="accent" />
          </View>
          <View style={styles.flex}>
            <AppText variant="title">{nutritionRegions.length} global regions</AppText>
            <AppText variant="caption" color="textMuted">
              Interactive globe · 3 macro-balanced meals each
            </AppText>
          </View>
        </View>
        <View style={styles.chips}>
          {nutritionRegions.map((region) => (
            <Chip key={region.id} label={region.name} />
          ))}
        </View>
        <Button label="Explore the globe" icon="globe" fullWidth onPress={() => go("/fuel")} />
      </Card>

      <SectionIntro
        eyebrow={nutritionJourney.eyebrow}
        headline={["FROM ASSESSMENT", "TO DAILY FUEL."]}
        body={nutritionJourney.subtitle}
      />
      {nutritionJourney.steps.map((step) => (
        <Card key={step.id} style={styles.step}>
          <View style={styles.stepTop}>
            <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
              <AppText variant="captionStrong" color="onAccent">
                {step.step}
              </AppText>
            </View>
            <AppText variant="title" style={styles.flex}>
              {step.title}
            </AppText>
          </View>
          <AppText variant="small" color="textMuted">
            {step.description}
          </AppText>
          <Button
            label={step.cta}
            variant="ghost"
            icon="arrow-right"
            iconPosition="right"
            size="sm"
            onPress={() => runStep(step.action)}
          />
        </Card>
      ))}

      <SectionIntro
        eyebrow="Meal plans"
        headline={["CURATED FOR EVERY", "PART OF YOUR DAY."]}
        body={regionalMealsCopy.mealPlansSubtitle}
      />
      {mealPlans.slice(0, 3).map((meal) => (
        <MealCard key={meal.id} meal={meal} meta={`${meal.cuisine} · ${meal.prepTime}`} />
      ))}
      <Button
        label={`See all ${mealPlans.length} meal plans`}
        variant="secondary"
        fullWidth
        onPress={() => go("/fuel")}
      />

      <NutritionExpertCard />

      <Card active style={styles.lead}>
        <AppText variant="eyebrow" color="accent">
          {nutritionLeadCta.eyebrow}
        </AppText>
        <AppText variant="h3">{nutritionLeadCta.title}</AppText>
        <AppText variant="small" color="textMuted">
          {nutritionLeadCta.subtitle}
        </AppText>
        <Card tone="soft" style={styles.highlight}>
          <View style={styles.priceRow}>
            <AppText variant="bodyStrong">{nutritionLeadCta.highlight.tier}</AppText>
            <AppText variant="metricSmall" tabular>
              ${nutritionLeadCta.highlight.price}
              <AppText variant="caption" color="textMuted">
                /{nutritionLeadCta.highlight.period}
              </AppText>
            </AppText>
          </View>
          {nutritionLeadCta.highlight.features.map((feature) => (
            <View key={feature} style={styles.point}>
              <Icon name="check" size={12} color="accent" weight="bold" />
              <AppText variant="smallMedium">{feature}</AppText>
            </View>
          ))}
        </Card>
        <Button
          label={nutritionLeadCta.primaryCta}
          fullWidth
          onPress={() => go("/membership", true)}
        />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  gapMd: { gap: spacing.md },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  regionHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  globe: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  step: { gap: spacing.sm },
  stepTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  lead: { gap: spacing.md },
  highlight: { gap: spacing.sm, borderRadius: radius.md },
  priceRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  point: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
});
