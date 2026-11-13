/**
 * IconButton — round, icon-only button (back arrows, favorites, steppers).
 *
 *   <IconButton icon="arrow-left" onPress={router.back} accessibilityLabel="Go back" />
 *   <IconButton icon="heart" variant="soft" active={isFavorite} />
 */
import { Pressable, StyleSheet } from "react-native";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { HIT_SIZE, radius } from "@/theme";
import { Icon } from "./Icon";

export function IconButton({
  icon,
  onPress,
  variant = "surface",
  active = false,
  size = HIT_SIZE,
  iconSize = 20,
  disabled = false,
  accessibilityLabel,
  style,
}) {
  const { colors } = useTheme();

  const palette = {
    surface: { bg: colors.surface, fg: colors.text, border: colors.border },
    soft: { bg: colors.surfaceSoft, fg: colors.text, border: "transparent" },
    ghost: { bg: "transparent", fg: colors.textMuted, border: "transparent" },
    accent: { bg: colors.accent, fg: colors.onAccent, border: "transparent" },
    glass: { bg: "rgba(5,5,5,0.45)", fg: "#FFFFFF", border: "rgba(255,255,255,0.18)" },
  }[variant];

  const fg = active ? colors.accent : palette.fg;

  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        onPress?.();
      }}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
      accessibilityState={{ selected: active, disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          backgroundColor: active ? colors.accentSoft : palette.bg,
          borderColor: active ? "transparent" : palette.border,
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Icon name={icon} size={iconSize} color={fg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.4 },
});
