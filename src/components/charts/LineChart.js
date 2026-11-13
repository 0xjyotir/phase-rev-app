/**
 * LineChart — lightweight SVG line chart (replaces Recharts from the web app).
 *
 *   <LineChart data={[{ label: "Mon", value: 8420 }, …]} height={180} formatValue={formatVolume} />
 *
 * Measures its own width with onLayout, so it fills whatever container it's in.
 * Shows: smooth-ish line, soft area fill, dots, x labels, "Peak" / "Latest" labels.
 */
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Line, Path, Stop } from "react-native-svg";
import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { spacing } from "@/theme";

const PAD_X = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 8;

/** Show at most ~5 x-axis labels so dates never collide on narrow phones. */
const MAX_X_LABELS = 5;

export function LineChart({ data, height = 180, formatValue = String, showDots = true }) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);

  const values = data.map((point) => point.value);
  const labelStep = Math.ceil(data.length / MAX_X_LABELS);
  const showLabel = (index) =>
    index === data.length - 1 || (data.length - 1 - index) % labelStep === 0;
  const max = Math.max(...values, 0);
  const min = Math.min(...values, max);
  const span = max - min || 1;
  const chartHeight = height - PAD_TOP - PAD_BOTTOM;

  const points = data.map((point, index) => ({
    x:
      PAD_X +
      (data.length === 1
        ? (width - PAD_X * 2) / 2
        : (index / (data.length - 1)) * (width - PAD_X * 2)),
    y: PAD_TOP + chartHeight - ((point.value - min) / span) * chartHeight * 0.9,
  }));

  const linePath = buildSmoothPath(points);
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    : "";

  return (
    <View>
      <View style={styles.guides}>
        <AppText variant="caption" color="textMuted" tabular>
          Peak {formatValue(max)}
        </AppText>
        <AppText variant="caption" color="textMuted" tabular>
          Latest {formatValue(values[values.length - 1] ?? 0)}
        </AppText>
      </View>

      <View style={{ height }} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 && data.length > 0 ? (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.accent} stopOpacity={0.22} />
                <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Line
              x1={0}
              y1={height - 1}
              x2={width}
              y2={height - 1}
              stroke={colors.border}
              strokeWidth={1}
            />
            <Path d={areaPath} fill="url(#lineFill)" />
            <Path
              d={linePath}
              stroke={colors.accent}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
            />
            {showDots &&
              points.map((p, i) => (
                <Circle
                  key={data[i].label + i}
                  cx={p.x}
                  cy={p.y}
                  r={i === points.length - 1 ? 5 : 3.5}
                  fill={i === points.length - 1 ? colors.accent : colors.surface}
                  stroke={colors.accent}
                  strokeWidth={2}
                />
              ))}
          </Svg>
        ) : null}
      </View>

      <View style={styles.labels}>
        {data.map((point, index) => (
          <AppText
            key={point.label + index}
            variant="caption"
            color="textMuted"
            style={styles.label}
            numberOfLines={1}
          >
            {showLabel(index) ? point.label : ""}
          </AppText>
        ))}
      </View>
    </View>
  );
}

/** Catmull-Rom → cubic Bézier for a gently curved line through every point. */
function buildSmoothPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const tension = 0.18;
    const c1x = p1.x + (p2.x - p0.x) * tension;
    const c1y = p1.y + (p2.y - p0.y) * tension;
    const c2x = p2.x - (p3.x - p1.x) * tension;
    const c2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const styles = StyleSheet.create({
  guides: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingHorizontal: 2,
  },
  label: { flex: 1, textAlign: "center" },
});
