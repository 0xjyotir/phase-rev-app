/**
 * ProgressCards — the four headline numbers from the website's Rev overview
 * (Workouts · Nutrition score · Meditation streak · Recovery), computed live
 * from what the member logged instead of sample data.
 *
 *   Workouts    sessions this week vs last week           → Train · Progress
 *   Nutrition   how close recent days landed to target    → Fuel
 *   Mind streak days in a row with a mind practice/check-in → Mind
 *   Recovery    readiness hint (rest, load, mood)          → explains itself
 */
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { AppText, Card, Icon } from "@/components/ui";
import { getRecoveryScore } from "@/features/home/lib/recovery";
import { getMindStreak } from "@/features/mental/lib/mind";
import { getNutritionScore } from "@/features/nutrition/lib/nutrition-day";
import { useProfile } from "@/hooks/useProfile";
import { addDays, startOfWeek, toDateKey } from "@/lib/dates";
import { useTheme } from "@/providers/ThemeProvider";
import { useTrainingStore } from "@/stores/training-store";
import { radius, spacing } from "@/theme";

export function ProgressCards() {
  const router = useRouter();
  const { profile } = useProfile();
  const history = useTrainingStore((state) => state.history);

  const stats = useMemo(() => {
    const monday = startOfWeek();
    const lastMonday = addDays(monday, -7);
    const thisWeek = history.filter((entry) => new Date(entry.performedAt) >= monday).length;
    const lastWeek = history.filter((entry) => {
      const date = new Date(entry.performedAt);
      return date >= lastMonday && date < monday;
    }).length;
    const todayMood = profile.mood.entries.find((entry) => entry.date === toDateKey());

    return {
      workouts: { value: thisWeek, change: thisWeek - lastWeek },
      nutrition: getNutritionScore(profile.nutrition),
      mind: getMindStreak({
        moodEntries: profile.mood.entries,
        journalEntries: profile.journal.entries,
        sessionLog: profile.mind.log,
      }),
      recovery: getRecoveryScore({ history, moodId: todayMood?.moodId }),
    };
  }, [history, profile]);

  const explainRecovery = () => {
    const { recovery } = stats;
    const lines = recovery.factors.map(
      (factor) => `${factor.delta >= 0 ? "+" : "−"}${Math.abs(factor.delta)}  ${factor.label}`,
    );
    Alert.alert(
      `Recovery ${recovery.score ?? "—"}%`,
      [
        "A readiness hint from your rest, recent training load and today's mood — not a medical measure.",
        "",
        ...lines,
      ].join("\n"),
    );
  };

  const change = stats.workouts.change;

  return (
    <View style={styles.grid}>
      <Tile
        icon="dumbbell"
        label="Workouts"
        value={String(stats.workouts.value)}
        unit="this week"
        detail={change === 0 ? "Same as last week" : `${change > 0 ? "+" : ""}${change} vs last week`}
        trend={change > 0 ? "up" : change < 0 ? "down" : null}
        onPress={() => router.navigate({ pathname: "/train", params: { view: "progress" } })}
      />
      <Tile
        icon="fork"
        label="Nutrition score"
        value={stats.nutrition == null ? "—" : String(stats.nutrition)}
        unit={stats.nutrition == null ? "" : "%"}
        detail="Calories & protein on target"
        onPress={() => router.navigate("/fuel")}
      />
      <Tile
        icon="brain"
        tint="champagne"
        label="Mind streak"
        value={String(stats.mind)}
        unit={stats.mind === 1 ? "day" : "days"}
        detail="Check-ins, journal & sessions"
        onPress={() => router.navigate("/mind")}
      />
      <Tile
        icon="battery-charging"
        label="Recovery"
        value={stats.recovery.score == null ? "—" : String(stats.recovery.score)}
        unit={stats.recovery.score == null ? "" : "%"}
        detail={stats.recovery.label}
        onPress={explainRecovery}
      />
    </View>
  );
}

function Tile({ icon, tint = "accent", label, value, unit, detail, trend, onPress }) {
  const { colors } = useTheme();
  const tintColor = tint === "champagne" ? colors.champagne : colors.accent;
  const tintSoft = tint === "champagne" ? colors.champagneSoft : colors.accentSoft;

  return (
    <Card padding="md" onPress={onPress} style={styles.tile} accessibilityLabel={`${label} ${value} ${unit}`}>
      <View style={styles.tileTop}>
        <View style={[styles.iconWell, { backgroundColor: tintSoft }]}>
          <Icon name={icon} size={15} color={tintColor} weight="semibold" />
        </View>
        <AppText variant="captionStrong" color="textMuted" numberOfLines={1} style={styles.flex}>
          {label}
        </AppText>
      </View>
      <View style={styles.valueRow}>
        <AppText variant="metric" tabular maxFontSizeMultiplier={1.25}>
          {value}
        </AppText>
        {unit ? (
          <AppText variant="caption" color="textMuted">
            {unit}
          </AppText>
        ) : null}
      </View>
      <View style={styles.detailRow}>
        {trend ? (
          <Icon
            name={trend === "up" ? "trending-up" : "trending-down"}
            size={12}
            color={trend === "up" ? "success" : "textMuted"}
          />
        ) : null}
        <AppText
          variant="caption"
          color={trend === "up" ? "success" : "textMuted"}
          numberOfLines={1}
          style={styles.flex}
        >
          {detail}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  tile: { width: "47.8%", flexGrow: 1, gap: spacing.sm },
  tileTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  iconWell: {
    width: 26,
    height: 26,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  flex: { flex: 1 },
});
