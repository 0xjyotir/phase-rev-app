/**
 * BodyWeightCard — weight trend + "log today's weight".
 * Supporting data only (CLIENT-TRAINING-SYSTEM-OVERVIEW: "Body (supporting only)").
 */
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LineChart } from "@/components/charts";
import { AppText, Button, Card, Chip, SectionHeader, TextField } from "@/components/ui";
import { formatShortDate } from "@/lib/dates";
import { haptics } from "@/lib/haptics";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

export function BodyWeightCard() {
  const bodyWeights = useTrainingStore((state) => state.bodyWeights);
  const logBodyWeight = useTrainingStore((state) => state.logBodyWeight);
  const [input, setInput] = useState("");

  const sorted = useMemo(
    () => [...bodyWeights].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [bodyWeights],
  );
  const points = sorted.map((entry) => ({
    label: formatShortDate(entry.date),
    value: entry.weightKg,
  }));
  const latest = sorted[sorted.length - 1];
  const change =
    latest && sorted.length > 1 ? Math.round((latest.weightKg - sorted[0].weightKg) * 10) / 10 : 0;

  const value = Number(input.replace(",", "."));
  const valid = value >= 30 && value <= 300;

  const save = () => {
    if (!valid) return;
    logBodyWeight(Math.round(value * 10) / 10);
    haptics.success();
    setInput("");
  };

  return (
    <Card style={styles.card}>
      <SectionHeader title="Body weight" subtitle={`Last ${points.length} check-ins`} />
      <View style={styles.headline}>
        <AppText variant="metric" tabular>
          {latest?.weightKg ?? "—"} kg
        </AppText>
        <Chip
          label={`${change > 0 ? "+" : ""}${change} kg`}
          tone={change <= 0 ? "success" : "champagne"}
        />
      </View>
      <LineChart data={points.slice(-7)} height={120} formatValue={(v) => `${v.toFixed(1)}`} />
      <View style={styles.logRow}>
        <TextField
          style={styles.flex}
          placeholder="Today's weight"
          suffix="kg"
          keyboardType="decimal-pad"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={save}
          compact
        />
        <Button label="Log" size="sm" onPress={save} disabled={!valid} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  headline: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  logRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
});
