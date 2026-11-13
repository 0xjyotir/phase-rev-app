/**
 * EmptyState — friendly placeholder ("Rest day", "No workouts yet").
 *
 *   <EmptyState icon="moon" title="Rest day" message="Recovery is training too." action={<Button …/>} />
 */
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { Surface } from "./Surface";

export function EmptyState({ icon = "info", title, message, action, style }) {
  const { colors } = useTheme();
  return (
    <Surface solid style={[styles.box, style]}>
      <View style={[styles.iconWell, { backgroundColor: colors.accentSoft }]}>
        <Icon name={icon} size={24} color="accent" />
      </View>
      <AppText variant="title" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="small" color="textMuted" align="center" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWell: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  message: { maxWidth: 300 },
  action: { marginTop: spacing.md, alignSelf: "stretch", alignItems: "center" },
});
