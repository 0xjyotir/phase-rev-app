/**
 * ListRow — pressable settings/navigation row with icon, title, detail and chevron.
 *
 *   <ListRow icon="users" title="Coaches" subtitle="4 specialists" onPress={…} />
 *   <ListRow icon="moon" title="Appearance" detail="System" />
 */
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export function ListRow({
  icon,
  iconColor = "accent",
  title,
  subtitle,
  detail,
  right,
  onPress,
  danger = false,
}) {
  const { colors } = useTheme();

  const content = (
    <>
      {icon ? (
        <View
          style={[
            styles.iconWell,
            { backgroundColor: danger ? colors.dangerSoft : colors.accentSoft },
          ]}
        >
          <Icon name={icon} size={18} color={danger ? "danger" : iconColor} />
        </View>
      ) : null}
      <View style={styles.text}>
        <AppText variant="bodyMedium" color={danger ? "danger" : "text"} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="textMuted" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {detail ? (
        <AppText variant="small" color="textMuted">
          {detail}
        </AppText>
      ) : null}
      {right}
      {onPress && !right ? <Icon name="chevron-right" size={18} color="textMuted" /> : null}
    </>
  );

  if (!onPress) return <View style={styles.row}>{content}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceSoft }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
});
