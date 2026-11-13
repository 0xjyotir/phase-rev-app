/**
 * SectionHeader — title + optional eyebrow/subtitle + optional trailing action.
 *
 *   <SectionHeader title="Recent" actionLabel="See all" onActionPress={…} />
 *   <SectionHeader size="lg" eyebrow="Pillar 03" title="Fuel today" subtitle="Macros at a glance" />
 *
 * size="md" (default) sits inside a card; size="lg" introduces a group of
 * cards on the page (like the section titles in Apple's Fitness and Health apps).
 */
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  onActionPress,
  size = "md",
  style,
}) {
  return (
    <View style={[styles.row, size === "lg" && styles.large, style]}>
      <View style={styles.text}>
        {eyebrow ? (
          <AppText variant="eyebrow" color="accent">
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant={size === "lg" ? "h3" : "title"} accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant={size === "lg" ? "small" : "caption"} color="textMuted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable
          onPress={() => {
            haptics.tap();
            onActionPress?.();
          }}
          hitSlop={12}
          accessibilityRole="button"
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}
        >
          <AppText variant="smallStrong" color="accentStrong">
            {actionLabel}
          </AppText>
          <Icon name="chevron-right" size={12} color="accentStrong" weight="bold" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  large: { marginTop: spacing.md, marginBottom: -spacing.xs, paddingHorizontal: spacing.xxs },
  text: { flex: 1, gap: 3 },
  action: { flexDirection: "row", alignItems: "center", gap: 3, paddingBottom: 2 },
});
