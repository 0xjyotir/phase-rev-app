/**
 * IconButton — round, icon-only button (close, favorite, steppers, chevrons).
 *
 *   <IconButton icon="x" onPress={close} accessibilityLabel="Close" />
 *   <IconButton icon="heart" variant="ghost" active={isFavorite} />
 *   <IconButton icon="chevron-left" variant="glass" />   // over photos/video
 *
 * Variants:
 *   surface — glass circle on iOS 26+, soft fill elsewhere (default)
 *   soft    — glass on iOS 26+, translucent fill elsewhere (inside cards)
 *   ghost   — icon only
 *   accent  — cyan-tinted glass on iOS 26+, filled cyan elsewhere
 *   glass   — clear glass over media (dark fallback)
 */
import { Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/providers/ThemeProvider";
import { HIT_SIZE, radius } from "@/theme";
import { Icon } from "./Icon";
import { Surface } from "./Surface";

export function IconButton({
  icon,
  activeIcon,
  onPress,
  variant = "surface",
  active = false,
  size = HIT_SIZE,
  iconSize = 18,
  disabled = false,
  accessibilityLabel,
  style,
}) {
  const theme = useTheme();
  const { colors } = theme;

  const palette = {
    surface: { bg: colors.surfaceSoft, fg: colors.text, glass: "regular" },
    soft: { bg: colors.surfaceSoft, fg: colors.text, glass: "regular" },
    ghost: { bg: "transparent", fg: colors.textMuted },
    accent: { bg: colors.accent, fg: colors.onAccent, glass: "regular", tint: colors.accent },
    glass: { bg: "rgba(5,5,5,0.45)", fg: "#FFFFFF", glass: "clear" },
  }[variant];

  const fg = active ? colors.accent : palette.fg;
  const shape = { width: size, height: size, borderRadius: size / 2 };
  const glyph = (
    <Icon
      name={active && activeIcon ? activeIcon : icon}
      size={iconSize}
      color={active && variant === "ghost" ? colors.danger : fg}
      weight="semibold"
    />
  );

  const body =
    theme.glass && palette.glass ? (
      <Surface
        radius={size / 2}
        variant={palette.glass}
        tint={palette.tint ?? (active && variant !== "glass" ? colors.accentSoft : undefined)}
        interactive={!disabled}
        style={[shape, styles.center]}
      >
        {glyph}
      </Surface>
    ) : (
      <View
        style={[
          shape,
          styles.center,
          { backgroundColor: active && variant !== "ghost" ? colors.accentSoft : palette.bg },
        ]}
      >
        {glyph}
      </View>
    );

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
        { borderRadius: radius.pill },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.75, transform: [{ scale: 0.94 }] },
  disabled: { opacity: 0.35 },
});
