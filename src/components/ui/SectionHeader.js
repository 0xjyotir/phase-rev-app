/**
 * SectionHeader — title + optional subtitle + optional right-side action.
 *
 *   <SectionHeader title="Recent" actionLabel="See all" onActionPress={…} />
 *   <SectionHeader eyebrow="Pillar 03" title="Fuel today" subtitle="Macros at a glance" />
 */
import { Pressable, StyleSheet, View } from "react-native";
import { spacing } from "@/theme";
import { AppText } from "./AppText";

export function SectionHeader({ eyebrow, title, subtitle, actionLabel, onActionPress, style }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.text}>
        {eyebrow ? (
          <AppText variant="eyebrow" color="accent">
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="title">{title}</AppText>
        {subtitle ? (
          <AppText variant="small" color="textMuted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={10} accessibilityRole="button">
          <AppText variant="smallStrong" color="accent">
            {actionLabel}
          </AppText>
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
  text: { flex: 1, gap: spacing.xxs },
});
