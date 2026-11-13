/**
 * HistoryCard — one past workout in Progress → History. Tap → full summary.
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Card, Chip, Icon } from "@/components/ui";
import { formatRelativeDay, formatTimeOfDay } from "@/lib/dates";
import { formatVolume } from "@/lib/format";
import { spacing } from "@/theme";

export function HistoryCard({ entry }) {
  const router = useRouter();

  return (
    <Card padding="md" onPress={() => router.push(`/history/${entry.id}`)} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="bodyStrong">{entry.name}</AppText>
          <AppText variant="caption" color="textMuted">
            {formatRelativeDay(entry.performedAt)} · {formatTimeOfDay(entry.performedAt)}
          </AppText>
        </View>
        {entry.prs > 0 ? <Chip icon="award" label={`${entry.prs} PR`} tone="champagne" /> : null}
        <Icon name="chevron-right" size={18} color="textMuted" />
      </View>
      <View style={styles.stats}>
        <Stat icon="clock" value={`${entry.durationMin} min`} />
        <Stat icon="check-square" value={`${entry.sets} sets`} />
        <Stat icon="bar-chart-2" value={formatVolume(entry.volumeKg)} />
      </View>
    </Card>
  );
}

function Stat({ icon, value }) {
  return (
    <View style={styles.stat}>
      <Icon name={icon} size={14} color="textMuted" />
      <AppText variant="caption" color="textMuted" tabular>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1, gap: 2 },
  stats: { flexDirection: "row", gap: spacing.lg },
  stat: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
});
