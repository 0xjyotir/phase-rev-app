/**
 * RecentActivityCard — latest workouts (live from history) + other activity.
 * Web: "Recent" card on /rev/overview. Tap a workout → its summary.
 */
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Card, Chip, Divider, SectionHeader } from "@/components/ui";
import { activitySeed } from "@/constants/dashboard";
import { formatRelativeDay } from "@/lib/dates";
import { formatVolume } from "@/lib/format";
import { spacing } from "@/theme";

export function RecentActivityCard({ history }) {
  const router = useRouter();

  const workouts = history.slice(0, 3).map((entry) => ({
    id: entry.id,
    title: entry.name,
    time: `${formatRelativeDay(entry.performedAt)} · ${entry.durationMin} min · ${formatVolume(entry.volumeKg)}`,
    pillar: entry.name.startsWith("Calisthenics") ? "Calisthenics" : "Gym",
    href: `/history/${entry.id}`,
  }));
  const items = [...workouts, ...activitySeed.slice(0, 1)];

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="Recent"
        actionLabel="Workouts"
        onActionPress={() => router.navigate("/train")}
      />
      <View>
        {items.map((item, index) => (
          <View key={item.id}>
            {index > 0 ? <Divider /> : null}
            <Pressable
              disabled={!item.href}
              onPress={() => router.push(item.href)}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.text}>
                <AppText variant="smallStrong">{item.title}</AppText>
                <AppText variant="caption" color="textMuted">
                  {item.time}
                </AppText>
              </View>
              <Chip label={item.pillar} />
            </Pressable>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md },
  text: { flex: 1, gap: 2 },
});
