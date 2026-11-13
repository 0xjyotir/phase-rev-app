/**
 * Button — capsule buttons in the iOS 26 style.
 *
 *   <Button label="Start workout" icon="play" onPress={start} />
 *   <Button label="Change plan" variant="ghost" />
 *   <Button label="Finish" size="lg" fullWidth loading={saving} />
 *
 * Variants:
 *   primary    — prominent: cyan tinted Liquid Glass on iOS 26+, solid cyan elsewhere
 *   secondary  — neutral glass capsule (solid surface + hairline elsewhere)
 *   soft       — cyan-tinted glass on iOS 26+ (accentSoft fill elsewhere), for
 *                secondary actions inside cards
 *   ghost      — text only (accent), like a borderless system button
 *   danger     — red-tinted glass on iOS 26+ (soft red elsewhere)
 *   brand      — marketing cyan on dark media (Welcome screen)
 *   outlineLight — clear glass over photos/video
 *
 * `solid` skips the glass (use it for buttons that sit *inside* a glass panel —
 * Apple's guidance is never to stack glass on glass).
 */
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { haptics } from "@/lib/haptics";
import { splitLayoutStyle } from "@/lib/style";
import { useTheme } from "@/providers/ThemeProvider";
import { HIT_SIZE, palette, radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { Surface } from "./Surface";

const HEIGHT = { sm: 36, md: 48, lg: 54 };

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  disabled = false,
  solid = false,
  loading = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  // Disabled buttons get an opaque neutral fill instead of fading out, so a
  // floating footer button never turns see-through over the list behind it.
  const tone = disabled ? getDisabledTone(variant, theme.colors) : getTone(variant, theme.colors);
  const { outer, inner } = splitLayoutStyle(style);
  const height = HEIGHT[size] ?? HEIGHT.md;

  const handlePress = () => {
    haptics.tap();
    onPress?.();
  };

  const iconNode = icon ? (
    <Icon name={icon} size={size === "sm" ? 15 : 18} color={tone.fg} weight="semibold" />
  ) : null;

  const content = loading ? (
    <ActivityIndicator color={tone.fg} />
  ) : (
    <View style={styles.row}>
      {iconPosition === "left" && iconNode}
      {label ? (
        <AppText
          variant={size === "sm" ? "smallStrong" : "bodyStrong"}
          color={tone.fg}
          numberOfLines={1}
        >
          {label}
        </AppText>
      ) : null}
      {iconPosition === "right" && iconNode}
    </View>
  );

  const boxStyle = [
    styles.box,
    { minHeight: Math.max(height, size === "sm" ? 36 : HIT_SIZE) },
    size === "lg" && styles.large,
    size === "sm" && styles.small,
    inner,
  ];

  const useGlass = theme.glass && tone.glass && !solid;
  const surface = useGlass ? (
    <Surface
      radius={radius.pill}
      variant={tone.glass === "clear" ? "clear" : "regular"}
      tint={tone.glassTint}
      interactive={!isDisabled}
      style={boxStyle}
    >
      {content}
    </Surface>
  ) : (
    <View
      style={[
        boxStyle,
        styles.solid,
        { backgroundColor: tone.bg, borderColor: tone.border ?? "transparent" },
      ]}
    >
      {content}
    </View>
  );

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      hitSlop={size === "sm" ? 6 : 0}
      style={({ pressed }) => [
        styles.pressable,
        fullWidth && styles.fullWidth,
        outer,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {surface}
    </Pressable>
  );
}

function getDisabledTone(variant, colors) {
  if (variant === "ghost") return { bg: "transparent", fg: colors.textTertiary };
  return { bg: colors.surface, fg: colors.textTertiary, border: colors.border, glass: "regular" };
}

/** Colors (and glass treatment) per variant. */
function getTone(variant, colors) {
  switch (variant) {
    case "secondary":
      return { bg: colors.surfaceSoft, fg: colors.text, border: colors.border, glass: "regular" };
    case "ghost":
      return { bg: "transparent", fg: colors.accentStrong };
    case "soft":
      return {
        bg: colors.accentSoft,
        fg: colors.accentStrong,
        glass: "regular",
        glassTint: colors.accentSoft,
      };
    case "danger":
      return {
        bg: colors.dangerSoft,
        fg: colors.danger,
        glass: "regular",
        glassTint: colors.dangerSoft,
      };
    case "brand":
      return { bg: palette.cyan, fg: palette.cyanInk, glass: "regular", glassTint: palette.cyan };
    case "outlineLight":
      return {
        bg: "rgba(255,255,255,0.10)",
        fg: palette.navText,
        border: "rgba(255,255,255,0.22)",
        glass: "clear",
      };
    case "primary":
    default:
      return { bg: colors.accent, fg: colors.onAccent, glass: "regular", glassTint: colors.accent };
  }
}

const styles = StyleSheet.create({
  pressable: { alignSelf: "flex-start", borderRadius: radius.pill },
  box: {
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  solid: { borderWidth: StyleSheet.hairlineWidth },
  large: { paddingHorizontal: spacing.xxl },
  small: { paddingHorizontal: spacing.lg },
  fullWidth: { alignSelf: "stretch" },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
});
