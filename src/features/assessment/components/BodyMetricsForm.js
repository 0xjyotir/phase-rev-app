/**
 * BodyMetricsForm — step 1: height, weight, age with a metric/imperial toggle.
 *
 * Values are always stored in METRIC (cm / kg); the inputs convert on the fly
 * so switching units never loses precision.
 */
import { StyleSheet, View } from "react-native";
import { SegmentedControl, TextField } from "@/components/ui";
import { cmFromIn, inFromCm, kgFromLb, lbFromKg } from "@/features/assessment/lib/bmi";
import { spacing } from "@/theme";

const UNIT_OPTIONS = [
  { id: "metric", label: "Metric" },
  { id: "imperial", label: "Imperial" },
];

const round1 = (n) => Math.round(n * 10) / 10;
/** Empty field instead of "0" so clearing an input feels natural. */
const asText = (value) => (value ? String(value) : "");
const toNumber = (text) => {
  const n = Number(String(text).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export function BodyMetricsForm({ values, onChange, fields = ["height", "weight", "age"] }) {
  const imperial = values.unitSystem === "imperial";

  const display = {
    height: imperial ? round1(inFromCm(values.heightCm)) : values.heightCm,
    weight: imperial ? round1(lbFromKg(values.weightKg)) : values.weightKg,
    target: imperial ? round1(lbFromKg(values.targetWeightKg)) : values.targetWeightKg,
  };

  return (
    <View style={styles.gap}>
      {fields.includes("height") ? (
        <SegmentedControl
          options={UNIT_OPTIONS}
          value={values.unitSystem}
          onChange={(unitSystem) => onChange({ unitSystem })}
          size="sm"
        />
      ) : null}

      <View style={styles.row}>
        {fields.includes("height") ? (
          <TextField
            style={styles.flex}
            label="Height"
            suffix={imperial ? "in" : "cm"}
            keyboardType="decimal-pad"
            value={asText(display.height)}
            onChangeText={(text) =>
              onChange({ heightCm: round1(imperial ? cmFromIn(toNumber(text)) : toNumber(text)) })
            }
          />
        ) : null}
        {fields.includes("weight") ? (
          <TextField
            style={styles.flex}
            label="Weight"
            suffix={imperial ? "lb" : "kg"}
            keyboardType="decimal-pad"
            value={asText(display.weight)}
            onChangeText={(text) =>
              onChange({ weightKg: round1(imperial ? kgFromLb(toNumber(text)) : toNumber(text)) })
            }
          />
        ) : null}
      </View>

      {fields.includes("age") ? (
        <TextField
          label="Age"
          suffix="years"
          keyboardType="number-pad"
          value={asText(values.age)}
          onChangeText={(text) => onChange({ age: Math.round(toNumber(text)) })}
        />
      ) : null}

      {fields.includes("target") ? (
        <TextField
          label="Target weight"
          suffix={imperial ? "lb" : "kg"}
          keyboardType="decimal-pad"
          value={asText(display.target)}
          onChangeText={(text) =>
            onChange({
              targetWeightKg: round1(imperial ? kgFromLb(toNumber(text)) : toNumber(text)),
            })
          }
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
  row: { flexDirection: "row", gap: spacing.md },
  flex: { flex: 1 },
});
