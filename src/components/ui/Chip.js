/**
 * Chip — small pill label. Two uses:
 *
 *   Static tag:     <Chip label="High protein" />
 *   Filter toggle:  <Chip label="Chest" selected={filter === "chest"} onPress={…} />
 *
 * tone: "accent" (cyan soft, like .phys-chip) | "neutral" | "champagne" | "success" | "danger"
 */
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

export function Chip({ label, icon, tone = "neutral", selected, onPress, size = "sm", style }) {
  const { colors } = useTheme();
  const isToggle = typeof onPress === "function";

  const tones = {
    accent: { bg: colors.accentSoft, fg: colors.accentStrong },
    neutral: { bg: colors.surfaceSoft, fg: colors.textMuted },
    champagne: { bg: colors.champagneSoft, fg: colors.champagne },
    success: { bg: colors.successSoft, fg: colors.success },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
  };
  const active = isToggle && selected;
  const palette = active
    ? { bg: colors.accent, fg: colors.onAccent }
    : isToggle
      ? { bg: colors.surface, fg: colors.text }
      : tones[tone];

  const content = (
    <View style={styles.row}>
      {icon ? <Icon name={icon} size={size === "md" ? 15 : 13} color={palette.fg} /> : null}
      <AppText variant={size === "md" ? "smallStrong" : "captionStrong"} color={palette.fg}>
        {label}
      </AppText>
    </View>
  );

  const baseStyle = [
    styles.base,
    size === "md" && styles.medium,
    { backgroundColor: palette.bg },
    isToggle && !active && { borderColor: colors.border, borderWidth: 1 },
    style,
  ];

  if (!isToggle) return <View style={baseStyle}>{content}</View>;

  return (
    <Pressable
      onPress={() => {
        haptics.select();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      style={({ pressed }) => [baseStyle, pressed && { opacity: 0.8 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    alignSelf: "flex-start",
  },
  medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 36,
    justifyContent: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
});
