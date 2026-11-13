/**
 * WorkoutHeroCard — "What am I training today?" header on Train → Today.
 * Web: PhysicalHeader ("Tuesday · 3 November, Alex" / name / focus · min · exercises).
 */
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip } from "@/components/ui";
import { formatLongDate } from "@/lib/dates";
import { spacing } from "@/theme";
import { pluralize } from "@/lib/format";

export function WorkoutHeroCard({
  plan,
  firstName,
  isOverride,
  trainedToday,
  onStart,
  onChangePlan,
}) {
  const setCount = plan.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);

  return (
    <Card style={styles.card}>
      <AppText variant="small" color="textMuted">
        {formatLongDate()}
        {firstName ? `, ${firstName}` : ""}
      </AppText>

      <View style={styles.titleBlock}>
        <AppText variant="h1">{plan.name}</AppText>
        <AppText variant="body" color="textMuted">
          {plan.focus}
        </AppText>
      </View>

      <View style={styles.chips}>
        <Chip icon="clock" label={`${plan.estimatedMinutes} min`} size="md" />
        <Chip icon="layers" label={pluralize("exercise", plan.exercises.length)} size="md" />
        <Chip icon="check-square" label={pluralize("set", setCount)} size="md" />
        {isOverride ? <Chip label="Changed today" tone="champagne" size="md" /> : null}
        {trainedToday ? <Chip label="Done today" tone="success" size="md" /> : null}
      </View>

      <View style={styles.actions}>
        <Button
          label={trainedToday ? "Train again" : "Start workout"}
          icon="play"
          size="lg"
          fullWidth
          onPress={onStart}
        />
        <Button label="Change plan" variant="ghost" fullWidth onPress={onChangePlan} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  titleBlock: { gap: spacing.xs },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  actions: { gap: spacing.xs },
});
