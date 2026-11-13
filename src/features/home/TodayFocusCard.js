/**
 * TodayFocusCard — the primary card on Home: what am I training today?
 * Web: "Today's focus" block on /rev/overview.
 *
 * States: live session (resume) · trained already · training day · rest day.
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip, Icon, ProgressBar } from "@/components/ui";
import { WEEKLY_SESSION_TARGET } from "@/constants/dashboard";
import { useActiveSession, useTodayPlan } from "@/features/workouts/hooks/useTraining";
import { useStartWorkout } from "@/features/workouts/hooks/useStartWorkout";
import { formatRelativeDay } from "@/lib/dates";
import { formatVolume, pluralize } from "@/lib/format";
import { spacing } from "@/theme";

export function TodayFocusCard({ lastSession, weekWorkouts }) {
  const router = useRouter();
  const startWorkout = useStartWorkout();
  const { routine, plan, trainedToday } = useTodayPlan();
  const { activeSession, progress } = useActiveSession();

  const title = activeSession?.session.name ?? routine?.name ?? "Rest day";
  const subtitle = activeSession
    ? `${progress.completedSets}/${progress.totalSets} sets logged`
    : plan
      ? `${plan.estimatedMinutes} min · ${pluralize("exercise", plan.exercises.length)}`
      : "Recovery is part of the program.";

  return (
    <Card active={Boolean(activeSession)} style={styles.card}>
      <View style={styles.headerRow}>
        <Icon name="flame" size={15} color="accent" />
        <AppText variant="smallMedium" color="textMuted">
          {activeSession ? "In progress" : "Today's focus"}
        </AppText>
        {trainedToday && !activeSession ? <Chip label="Done today" tone="success" /> : null}
      </View>

      <View style={styles.titleBlock}>
        <AppText variant="h2">{title}</AppText>
        <AppText variant="small" color="textMuted">
          {subtitle}
        </AppText>
      </View>

      <View style={styles.tiles}>
        <Card tone="soft" padding="md" style={styles.tile}>
          <AppText variant="caption" color="textMuted">
            Last session
          </AppText>
          <AppText variant="smallStrong" numberOfLines={1}>
            {lastSession?.name ?? "—"}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={2}>
            {lastSession
              ? `${formatRelativeDay(lastSession.performedAt)} · ${formatVolume(lastSession.volumeKg)}`
              : "No sessions yet"}
          </AppText>
        </Card>
        <Card tone="soft" padding="md" style={styles.tile}>
          <AppText variant="caption" color="textMuted">
            Weekly goal
          </AppText>
          <AppText variant="smallStrong" tabular>
            {weekWorkouts} of {WEEKLY_SESSION_TARGET} done
          </AppText>
          <ProgressBar value={weekWorkouts} max={WEEKLY_SESSION_TARGET} height={6} />
        </Card>
      </View>

      {activeSession ? (
        <Button
          label="Resume workout"
          icon="play"
          size="lg"
          fullWidth
          onPress={() => router.push("/workout/active")}
        />
      ) : routine ? (
        <View style={styles.actions}>
          <Button
            label={trainedToday ? "Train again" : "Start workout"}
            icon="play"
            size="lg"
            fullWidth
            onPress={() => startWorkout()}
          />
          <Button
            label="Open workouts"
            variant="secondary"
            fullWidth
            onPress={() => router.navigate("/train")}
          />
        </View>
      ) : (
        <Button
          label="Pick a routine anyway"
          variant="secondary"
          icon="list"
          fullWidth
          onPress={() => router.navigate({ pathname: "/train", params: { view: "library" } })}
        />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  headerRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  titleBlock: { gap: spacing.xs },
  tiles: { flexDirection: "row", gap: spacing.sm },
  tile: { flex: 1, gap: spacing.xs },
  actions: { gap: spacing.sm },
});
