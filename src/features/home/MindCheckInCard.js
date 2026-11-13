/**
 * MindCheckInCard — today's mood (or a prompt to log it) on Home.
 * Connects the Mental pillar to the daily hub — "Mental state affects consistency."
 */
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, Card, Icon } from "@/components/ui";
import { getMoodById } from "@/constants/mental";
import { useProfile } from "@/hooks/useProfile";
import { toDateKey } from "@/lib/dates";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export function MindCheckInCard() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile } = useProfile();
  const today = profile.mood.entries.find((entry) => entry.date === toDateKey());
  const mood = today ? getMoodById(today.moodId) : null;

  return (
    <Card
      onPress={() => router.navigate("/mind")}
      accessibilityLabel="Open mental wellness"
      style={styles.card}
    >
      <View style={[styles.iconWell, { backgroundColor: colors.champagneSoft }]}>
        <Icon name={mood?.icon ?? "wind"} size={20} color="champagne" />
      </View>
      <View style={styles.text}>
        <AppText variant="smallMedium" color="textMuted">
          Mind
        </AppText>
        <AppText variant="bodyStrong">
          {mood ? `Feeling ${mood.label.toLowerCase()} today` : "How are you today?"}
        </AppText>
        <AppText variant="caption" color="textMuted">
          {mood
            ? "Take a 2-minute reset breath before training."
            : "A 5-second check-in builds insight over time."}
        </AppText>
      </View>
      <Icon name="chevron-right" size={18} color="textMuted" />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconWell: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
});
