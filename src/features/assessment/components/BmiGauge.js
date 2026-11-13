/**
 * BmiGauge — horizontal 4-zone bar with a marker at the user's BMI.
 * Zones: under (<18.5) · healthy (18.5–25) · above (25–30) · high (30+).
 */
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui";
import { bmiToGaugePercent, getBmiCategory, getBmiLabel } from "@/features/assessment/lib/bmi";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

const GAUGE_MIN = 16;
const GAUGE_MAX = 35;

/** Zone widths (as % of the bar) are static, so they're computed once. */
const ZONES = [
  { from: GAUGE_MIN, until: 18.5, color: "heat1" },
  { from: 18.5, until: 25, color: "accent" },
  { from: 25, until: 30, color: "champagne" },
  { from: 30, until: GAUGE_MAX, color: "danger" },
].map((zone) => ({ ...zone, width: ((zone.until - zone.from) / (GAUGE_MAX - GAUGE_MIN)) * 100 }));

export function BmiGauge({ bmi }) {
  const { colors } = useTheme();
  const percent = bmi ? bmiToGaugePercent(bmi) : 0;
  const category = bmi ? getBmiCategory(bmi) : null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <AppText variant="caption" color="textMuted">
          Current BMI
        </AppText>
        <AppText variant="smallStrong" color={category === "normal" ? "accentStrong" : "champagne"}>
          {category ? getBmiLabel(category) : "—"}
        </AppText>
      </View>
      <AppText variant="metric" tabular>
        {bmi ? bmi.toFixed(1) : "—"}
      </AppText>
      <View style={styles.track}>
        {/* Zones are clipped to a pill shape; the marker sits outside the clip. */}
        <View style={styles.zones}>
          {ZONES.map((zone) => (
            <View
              key={zone.color}
              style={[
                styles.zone,
                { width: `${zone.width}%`, backgroundColor: colors[zone.color] },
              ]}
            />
          ))}
        </View>
        {bmi ? (
          <View
            style={[
              styles.marker,
              { left: `${percent}%`, backgroundColor: colors.text, borderColor: colors.surface },
            ]}
          />
        ) : null}
      </View>
      <View style={styles.scale}>
        {["16", "18.5", "25", "30", "35"].map((label) => (
          <AppText key={label} variant="caption" color="textMuted">
            {label}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  header: { flexDirection: "row", justifyContent: "space-between" },
  track: { height: 10, marginTop: spacing.sm },
  zones: { flexDirection: "row", height: "100%", borderRadius: radius.pill, overflow: "hidden" },
  zone: { height: "100%", opacity: 0.85 },
  marker: {
    position: "absolute",
    top: -5,
    width: 20,
    height: 20,
    marginLeft: -10,
    borderRadius: 10,
    borderWidth: 3,
  },
  scale: { flexDirection: "row", justifyContent: "space-between" },
});
