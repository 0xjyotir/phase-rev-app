/**
 * StatTile + StatRow — label/value pairs used everywhere numbers are shown.
 *
 *   <StatRow>
 *     <StatTile label="Sets" value="12/15" />
 *     <StatTile label="Volume" value="4,210" unit="kg" icon="bar-chart-2" />
 *   </StatRow>
 *
 * tone="soft" gives the rounded inner tile (translucent fill — safe inside glass).
 * Numbers use SF Pro Rounded on iOS, with tabular digits.
 */
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export function StatTile({
  label,
  value,
  unit,
  icon,
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
        tone === "soft" && [styles.soft, { backgroundColor: colors.surfaceSoft }],
        style,
      ]}
      accessible
      accessibilityLabel={`${label}: ${value}${unit ? ` ${unit}` : ""}`}
    >
      <View style={styles.labelRow}>
        {icon ? <Icon name={icon} size={12} color="textMuted" /> : null}
        <AppText variant="caption" color="textMuted" numberOfLines={1}>
          {label}
        </AppText>
      </View>
      <View style={styles.valueRow}>
        <AppText
          variant={size === "lg" ? "metric" : "metricSmall"}
          color={valueColor}
          tabular
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1.3}
        >
          {value}
        </AppText>
        {unit ? (
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
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
  tile: { flex: 1, minWidth: 0, gap: 4 },
  soft: { padding: spacing.md, borderRadius: radius.md, borderCurve: "continuous" },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  row: { flexDirection: "row", gap: spacing.sm },
});
