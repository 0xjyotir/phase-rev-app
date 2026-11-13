/**
 * EmptyState — dashed placeholder card (web: `.phys-empty`).
 *
 *   <EmptyState icon="calendar" title="Rest day" message="Recovery is training too." action={<Button …/>} />
 */
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export function EmptyState({ icon = "inbox", title, message, action, style }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.box,
        { borderColor: colors.borderStrong, backgroundColor: colors.surface },
        style,
      ]}
    >
      <View style={[styles.iconWell, { backgroundColor: colors.accentSoft }]}>
        <Icon name={icon} size={22} color="accent" />
      </View>
      <AppText variant="title" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="small" color="textMuted" align="center">
          {message}
        </AppText>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWell: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  action: { marginTop: spacing.sm, alignSelf: "stretch", alignItems: "center" },
});
