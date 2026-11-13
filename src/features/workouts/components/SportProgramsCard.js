/**
 * SportProgramsCard — the Athletic Performance pillar inside Train → Library.
 * Web: /athletic-performance sport cards (football, cricket, badminton).
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, Chip, Icon, SectionHeader } from "@/components/ui";
import { athleticSports } from "@/constants/pillars";
import { spacing } from "@/theme";

const SPORT_ICONS = { football: "circle", cricket: "target", badminton: "feather" };

export function SportProgramsCard() {
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
            <Icon name={SPORT_ICONS[sport.id] ?? "award"} size={18} color="accent" />
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
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  sport: { gap: spacing.sm },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
  features: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
});
