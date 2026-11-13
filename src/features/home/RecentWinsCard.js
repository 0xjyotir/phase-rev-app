/**
 * RecentWinsCard — unlocked achievements (web: "Recent wins").
 * Data: constants/dashboard.js → achievements (still mock, like the web build).
 */
import { StyleSheet, View } from "react-native";
import { AppText, Card, Icon, SectionHeader } from "@/components/ui";
import { achievements } from "@/constants/dashboard";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export function RecentWinsCard() {
  const { colors } = useTheme();
  const unlocked = achievements.filter((achievement) => achievement.unlocked).slice(0, 3);

  return (
    <Card style={styles.card}>
      <SectionHeader title="Recent wins" />
      {unlocked.map((achievement) => (
        <Card key={achievement.id} tone="soft" padding="md" style={styles.row}>
          <View style={[styles.iconWell, { backgroundColor: colors.champagneSoft }]}>
            <Icon name={achievement.icon} size={16} color="champagne" />
          </View>
          <View style={styles.text}>
            <AppText variant="smallStrong">{achievement.title}</AppText>
            <AppText variant="caption" color="textMuted">
              {achievement.description}
            </AppText>
          </View>
        </Card>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
});
