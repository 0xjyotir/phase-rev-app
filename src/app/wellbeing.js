/**
 * Wellbeing check (form sheet) — the Mental pillar's "structured wellbeing
 * assessment": five statements about the last two weeks, rated Never → Always.
 * The score (0–100) and its band are saved, with a trend of past checks.
 */
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BarChart } from "@/components/charts";
import { AppText, Button, Card, Chip, Screen } from "@/components/ui";
import { wellbeingCheck } from "@/constants/mental";
import { scoreWellbeing } from "@/features/mental/lib/mind";
import { useProfile } from "@/hooks/useProfile";
import { formatShortDate } from "@/lib/dates";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export default function WellbeingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, actions } = useProfile();
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(null);
  const result = useMemo(() => scoreWellbeing(answers), [answers]);
  const past = profile.wellbeing.checks.slice(0, 6).reverse();

  const save = () => {
    if (!result) return;
    actions.saveWellbeingCheck({ score: result.score, answers });
    haptics.success();
    setSaved(result);
  };

  if (saved) {
    return (
      <Screen variant="modal" title={wellbeingCheck.title} closeLabel="Done">
        <Card style={styles.result}>
          <AppText variant="eyebrow" color="accent">
            Your score
          </AppText>
          <AppText variant="metricLarge" tabular>
            {saved.score}
            <AppText variant="h3" color="textMuted">
              {" "}
              / 100
            </AppText>
          </AppText>
          <Chip label={saved.band.label} tone={saved.band.tone} size="md" />
          <AppText variant="body" color="textMuted" align="center">
            {saved.band.message}
          </AppText>
        </Card>
        {past.length ? (
          <Card style={styles.gapMd}>
            <AppText variant="title">Your trend</AppText>
            <BarChart
              data={[...past, { createdAt: new Date().toISOString(), score: saved.score }]
                .slice(-7)
                .map((check) => ({ label: formatShortDate(check.createdAt), value: check.score }))}
              highlightIndex={Math.min(past.length, 6)}
              height={110}
            />
          </Card>
        ) : null}
        <Button label="Done" size="lg" fullWidth onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen variant="modal" title={wellbeingCheck.title}>
      <AppText variant="small" color="textMuted">
        {wellbeingCheck.intro}
      </AppText>

      {wellbeingCheck.statements.map((statement, index) => (
        <Card key={statement.id} style={styles.gapMd}>
          <AppText variant="eyebrow" color="textTertiary">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(wellbeingCheck.statements.length).padStart(2, "0")}
          </AppText>
          <AppText variant="bodyStrong">{statement.text}</AppText>
          <View style={styles.scale} accessibilityRole="radiogroup">
            {wellbeingCheck.scale.map((label, value) => {
              const selected = answers[statement.id] === value;
              return (
                <Pressable
                  key={label}
                  onPress={() => {
                    haptics.select();
                    setAnswers((current) => ({ ...current, [statement.id]: value }));
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={label}
                  style={[
                    styles.option,
                    {
                      backgroundColor: selected ? colors.accent : colors.surfaceSoft,
                    },
                  ]}
                >
                  <AppText variant="smallStrong" color={selected ? "onAccent" : "text"} tabular>
                    {value}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.scaleLabels}>
            <AppText variant="caption" color="textMuted">
              {wellbeingCheck.scale[0]}
            </AppText>
            <AppText variant="caption" color="textMuted">
              {wellbeingCheck.scale.at(-1)}
            </AppText>
          </View>
        </Card>
      ))}

      <Button
        label={
          result ? `See my score` : `Answer all ${wellbeingCheck.statements.length} to continue`
        }
        size="lg"
        fullWidth
        disabled={!result}
        onPress={save}
      />
      <AppText variant="caption" color="textMuted" align="center">
        {
          "A reflection tool, not a diagnosis. If you’re struggling, talk to someone you trust or a health professional."
        }
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gapMd: { gap: spacing.md },
  result: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxl },
  scale: { flexDirection: "row", gap: spacing.xs },
  option: {
    flex: 1,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  scaleLabels: { flexDirection: "row", justifyContent: "space-between" },
});
