/**
 * AssessmentResults — step 4: baseline summary + recommended pillar path.
 * Web: results step of AssessmentPreviewSection (members only).
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, Chip, Icon, StatRow, StatTile } from "@/components/ui";
import { assessmentActivityLevels, assessmentGoals, goalPillarPaths } from "@/constants/assessment";
import { pillars } from "@/constants/pillars";
import { estimateMaintenanceCalories, getProteinRange } from "@/features/assessment/lib/bmi";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { BmiGauge } from "./BmiGauge";

export function AssessmentResults({ values, bmi }) {
  const { colors } = useTheme();
  const goal = assessmentGoals.find((g) => g.id === values.goalId);
  const activity = assessmentActivityLevels.find((a) => a.id === values.activityId);
  const delta = Math.round((values.targetWeightKg - values.weightKg) * 10) / 10;
  const calories = estimateMaintenanceCalories({
    ...values,
    activityMultiplier: activity?.multiplier ?? 1.5,
  });
  const protein = getProteinRange(values.weightKg);
  const path = (goalPillarPaths[values.goalId] ?? []).map((id) => pillars.find((p) => p.id === id));

  return (
    <View style={styles.gap}>
      <Card style={styles.gap}>
        <BmiGauge bmi={bmi} />
        <StatRow>
          <StatTile label="Now" value={values.weightKg} unit="kg" tone="soft" />
          <StatTile label="Target" value={values.targetWeightKg} unit="kg" tone="soft" />
          <StatTile
            label="Change"
            value={`${delta > 0 ? "+" : ""}${delta}`}
            unit="kg"
            tone="soft"
            valueColor="accentStrong"
          />
        </StatRow>
      </Card>

      <Card style={styles.gapSm}>
        <AppText variant="eyebrow" color="accent">
          Starting fuel
        </AppText>
        <StatRow>
          <StatTile label="Maintenance" value={calories} unit="kcal" tone="soft" />
          <StatTile label="Protein" value={`${protein.min}–${protein.max}`} unit="g" tone="soft" />
        </StatRow>
        <AppText variant="caption" color="textMuted">
          Estimates only — your nutritionist fine-tunes real targets.
        </AppText>
      </Card>

      <Card style={styles.gapSm}>
        <AppText variant="eyebrow" color="accent">
          Recommended path
        </AppText>
        <AppText variant="bodyStrong">
          {goal?.label} · {activity?.label}
        </AppText>
        {path.map((pillar, index) =>
          pillar ? (
            <View key={pillar.id} style={[styles.pathRow, { backgroundColor: colors.surfaceSoft }]}>
              <View
                style={[
                  styles.stepBadge,
                  { backgroundColor: index === 0 ? colors.accent : colors.surface },
                ]}
              >
                <AppText variant="captionStrong" color={index === 0 ? "onAccent" : "textMuted"}>
                  {index + 1}
                </AppText>
              </View>
              <Icon name={pillar.icon} size={18} color="accent" />
              <View style={styles.flex}>
                <AppText variant="smallStrong">{pillar.label}</AppText>
                <AppText variant="caption" color="textMuted">
                  {pillar.tagline}
                </AppText>
              </View>
              {index === 0 ? <Chip label="Start here" tone="accent" /> : null}
            </View>
          ) : null,
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
  gapSm: { gap: spacing.md },
  pathRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1, gap: 2 },
});
