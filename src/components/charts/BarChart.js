/**
 * BarChart — vertical bars with an optional target line.
 *
 *   <BarChart data={[{ label: "Mon", value: 2100 }]} target={2200} />
 *
 * Bars that reach the target are drawn in the strong accent; others soft.
 * Built with plain Views (no SVG needed for rectangles).
 */
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

export function BarChart({ data, target, height = 140, highlightIndex }) {
  const { colors } = useTheme();
  const max = Math.max(...data.map((d) => d.value), target ?? 0, 1) * 1.08;
  const targetBottom = target ? (target / max) * height : null;

  return (
    <View>
      <View style={[styles.plot, { height }]}>
        {targetBottom != null ? (
          <View
            style={[styles.targetLine, { bottom: targetBottom, borderColor: colors.champagne }]}
          />
        ) : null}
        {data.map((point, index) => {
          const hit = target ? point.value >= target * 0.95 : false;
          const isHighlight = index === highlightIndex;
          return (
            <View key={point.label} style={styles.column}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(4, (point.value / max) * height),
                    backgroundColor: isHighlight || hit ? colors.accent : colors.heat2,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {data.map((point, index) => (
          <AppText
            key={point.label}
            variant="caption"
            color={index === highlightIndex ? "accentStrong" : "textMuted"}
            style={styles.label}
          >
            {point.label}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plot: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  column: { flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%" },
  bar: { width: "70%", borderRadius: radius.xs },
  targetLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: "dashed",
  },
  labels: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  label: { flex: 1, textAlign: "center" },
});
