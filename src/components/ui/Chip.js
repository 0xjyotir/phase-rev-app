/**
 * Chip — small capsule label. Two uses:
 *
 *   Static tag:     <Chip label="High protein" />
 *   Filter toggle:  <Chip label="Chest" selected={filter === "chest"} onPress={…} />
 *
 * tone: "accent" | "neutral" | "champagne" | "success" | "danger"
 * Toggle chips are Liquid Glass on iOS 26 (like the system's filter bars): clear
 * glass when off, cyan-tinted glass when on. Status chips stay flat fills.
 */
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { Surface } from "./Surface";

export function Chip({ label, icon, tone = "neutral", selected, onPress, size = "sm", style }) {
  const theme = useTheme();
  const { colors } = theme;
  const isToggle = typeof onPress === "function";

  const tones = {
    accent: { bg: colors.accentSoft, fg: colors.accentStrong },
    neutral: { bg: colors.surfaceSoft, fg: colors.textMuted },
    champagne: { bg: colors.champagneSoft, fg: colors.champagne },
    success: { bg: colors.successSoft, fg: colors.success },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
  };
  const active = isToggle && selected;
  const scheme = active
    ? { bg: colors.accent, fg: colors.onAccent }
    : isToggle
      ? { bg: colors.surfaceSoft, fg: colors.text }
      : tones[tone];

  const content = (
    <View style={styles.row}>
      {icon ? (
        <Icon name={icon} size={size === "md" ? 14 : 12} color={scheme.fg} weight="semibold" />
      ) : null}
      <AppText
        variant={size === "md" ? "smallStrong" : "captionStrong"}
        color={scheme.fg}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </View>
  );

  const box = [styles.base, size === "md" && styles.medium];

  if (!isToggle) {
    return <View style={[box, { backgroundColor: scheme.bg }, style]}>{content}</View>;
  }

  const useGlass = theme.glass;
  return (
    <Pressable
      onPress={() => {
        haptics.select();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.75 }, style]}
    >
      {useGlass ? (
        <Surface
          radius={radius.pill}
          interactive
          tint={active ? colors.accent : undefined}
          style={box}
        >
          {content}
        </Surface>
      ) : (
        <View style={[box, { backgroundColor: scheme.bg }]}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { alignSelf: "flex-start", borderRadius: radius.pill },
  base: {
    borderRadius: radius.pill,
    borderCurve: "continuous",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 36,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 5 },
});
