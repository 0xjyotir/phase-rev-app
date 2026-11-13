/**
 * Session complete — the clean summary after "Finish workout".
 * Web: SessionComplete ("Nice work · Session complete").
 *
 * Duration · sets · volume · PRs · volume vs last time · streak,
 * then: View session · What's next · Done.
 */
import { Redirect, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  AmbientBackground,
  AppText,
  Button,
  Card,
  Icon,
  Screen,
  StatRow,
  StatTile,
} from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { useTheme } from "@/providers/ThemeProvider";
import { useTrainingStore } from "@/stores/training-store";
import { radius, spacing } from "@/theme";

export default function SessionCompleteScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const summary = useTrainingStore((state) => state.lastSummary);
  const dismissSummary = useTrainingStore((state) => state.dismissSummary);

  if (!summary) return <Redirect href="/" />;

  const close = (next) => {
    dismissSummary();
    if (next) router.replace(next);
    else router.back();
  };

  const delta = summary.volumeDeltaPercent;

  return (
    <View style={styles.root}>
      <AmbientBackground />
      <Screen
        variant="bare"
        background="transparent"
        contentStyle={styles.content}
        gap={spacing.xl}
      >
        <View style={styles.hero}>
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.accentSoft, shadowColor: colors.accent },
            ]}
          >
            <Icon name="check" size={34} color="accent" weight="bold" />
          </View>
          <AppText variant="eyebrow" color="accent">
            Nice work
          </AppText>
          <AppText variant="display" align="center">
            SESSION COMPLETE
          </AppText>
          <AppText variant="body" color="textMuted" align="center">
            {summary.name}
          </AppText>
        </View>

        <Card style={styles.card}>
          <StatRow>
            <StatTile label="Time" value={summary.durationMin} unit="min" tone="soft" size="lg" />
            <StatTile label="Sets" value={summary.sets} tone="soft" size="lg" />
          </StatRow>
          <StatRow>
            <StatTile
              label="Volume"
              value={formatNumber(summary.volumeKg)}
              unit="kg"
              tone="soft"
              size="lg"
            />
            <StatTile
              label="PRs"
              value={`+${summary.prs}`}
              tone="soft"
              size="lg"
              valueColor={summary.prs ? "success" : "text"}
            />
          </StatRow>
          <View style={[styles.footerRow, { borderTopColor: colors.separator }]}>
            <AppText variant="small" color="textMuted">
              Volume{" "}
              <AppText
                variant="smallStrong"
                color={delta == null || delta >= 0 ? "accentStrong" : "champagne"}
              >
                {delta == null ? "first time" : `${delta >= 0 ? "+" : ""}${delta}% vs last`}
              </AppText>
            </AppText>
            <AppText variant="small" color="textMuted">
              Streak{" "}
              <AppText variant="smallStrong" color="accentStrong">
                {summary.streak} days
              </AppText>
            </AppText>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            label="View session"
            size="lg"
            fullWidth
            onPress={() => close(`/history/${summary.historyId}`)}
          />
          <Button
            label="What's next"
            variant="secondary"
            fullWidth
            onPress={() => close({ pathname: "/train", params: { view: "progress" } })}
          />
          <Button label="Done" variant="ghost" fullWidth onPress={() => close()} />
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { justifyContent: "center", flexGrow: 1 },
  hero: { alignItems: "center", gap: spacing.sm },
  badge: {
    width: 84,
    height: 84,
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  card: { gap: spacing.sm },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  actions: { gap: spacing.sm },
});
