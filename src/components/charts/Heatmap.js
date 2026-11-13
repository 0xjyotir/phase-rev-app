/**
 * Heatmap — month calendar where each day is shaded by training load
 * (web: `.phys-heatmap`, levels 0–3).
 *
 *   <Heatmap days={consistency.days} />   // days from getConsistency()
 *
 * Grid starts on Monday; leading blanks pad the first week.
 */
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";

const WEEKDAY_HEADERS = ["M", "T", "W", "T", "F", "S", "S"];

export function Heatmap({ days }) {
  const { colors } = useTheme();
  const leadingBlanks = days.length ? (days[0].weekday + 6) % 7 : 0;
  const cells = [...Array.from({ length: leadingBlanks }, () => null), ...days];

  const levelStyle = (level) => {
    if (level === 1) return { backgroundColor: colors.heat1 };
    if (level === 2) return { backgroundColor: colors.heat2 };
    if (level === 3) return { backgroundColor: colors.heat3 };
    return { backgroundColor: colors.surfaceSoft, borderColor: colors.border, borderWidth: 1 };
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {WEEKDAY_HEADERS.map((label, index) => (
          <AppText
            key={`${label}-${index}`}
            variant="caption"
            color="textMuted"
            style={styles.header}
          >
            {label}
          </AppText>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((day, index) =>
          day ? (
            <View
              key={day.key}
              style={[
                styles.cell,
                levelStyle(day.level),
                day.isToday && { borderColor: colors.accent, borderWidth: 2 },
              ]}
            >
              <AppText
                variant="caption"
                color={day.level >= 2 ? "onAccent" : day.level === 1 ? "accentStrong" : "textMuted"}
              >
                {day.dayOfMonth}
              </AppText>
            </View>
          ) : (
            <View key={`blank-${index}`} style={styles.cell} />
          ),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  row: { flexDirection: "row" },
  header: { width: `${100 / 7}%`, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: `${100 / 7 - 1.4}%`,
    margin: "0.7%",
    aspectRatio: 1,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
});
