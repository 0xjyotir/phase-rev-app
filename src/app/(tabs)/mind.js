/**
 * Mind — Mental Wellness (Pillar 04).
 * Web equivalent: /mental-wellness (mood tracker, breathing, sessions).
 *
 * check-in → week of moods → breathing → mindful stats → practice library
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, Screen, StatRow, StatTile } from "@/components/ui";
import { BreathingPreviewCard } from "@/features/mental/components/BreathingPreviewCard";
import { MindSessionsList } from "@/features/mental/components/MindSessionsList";
import { MoodCheckIn } from "@/features/mental/components/MoodCheckIn";
import { MoodWeekCard } from "@/features/mental/components/MoodWeekCard";
import { useProfile } from "@/hooks/useProfile";
import { toDateKey } from "@/lib/dates";
import { spacing } from "@/theme";

export default function MindScreen() {
  const { profile, actions } = useProfile();
  const todayEntry = profile.mood.entries.find((entry) => entry.date === toDateKey()) ?? null;

  return (
    <Screen edges={["top"]}>
      <View style={styles.header}>
        <AppText variant="eyebrow" color="accent">
          Pillar 04 · Mental Wellness
        </AppText>
        <AppText variant="h1">Mind</AppText>
        <AppText variant="body" color="textMuted">
          Train your mind like muscle.
        </AppText>
      </View>

      <MoodCheckIn
        key={todayEntry?.moodId ?? "none"}
        todayEntry={todayEntry}
        onSave={actions.setMood}
      />
      <MoodWeekCard entries={profile.mood.entries} />
      <BreathingPreviewCard />

      <Card>
        <StatRow>
          <StatTile label="Sessions" value={profile.mind.breathingSessions} tone="soft" />
          <StatTile
            label="Mindful minutes"
            value={profile.mind.mindfulMinutes}
            tone="soft"
            valueColor="accentStrong"
          />
        </StatRow>
      </Card>

      <MindSessionsList />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
});
