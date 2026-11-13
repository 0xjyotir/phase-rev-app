/**
 * StatTile + StatRow — label/value pairs used everywhere numbers are shown.
 *
 *   <StatRow>
 *     <StatTile label="Sets" value="12/15" />
 *     <StatTile label="Volume" value="4,210" unit="kg" />
 *   </StatRow>
 *
 * StatTile `tone="soft"` gives the rounded inner tile look (session summary).
 */
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";

export function StatTile({
  label,
  value,
  unit,
  tone = "plain",
  size = "md",
  valueColor = "text",
  style,
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.tile,
        tone === "soft" && {
          backgroundColor: colors.surfaceSoft,
          padding: spacing.md,
          borderRadius: radius.md,
        },
        style,
      ]}
    >
      <AppText variant="caption" color="textMuted" numberOfLines={1}>
        {label}
      </AppText>
      <View style={styles.valueRow}>
        <AppText
          variant={size === "lg" ? "metric" : "metricSmall"}
          color={valueColor}
          tabular
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </AppText>
        {unit ? (
          <AppText variant="caption" color="textMuted">
            {unit}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

export function StatRow({ children, style }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tile: { flex: 1, minWidth: 0, gap: spacing.xxs },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: spacing.xs },
  row: { flexDirection: "row", gap: spacing.sm },
});
