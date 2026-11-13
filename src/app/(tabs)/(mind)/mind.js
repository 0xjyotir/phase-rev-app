/**
 * Mind — Mental Wellness (Pillar 04).
 * Web equivalent: /mental-wellness (mood tracker, breathing, sessions).
 *
 * Every practice the pillar promises, as a working tool:
 *   mood tracking      → daily check-in + week chart
 *   breathing          → guided breathing player (3 patterns)
 *   meditation         → guided session player
 *   guided journaling  → prompt-led journal
 *   CBT activities     → thought reframe
 *   wellbeing checks   → 5-statement self-assessment with history
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Card, Icon, Screen, SectionHeader, StatRow, StatTile } from "@/components/ui";
import { BreathingPreviewCard } from "@/features/mental/components/BreathingPreviewCard";
import { MindSessionsList } from "@/features/mental/components/MindSessionsList";
import { MindToolsCard } from "@/features/mental/components/MindToolsCard";
import { MoodCheckIn } from "@/features/mental/components/MoodCheckIn";
import { MoodWeekCard } from "@/features/mental/components/MoodWeekCard";
import { getMindStreak } from "@/features/mental/lib/mind";
import { useProfile } from "@/hooks/useProfile";
import { toDateKey } from "@/lib/dates";
import { spacing } from "@/theme";

export default function MindScreen() {
  const router = useRouter();
  const { profile, actions } = useProfile();
  const todayEntry = profile.mood.entries.find((entry) => entry.date === toDateKey()) ?? null;
  const streak = getMindStreak({
    moodEntries: profile.mood.entries,
    journalEntries: profile.journal.entries,
    sessionLog: profile.mind.log,
  });

  return (
    <Screen
      variant="tab"
      title="Mind"
      headerActions={[
        { label: "Journal", icon: "book-open", onPress: () => router.push("/journal") },
      ]}
    >
      <View style={styles.intro}>
        <AppText variant="eyebrow" color="accent">
          Pillar 04 · Mental Wellness
        </AppText>
        <AppText variant="small" color="textMuted">
          Train your mind like muscle.
        </AppText>
      </View>

      <MoodCheckIn
        key={todayEntry?.moodId ?? "none"}
        todayEntry={todayEntry}
        onSave={actions.setMood}
      />

      <Card>
        <StatRow>
          <StatTile label="Streak" value={streak} unit={streak === 1 ? "day" : "days"} tone="soft" valueColor="accentStrong" />
          <StatTile label="Sessions" value={profile.mind.breathingSessions} tone="soft" />
          <StatTile label="Mindful" value={profile.mind.mindfulMinutes} unit="min" tone="soft" />
        </StatRow>
      </Card>

      <MoodWeekCard entries={profile.mood.entries} />

      <SectionHeader size="lg" title="Breathe" subtitle="A one-minute reset is enough to change a session" />
      <BreathingPreviewCard />

      <SectionHeader
        size="lg"
        title="Sessions & practices"
        subtitle="Meditation, breathing, journaling and CBT-inspired activities"
      />
      <MindSessionsList />

      <SectionHeader size="lg" title="Tools" subtitle="Reflect, reframe and check in with yourself" />
      <MindToolsCard profile={profile} />

      <Card onPress={() => router.push("/pillar/mental")} style={styles.aboutRow}>
        <View style={styles.flex}>
          <AppText variant="bodyStrong">About Mental Wellness</AppText>
          <AppText variant="caption" color="textMuted">
            The practices, the science and your membership
          </AppText>
        </View>
        <Icon name="chevron-right" size={14} color="textTertiary" weight="bold" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.xs },
  aboutRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1, gap: 2 },
});
