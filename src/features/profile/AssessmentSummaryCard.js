/**
 * AssessmentSummaryCard — the saved baseline on Profile (or a prompt to take it).
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip, SectionHeader, StatRow, StatTile } from "@/components/ui";
import { assessmentActivityLevels, assessmentGoals } from "@/constants/assessment";
import { getBmiCategory, getBmiLabel } from "@/features/assessment/lib/bmi";
import { formatShortDate } from "@/lib/dates";
import { spacing } from "@/theme";

export function AssessmentSummaryCard({ assessment }) {
  const router = useRouter();

  if (!assessment) {
    return (
      <Card style={styles.card}>
        <SectionHeader
          eyebrow="2 min"
          title="Build your baseline"
          subtitle="Know where you are before you change where you're going."
        />
        <Button
          label="Start assessment"
          icon="clipboard"
          onPress={() => router.push("/assessment")}
        />
      </Card>
    );
  }

  const goal = assessmentGoals.find((g) => g.id === assessment.goalId);
  const activity = assessmentActivityLevels.find((a) => a.id === assessment.activityId);

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="Your baseline"
        subtitle={`Updated ${formatShortDate(assessment.completedAt)}`}
        actionLabel="Retake"
        onActionPress={() => router.push("/assessment")}
      />
      <StatRow>
        <StatTile label="BMI" value={assessment.bmi} tone="soft" />
        <StatTile label="Weight" value={assessment.weightKg} unit="kg" tone="soft" />
        <StatTile
          label="Target"
          value={assessment.targetWeightKg}
          unit="kg"
          tone="soft"
          valueColor="accentStrong"
        />
      </StatRow>
      <View style={styles.chips}>
        <Chip label={getBmiLabel(getBmiCategory(assessment.bmi))} tone="accent" />
        {goal ? <Chip label={goal.label} /> : null}
        {activity ? <Chip label={activity.label} /> : null}
      </View>
      <AppText variant="caption" color="textMuted">
        {assessment.heightCm} cm · {assessment.age} years
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
});
