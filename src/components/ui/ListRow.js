/**
 * ListRow — a settings / navigation row, in the style of iOS inset-grouped lists:
 * colored icon tile · title + subtitle · detail · chevron.
 *
 *   <ListRow icon="users" title="Coaches" subtitle="4 specialists" onPress={…} />
 *   <ListRow icon="moon" iconTint="#5E5CE6" title="Appearance" detail="System" />
 *   <ListRow icon="log-out" title="Sign out" danger onPress={…} />
 *
 * Put rows inside <ListSection> to get the rounded group and inset separators.
 */
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export function ListRow({
  icon,
  iconColor,
  iconTint,
  title,
  subtitle,
  detail,
  right,
  onPress,
  danger = false,
  accessibilityLabel,
}) {
  const { colors } = useTheme();
  const tileColor = danger ? colors.danger : (iconTint ?? colors.accent);

  const content = (
    <>
      {icon ? (
        <View style={[styles.iconTile, { backgroundColor: tileColor }]}>
          <Icon name={icon} size={16} color={iconColor ?? "#FFFFFF"} weight="semibold" />
        </View>
      ) : null}
      <View style={styles.text}>
        <AppText variant="body" color={danger ? "danger" : "text"} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="textMuted" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {detail ? (
        <AppText variant="small" color="textMuted" numberOfLines={1} style={styles.detail}>
          {detail}
        </AppText>
      ) : null}
      {right}
      {onPress && !right ? (
        <Icon name="chevron-right" size={13} color="textTertiary" weight="bold" />
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View style={styles.row} accessibilityLabel={accessibilityLabel}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceStrong }]}
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
    minHeight: 54,
  },
  iconTile: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 1 },
  detail: { maxWidth: "45%" },
});
