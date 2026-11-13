/**
 * WeekStrip — Mon → Sun circles: ✓ done · ring = today · — rest · empty = upcoming.
 * Web: the "This week" card on /rev/overview and WeeklyTraining on /rev/workouts.
 *
 *   <WeekStrip days={useWeekSchedule()} />
 *   <WeekStrip days={days} showList />  // adds the routine list underneath
 */
import { StyleSheet, View } from "react-native";
import { AppText, Chip, Icon } from "@/components/ui";
import { useTheme } from "@/providers/ThemeProvider";
import { spacing } from "@/theme";

const STATUS_LABEL = {
  completed: "Done",
  today: "Today",
  missed: "Missed",
  upcoming: "",
  rest: "Rest",
};

export function WeekStrip({ days, showList = false }) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.strip}>
        {days.map((day) => {
          const circle = [styles.circle];
          let content = null;

          if (day.status === "completed") {
            circle.push({ backgroundColor: colors.accent });
            content = <Icon name="check" size={16} color="onAccent" />;
          } else if (day.status === "today") {
            circle.push({ borderWidth: 2, borderColor: colors.accent });
            content = <View style={[styles.todayDot, { backgroundColor: colors.accent }]} />;
          } else if (day.status === "missed") {
            circle.push({
              backgroundColor: colors.surfaceSoft,
              borderWidth: 1,
              borderColor: colors.borderStrong,
            });
            content = <Icon name="x" size={14} color="textMuted" />;
          } else {
            circle.push({ backgroundColor: colors.surfaceSoft });
            content =
              day.status === "rest" ? (
                <AppText variant="caption" color="textMuted">
                  —
                </AppText>
              ) : null;
          }

          return (
            <View
              key={day.key}
              style={styles.day}
              accessibilityLabel={`${day.label}: ${day.routineName ?? "Rest"}, ${day.status}`}
            >
              <AppText
                variant="caption"
                color={day.status === "today" ? "accentStrong" : "textMuted"}
              >
                {day.label.slice(0, 1)}
              </AppText>
              <View style={circle}>{content}</View>
            </View>
          );
        })}
      </View>

      {showList ? (
        <View style={[styles.list, { borderTopColor: colors.border }]}>
          {days
            .filter((day) => day.routineName)
            .map((day) => (
              <View key={`row-${day.key}`} style={styles.listRow}>
                <AppText variant="smallMedium" style={styles.flex} numberOfLines={1}>
                  {day.routineName}
                </AppText>
                <Chip
                  label={`${day.label}${STATUS_LABEL[day.status] ? ` · ${STATUS_LABEL[day.status]}` : ""}`}
                  tone={day.status === "completed" ? "accent" : "neutral"}
                />
              </View>
            ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.lg },
  strip: { flexDirection: "row", justifyContent: "space-between" },
  day: { alignItems: "center", gap: spacing.xs, flex: 1 },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  todayDot: { width: 8, height: 8, borderRadius: 4 },
  list: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.md, gap: spacing.sm },
  listRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  flex: { flex: 1 },
});
