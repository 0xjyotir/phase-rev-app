/**
 * Home — the member's daily hub.
 * Web equivalent: /rev/overview (phaserev/src/sections/rev/rev-overview-content.tsx)
 *
 * Order: greeting + streak → today's focus → this week → fuel → mind → recent → wins → links
 */
import { StyleSheet, View } from "react-native";
import { Wordmark } from "@/components/brand/Wordmark";
import { AppText, Card, Chip, Screen, SectionHeader } from "@/components/ui";
import { WEEKLY_SESSION_TARGET } from "@/constants/dashboard";
import { FuelSummaryCard } from "@/features/home/FuelSummaryCard";
import { MindCheckInCard } from "@/features/home/MindCheckInCard";
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

export default function HomeScreen() {
  const { firstName } = useMember();
  const history = useTrainingStore((state) => state.history);
  const week = useWeekSchedule();
  const streak = useStreak();
  const weekWorkouts = week.filter((day) => day.status === "completed").length;

  return (
    <Screen edges={["top"]}>
      <View style={styles.topBar}>
        <Wordmark size="sm" tone="adaptive" />
        <AppText variant="caption" color="textMuted">
          {formatLongDate()}
        </AppText>
      </View>

      <View style={styles.greeting}>
        <AppText variant="h1">
          {getGreeting()}, {firstName ?? "there"}
        </AppText>
        <AppText variant="body" color="textMuted">
          {"Your training hub for today — start a session, check fuel, then review what’s next."}
        </AppText>
        <View style={styles.chips}>
          <Chip icon="zap" label={`${streak}-day streak`} tone="accent" size="md" />
          <Chip icon="target" label={`Week ${weekWorkouts}/${WEEKLY_SESSION_TARGET}`} size="md" />
        </View>
      </View>

      <TodayFocusCard lastSession={history[0]} weekWorkouts={weekWorkouts} />

      <Card style={styles.gapMd}>
        <SectionHeader title="This week" subtitle="Your training rhythm" />
        <WeekStrip days={week} showList />
      </Card>

      <FuelSummaryCard />
      <MindCheckInCard />
      <RecentActivityCard history={history} />
      <RecentWinsCard />
      <QuickLinks />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  greeting: { gap: spacing.sm },
  chips: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap", marginTop: spacing.xs },
  gapMd: { gap: spacing.lg },
});
