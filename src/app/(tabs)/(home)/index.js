/**
 * Today — the member's daily hub.
 * Web equivalent: /rev/overview (phaserev/src/sections/rev/rev-overview-content.tsx)
 *
 * Reading order (most actionable first):
 *   greeting → today's focus → progress at a glance → this week →
 *   fuel → mind → recent → wins → baseline prompt
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, Chip, Screen, SectionHeader } from "@/components/ui";
import { WEEKLY_SESSION_TARGET } from "@/constants/dashboard";
import { FuelSummaryCard } from "@/features/home/FuelSummaryCard";
import { MindCheckInCard } from "@/features/home/MindCheckInCard";
import { profileHeaderAction } from "@/features/home/ProfileButton";
import { ProgressCards } from "@/features/home/ProgressCards";
import { QuickLinks } from "@/features/home/QuickLinks";
import { RecentActivityCard } from "@/features/home/RecentActivityCard";
import { RecentWinsCard } from "@/features/home/RecentWinsCard";
import { TodayFocusCard } from "@/features/home/TodayFocusCard";
import { WeekStrip } from "@/features/workouts/components/WeekStrip";
import { useStreak, useWeekSchedule } from "@/features/workouts/hooks/useTraining";
import { useMember } from "@/hooks/useMember";
import { formatLongDate, getGreeting } from "@/lib/dates";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export default function TodayScreen() {
  const { firstName } = useMember();
  const history = useTrainingStore((state) => state.history);
  const week = useWeekSchedule();
  const streak = useStreak();
  const weekWorkouts = week.filter((day) => day.status === "completed").length;

  return (
    <Screen variant="tab" title="Today" headerActions={[profileHeaderAction]}>
      <View style={styles.greeting}>
        <AppText variant="eyebrow" color="accent">
          {formatLongDate()}
        </AppText>
        <AppText variant="h1">
          {getGreeting()}, {firstName ?? "there"}
        </AppText>
        <AppText variant="small" color="textMuted">
          {"Start a session, check your fuel, then review what’s next."}
        </AppText>
        <View style={styles.chips}>
          <Chip icon="flame" label={`${streak}-day streak`} tone="accent" size="md" />
          <Chip icon="target" label={`Week ${weekWorkouts}/${WEEKLY_SESSION_TARGET}`} size="md" />
        </View>
      </View>

      <TodayFocusCard lastSession={history[0]} weekWorkouts={weekWorkouts} />

      <SectionHeader size="lg" title="At a glance" subtitle="Training, fuel, mind and recovery" />
      <ProgressCards />

      <SectionHeader size="lg" title="This week" subtitle="Your training rhythm" />
      <Card style={styles.gapMd}>
        <WeekStrip days={week} showList />
      </Card>

      <SectionHeader size="lg" title="Fuel & mind" />
      <FuelSummaryCard />
      <MindCheckInCard />

      <SectionHeader size="lg" title="Activity" />
      <RecentActivityCard history={history} />
      <RecentWinsCard />

      <QuickLinks />
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { gap: spacing.sm },
  chips: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap", marginTop: spacing.xs },
  gapMd: { gap: spacing.lg },
});
