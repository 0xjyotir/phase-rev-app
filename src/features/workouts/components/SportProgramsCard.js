/**
 * SportProgramsCard — the Athletic Performance pillar inside Train → Library.
 * Web: /athletic-performance sport cards (football, cricket, badminton).
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Card, Chip, Icon, SectionHeader } from "@/components/ui";
import { athleticSports } from "@/constants/pillars";
import { spacing } from "@/theme";

export function SportProgramsCard() {
  const router = useRouter();
  return (
    <Card style={styles.card}>
      <SectionHeader
        eyebrow="Pillar 02 · Athletic"
        title="Sport programs"
        subtitle="Coach-led tracks for competitive athletes"
      />
      {athleticSports.map((sport) => (
        <Card key={sport.id} tone="soft" padding="md" style={styles.sport}>
          <View style={styles.header}>
            <Icon name={sport.icon ?? "award"} size={18} color="accent" />
            <AppText variant="bodyStrong" style={styles.flex}>
              {sport.title}
            </AppText>
            <Chip label="Coach-led" tone="champagne" />
          </View>
          <AppText variant="small" color="textMuted">
            {sport.tagline}
          </AppText>
          <View style={styles.features}>
            {sport.features.map((feature) => (
              <Chip key={feature} label={feature} />
            ))}
          </View>
        </Card>
      ))}
      <View style={styles.tools}>
        <Button
          label="Reaction drill"
          icon="zap"
          variant="soft"
          size="sm"
          onPress={() => router.push("/reaction")}
        />
        <Button
          label="Visualization"
          icon="eye"
          variant="soft"
          size="sm"
          onPress={() => router.push("/session/visualization")}
        />
      </View>
      <Button
        label="Athletic pillar"
        variant="ghost"
        icon="arrow-right"
        iconPosition="right"
        onPress={() => router.push("/pillar/athletic")}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  sport: { gap: spacing.sm },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
  features: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  tools: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
