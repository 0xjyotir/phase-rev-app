/**
 * MindSessionsList — guided practice library (web: MeditationCardsSection).
 * Each session opens the guided player with its breathing pattern.
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Card, Chip, Icon, SectionHeader } from "@/components/ui";
import { mindSessions } from "@/constants/mental";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export function MindSessionsList() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.gap}>
      <SectionHeader title="Practice" subtitle="Guided sessions for focus, calm and reflection" />
      {mindSessions.map((session) => (
        <Card
          key={session.id}
          padding="md"
          style={styles.row}
          onPress={() =>
            router.push({
              pathname: "/breathing",
              params: { pattern: session.patternId ?? "phase-rev", title: session.title },
            })
          }
        >
          <View style={[styles.iconWell, { backgroundColor: colors.accentSoft }]}>
            <Icon name={session.icon} size={20} color="accent" />
          </View>
          <View style={styles.text}>
            <AppText variant="bodyStrong">{session.title}</AppText>
            <View style={styles.meta}>
              <Chip label={session.type} />
              <AppText variant="caption" color="textMuted">
                {session.duration} · {session.level}
              </AppText>
            </View>
          </View>
          <Icon name="play-circle" size={24} color="accent" />
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconWell: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: spacing.xs },
  meta: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
});
