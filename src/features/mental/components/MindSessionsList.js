/**
 * MindSessionsList — the practice library (web: MeditationCardsSection).
 * Each practice opens the right tool: meditation → guided session,
 * breathing → breathing player, journaling → guided journal, CBT → reframe.
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Card, Chip, Icon } from "@/components/ui";
import { getSessionHref, mindSessions } from "@/constants/mental";
import { useMember } from "@/hooks/useMember";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export function MindSessionsList() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isSignedIn } = useMember();

  return (
    <View style={styles.grid}>
      {mindSessions.map((session) => (
        <Card
          key={session.id}
          padding="md"
          style={styles.tile}
          onPress={() => router.push(isSignedIn ? getSessionHref(session) : "/login")}
          accessibilityLabel={`${session.title}, ${session.type}, ${session.duration}`}
        >
          <View style={styles.top}>
            <View style={[styles.iconWell, { backgroundColor: colors.accentSoft }]}>
              <Icon name={session.icon} size={18} color="accent" />
            </View>
            <Icon name="play-circle" size={24} color="accent" />
          </View>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {session.title}
          </AppText>
          <Chip label={session.type} />
          <AppText variant="caption" color="textMuted">
            {session.duration} · {session.level}
          </AppText>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  tile: { width: "47.8%", flexGrow: 1, gap: spacing.sm },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconWell: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
