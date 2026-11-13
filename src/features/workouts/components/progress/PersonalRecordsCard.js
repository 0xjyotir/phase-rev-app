/**
 * PersonalRecordsCard — best set per exercise (weight × reps, est. 1RM).
 * Web: PersonalRecords. Tap a record → exercise detail.
 */
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Card, Divider, Icon, SectionHeader } from "@/components/ui";
import { getPersonalRecords } from "@/features/workouts/lib/training-analytics";
import { formatShortDate } from "@/lib/dates";
import { spacing } from "@/theme";

export function PersonalRecordsCard({ history, limit = 6 }) {
  const router = useRouter();
  const records = useMemo(() => getPersonalRecords(history).slice(0, limit), [history, limit]);

  return (
    <Card style={styles.card}>
      <SectionHeader title="Personal records" subtitle="Your best set for each lift" />
      <View>
        {records.map((record, index) => (
          <View key={record.exerciseId}>
            {index > 0 ? <Divider /> : null}
            <Pressable
              onPress={() => router.push(`/exercise/${record.exerciseId}`)}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
            >
              <Icon name="award" size={18} color="champagne" />
              <View style={styles.text}>
                <AppText variant="smallStrong" numberOfLines={1}>
                  {record.exerciseName}
                </AppText>
                <AppText variant="caption" color="textMuted">
                  {formatShortDate(record.date)}
                  {record.e1rm ? ` · est. 1RM ${record.e1rm} kg` : ""}
                </AppText>
              </View>
              <AppText variant="smallStrong" color="accentStrong" tabular>
                {record.display}
              </AppText>
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
